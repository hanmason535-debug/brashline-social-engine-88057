/**
 * Stripe Webhook Handler
 * POST /api/stripe/webhook
 * 
 * Handles Stripe webhook events for payments, subscriptions, and invoices
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import Stripe from "stripe";
import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Disable body parsing - we need the raw body for signature verification
export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper to get raw body
async function getRawBody(req: VercelRequest): Promise<Buffer> {
  const chunks: Buffer[] = [];
  return new Promise((resolve, reject) => {
    req.on("data", (chunk: Buffer) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ 
      success: false, 
      error: { code: "METHOD_NOT_ALLOWED", message: "Method not allowed" } 
    });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET not configured");
    return res.status(500).json({
      success: false,
      error: { code: "CONFIG_ERROR", message: "Webhook secret not configured" },
    });
  }

  try {
    const rawBody = await getRawBody(req);
    const signature = req.headers["stripe-signature"] as string;

    if (!signature) {
      return res.status(400).json({
        success: false,
        error: { code: "MISSING_SIGNATURE", message: "Missing stripe-signature header" },
      });
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return res.status(400).json({
        success: false,
        error: { code: "INVALID_SIGNATURE", message: "Invalid webhook signature" },
      });
    }

    const sql = neon(process.env.DATABASE_URL!);

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(sql, session);
        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentIntentSucceeded(sql, paymentIntent);
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentIntentFailed(sql, paymentIntent);
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(sql, subscription);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(sql, subscription);
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaid(sql, invoice);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentFailed(sql, invoice);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return res.status(500).json({
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Webhook handler failed" },
    });
  }
}

// Event handlers
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SqlClient = any;

async function handleCheckoutSessionCompleted(
  sql: SqlClient,
  session: Stripe.Checkout.Session
) {
  console.log("Checkout session completed:", session.id);
  
  const userId = session.metadata?.userId;
  const customerId = session.customer as string;
  
  if (session.mode === "subscription" && session.subscription) {
    // Subscription will be handled by subscription.created event
    console.log("Subscription created via checkout:", session.subscription);
  } else if (session.mode === "payment" && session.payment_intent) {
    // One-time payment - will be handled by payment_intent.succeeded
    console.log("One-time payment via checkout:", session.payment_intent);
  }

  // Ensure customer is linked to user if we have userId
  if (userId && customerId) {
    await sql`
      INSERT INTO stripe_customers (user_id, stripe_customer_id, email)
      VALUES (${userId}, ${customerId}, ${session.customer_email || ''})
      ON CONFLICT (user_id) DO UPDATE SET stripe_customer_id = ${customerId}
    `.catch(console.error);
  }
}

async function handlePaymentIntentSucceeded(
  sql: SqlClient,
  paymentIntent: Stripe.PaymentIntent
) {
  console.log("Payment succeeded:", paymentIntent.id);
  
  const userId = paymentIntent.metadata?.userId || null;
  
  await sql`
    INSERT INTO payments (
      stripe_payment_intent_id, 
      stripe_customer_id, 
      user_id,
      amount, 
      currency, 
      status, 
      payment_method,
      description,
      receipt_email,
      metadata
    )
    VALUES (
      ${paymentIntent.id},
      ${paymentIntent.customer as string || null},
      ${userId},
      ${paymentIntent.amount},
      ${paymentIntent.currency},
      'succeeded',
      ${paymentIntent.payment_method_types?.[0] || 'card'},
      ${paymentIntent.description || null},
      ${paymentIntent.receipt_email || null},
      ${JSON.stringify(paymentIntent.metadata)}::jsonb
    )
    ON CONFLICT (stripe_payment_intent_id) 
    DO UPDATE SET status = 'succeeded', metadata = ${JSON.stringify(paymentIntent.metadata)}::jsonb
  `;
}

async function handlePaymentIntentFailed(
  sql: SqlClient,
  paymentIntent: Stripe.PaymentIntent
) {
  console.log("Payment failed:", paymentIntent.id);
  
  const userId = paymentIntent.metadata?.userId || null;
  
  await sql`
    INSERT INTO payments (
      stripe_payment_intent_id, 
      stripe_customer_id, 
      user_id,
      amount, 
      currency, 
      status, 
      payment_method,
      description,
      metadata
    )
    VALUES (
      ${paymentIntent.id},
      ${paymentIntent.customer as string || null},
      ${userId},
      ${paymentIntent.amount},
      ${paymentIntent.currency},
      'failed',
      ${paymentIntent.payment_method_types?.[0] || 'card'},
      ${paymentIntent.description || null},
      ${JSON.stringify({ ...paymentIntent.metadata, error: paymentIntent.last_payment_error?.message })}::jsonb
    )
    ON CONFLICT (stripe_payment_intent_id) 
    DO UPDATE SET status = 'failed'
  `;
}

async function handleSubscriptionUpdated(
  sql: SqlClient,
  subscription: Stripe.Subscription
) {
  console.log("Subscription updated:", subscription.id, subscription.status);
  
  // Get user from stripe customer
  const customerResult = await sql`
    SELECT user_id FROM stripe_customers WHERE stripe_customer_id = ${subscription.customer as string}
  `;
  
  const userId = customerResult[0]?.user_id as string | null;
  
  // Get price from our database
  const priceId = subscription.items.data[0]?.price.id;
  const priceResult = await sql`
    SELECT id FROM prices WHERE stripe_price_id = ${priceId}
  `;
  
  const dbPriceId = priceResult[0]?.id as string | null;

  // Access subscription period times
  const periodStart = (subscription as any).current_period_start;
  const periodEnd = (subscription as any).current_period_end;

  await sql`
    INSERT INTO subscriptions (
      stripe_subscription_id,
      stripe_customer_id,
      user_id,
      price_id,
      status,
      current_period_start,
      current_period_end,
      cancel_at_period_end,
      metadata
    )
    VALUES (
      ${subscription.id},
      ${subscription.customer as string},
      ${userId},
      ${dbPriceId},
      ${subscription.status},
      ${new Date(periodStart * 1000).toISOString()},
      ${new Date(periodEnd * 1000).toISOString()},
      ${subscription.cancel_at_period_end},
      ${JSON.stringify(subscription.metadata)}::jsonb
    )
    ON CONFLICT (stripe_subscription_id) 
    DO UPDATE SET 
      status = ${subscription.status},
      current_period_start = ${new Date(periodStart * 1000).toISOString()},
      current_period_end = ${new Date(periodEnd * 1000).toISOString()},
      cancel_at_period_end = ${subscription.cancel_at_period_end},
      updated_at = NOW()
  `;
}

async function handleSubscriptionDeleted(
  sql: SqlClient,
  subscription: Stripe.Subscription
) {
  console.log("Subscription deleted:", subscription.id);
  
  await sql`
    UPDATE subscriptions 
    SET 
      status = 'canceled',
      canceled_at = NOW(),
      updated_at = NOW()
    WHERE stripe_subscription_id = ${subscription.id}
  `;
}

async function handleInvoicePaid(
  sql: SqlClient,
  invoice: Stripe.Invoice
) {
  console.log("Invoice paid:", invoice.id);
  
  const invoiceSubscription = (invoice as any).subscription;
  if (!invoiceSubscription) return; // Skip non-subscription invoices
  
  // Get user from stripe customer
  const customerResult = await sql`
    SELECT user_id FROM stripe_customers WHERE stripe_customer_id = ${invoice.customer as string}
  ` as any[];
  
  const userId = customerResult[0]?.user_id as string | null;
  
  // Get subscription from our database
  const subResult = await sql`
    SELECT id FROM subscriptions WHERE stripe_subscription_id = ${invoiceSubscription as string}
  ` as any[];
  
  const subscriptionId = subResult[0]?.id as string | null;
  
  await sql`
    INSERT INTO payments (
      stripe_invoice_id,
      stripe_customer_id,
      user_id,
      subscription_id,
      amount,
      currency,
      status,
      payment_method,
      receipt_email,
      receipt_url
    )
    VALUES (
      ${invoice.id},
      ${invoice.customer as string},
      ${userId},
      ${subscriptionId},
      ${invoice.amount_paid},
      ${invoice.currency},
      'succeeded',
      'card',
      ${invoice.customer_email || null},
      ${invoice.hosted_invoice_url || null}
    )
    ON CONFLICT (stripe_invoice_id) 
    DO UPDATE SET status = 'succeeded'
  `;
}

async function handleInvoicePaymentFailed(
  sql: SqlClient,
  invoice: Stripe.Invoice
) {
  console.log("Invoice payment failed:", invoice.id);
  
  // Get user from stripe customer
  const customerResult = await sql`
    SELECT user_id FROM stripe_customers WHERE stripe_customer_id = ${invoice.customer as string}
  ` as any[];
  
  const userId = customerResult[0]?.user_id as string | null;
  
  await sql`
    INSERT INTO payments (
      stripe_invoice_id,
      stripe_customer_id,
      user_id,
      amount,
      currency,
      status,
      receipt_email
    )
    VALUES (
      ${invoice.id},
      ${invoice.customer as string},
      ${userId},
      ${invoice.amount_due},
      ${invoice.currency},
      'failed',
      ${invoice.customer_email || null}
    )
    ON CONFLICT (stripe_invoice_id) 
    DO UPDATE SET status = 'failed'
  `;
}
