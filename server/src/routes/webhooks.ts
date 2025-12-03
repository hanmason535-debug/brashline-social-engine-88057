/**
 * Webhook routes
 * Handles Stripe webhook events
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router, Request, Response } from "express";
import { stripe, STRIPE_WEBHOOK_SECRET } from "../config/stripe.js";
import { getSql } from "../config/database.js";
import { logger } from "../utils/logger.js";
import Stripe from "stripe";

const router = Router();

/**
 * Stripe webhook handler
 * POST /api/webhooks/stripe
 * 
 * This endpoint must receive the raw body for signature verification
 * Configure in Express: app.use('/api/webhooks/stripe', express.raw({ type: 'application/json' }), webhookRoutes);
 */
router.post("/", async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"];
  
  if (!sig) {
    logger.error("No Stripe signature found in webhook request");
    res.status(400).send("No signature");
    return;
  }
  
  let event: Stripe.Event;
  
  try {
    // Verify webhook signature
    if (STRIPE_WEBHOOK_SECRET) {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        STRIPE_WEBHOOK_SECRET
      );
    } else {
      // In development without webhook secret, parse body directly
      event = JSON.parse(req.body.toString());
      logger.warn("Processing webhook without signature verification (development only)");
    }
  } catch (err) {
    const error = err as Error;
    logger.error("Webhook signature verification failed", { error: error.message });
    res.status(400).send(`Webhook Error: ${error.message}`);
    return;
  }
  
  const sql = getSql();
  
  try {
    // Handle the event
    switch (event.type) {
      // Checkout session completed
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        logger.info("Checkout session completed", { sessionId: session.id });
        
        // Get user ID from metadata
        const userId = session.metadata?.userId;
        
        if (userId) {
          // Update payment status if it's a one-time payment
          if (session.mode === "payment" && session.payment_intent) {
            await sql`
              UPDATE payments
              SET status = 'succeeded',
                  stripe_customer_id = ${session.customer as string},
                  receipt_email = ${session.customer_details?.email || null},
                  metadata = jsonb_set(
                    COALESCE(metadata, '{}'::jsonb),
                    '{sessionId}',
                    to_jsonb(${session.id}::text)
                  )
              WHERE stripe_payment_intent_id = ${session.payment_intent as string}
            `;
            
            logger.info("Updated payment status from checkout", {
              paymentIntentId: session.payment_intent,
            });
          }
          
          // Handle subscription
          if (session.mode === "subscription" && session.subscription) {
            // The subscription.created event will handle the database insert
            logger.info("Subscription checkout completed", {
              subscriptionId: session.subscription,
            });
          }
        }
        
        break;
      }
      
      // Payment intent succeeded
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        logger.info("Payment intent succeeded", { 
          paymentIntentId: paymentIntent.id 
        });
        
        await sql`
          UPDATE payments
          SET status = 'succeeded',
              payment_method = ${paymentIntent.payment_method as string || null},
              receipt_email = ${paymentIntent.receipt_email || null}
          WHERE stripe_payment_intent_id = ${paymentIntent.id}
        `;
        
        break;
      }
      
      // Payment intent failed
      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        logger.error("Payment intent failed", { 
          paymentIntentId: paymentIntent.id,
          lastError: paymentIntent.last_payment_error?.message,
        });
        
        await sql`
          UPDATE payments
          SET status = 'failed',
              metadata = jsonb_set(
                COALESCE(metadata, '{}'::jsonb),
                '{error}',
                to_jsonb(${paymentIntent.last_payment_error?.message || 'Payment failed'}::text)
              )
          WHERE stripe_payment_intent_id = ${paymentIntent.id}
        `;
        
        break;
      }
      
      // Customer subscription created
      case "customer.subscription.created": {
        const subscription = event.data.object as Stripe.Subscription;
        logger.info("Subscription created", { subscriptionId: subscription.id });
        
        // Get user ID from customer metadata
        const customer = await stripe.customers.retrieve(subscription.customer as string);
        const userId = (customer as Stripe.Customer).metadata?.userId;
        
        if (userId) {
          // Get price information
          const priceId = subscription.items.data[0]?.price.id;
          
          // Find price in database
          const priceResult = await sql`
            SELECT id FROM prices WHERE stripe_price_id = ${priceId}
          `;
          
          // Insert subscription
          await sql`
            INSERT INTO subscriptions (
              user_id,
              stripe_subscription_id,
              stripe_customer_id,
              price_id,
              status,
              current_period_start,
              current_period_end,
              cancel_at_period_end
            )
            VALUES (
              ${userId},
              ${subscription.id},
              ${subscription.customer as string},
              ${priceResult.length > 0 ? priceResult[0].id as string : null},
              ${subscription.status},
              to_timestamp(${(subscription as any).current_period_start}),
              to_timestamp(${(subscription as any).current_period_end}),
              ${subscription.cancel_at_period_end}
            )
            ON CONFLICT (stripe_subscription_id)
            DO UPDATE SET
              status = EXCLUDED.status,
              current_period_start = EXCLUDED.current_period_start,
              current_period_end = EXCLUDED.current_period_end,
              cancel_at_period_end = EXCLUDED.cancel_at_period_end,
              updated_at = NOW()
          `;
        }
        
        break;
      }
      
      // Customer subscription updated
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        logger.info("Subscription updated", { subscriptionId: subscription.id });
        
        await sql`
          UPDATE subscriptions
          SET status = ${subscription.status},
              current_period_start = to_timestamp(${(subscription as any).current_period_start}),
              current_period_end = to_timestamp(${(subscription as any).current_period_end}),
              cancel_at_period_end = ${subscription.cancel_at_period_end},
              canceled_at = ${subscription.canceled_at ? `to_timestamp(${subscription.canceled_at})` : null},
              updated_at = NOW()
          WHERE stripe_subscription_id = ${subscription.id}
        `;
        
        break;
      }
      
      // Customer subscription deleted
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        logger.info("Subscription deleted", { subscriptionId: subscription.id });
        
        await sql`
          UPDATE subscriptions
          SET status = 'canceled',
              canceled_at = to_timestamp(${subscription.canceled_at || Math.floor(Date.now() / 1000)}),
              updated_at = NOW()
          WHERE stripe_subscription_id = ${subscription.id}
        `;
        
        break;
      }
      
      // Invoice paid
      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        logger.info("Invoice paid", { invoiceId: invoice.id });
        
        // Get user ID from customer metadata
        if (invoice.customer) {
          const customer = await stripe.customers.retrieve(invoice.customer as string);
          const userId = (customer as Stripe.Customer).metadata?.userId;
          
          const paymentIntent = (invoice as any).payment_intent;
          const subscription = (invoice as any).subscription;
          
          if (userId && paymentIntent) {
            // Record payment
            await sql`
              INSERT INTO payments (
                user_id,
                stripe_payment_intent_id,
                stripe_invoice_id,
                stripe_customer_id,
                subscription_id,
                amount,
                currency,
                status,
                description,
                receipt_url
              )
              SELECT
                ${userId},
                ${paymentIntent as string},
                ${invoice.id},
                ${invoice.customer as string},
                s.id,
                ${invoice.amount_paid},
                ${invoice.currency},
                'succeeded',
                ${invoice.description || 'Subscription payment'},
                ${invoice.hosted_invoice_url || null}
              FROM subscriptions s
              WHERE s.stripe_subscription_id = ${subscription as string}
              ON CONFLICT (stripe_payment_intent_id)
              DO UPDATE SET
                status = 'succeeded',
                receipt_url = EXCLUDED.receipt_url
            `;
          }
        }
        
        break;
      }
      
      // Invoice payment failed
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        logger.error("Invoice payment failed", { 
          invoiceId: invoice.id,
          attemptCount: invoice.attempt_count,
        });
        
        // Update payment status if exists
        const paymentIntent = (invoice as any).payment_intent;
        if (paymentIntent) {
          await sql`
            UPDATE payments
            SET status = 'failed'
            WHERE stripe_payment_intent_id = ${paymentIntent as string}
          `;
        }
        
        break;
      }
      
      default:
        logger.info("Unhandled webhook event type", { type: event.type });
    }
    
    // Return success response
    res.json({ received: true });
  } catch (error) {
    logger.error("Error processing webhook", { 
      error: error instanceof Error ? error.message : "Unknown error",
      eventType: event.type,
    });
    
    // Still return 200 to acknowledge receipt
    res.json({ received: true, error: "Processing error" });
  }
});

export default router;
