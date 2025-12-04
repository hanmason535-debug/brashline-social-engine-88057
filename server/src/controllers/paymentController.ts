/**
 * Payment controller
 * Handles payment-related operations and Stripe interactions
 */
import { Request, Response } from "express";
import { getSql } from "../config/database.js";
import Stripe from 'stripe';
import { stripe } from "../config/stripe.js";
import { asyncHandler, ApiError } from "../middleware/error.js";
import { logger } from "../utils/logger.js";

/**
 * Create a payment intent for one-time payments
 * POST /api/payments/create-intent
 */
export const createPaymentIntent = asyncHandler(
  async (req: Request, res: Response) => {
    const { amount, description, metadata } = req.body;
    
    // Validate amount
    if (!amount || typeof amount !== 'number' || amount < 50) {
      throw new ApiError(400, 'INVALID_AMOUNT', 'Amount must be at least $0.50 USD');
    }
    
    if (amount > 99999999) {
      throw new ApiError(400, 'INVALID_AMOUNT', 'Amount exceeds maximum allowed');
    }
    
    const sql = getSql();
    
    // Get or create Stripe customer
    let stripeCustomerId: string | null = null;
    
    if (req.auth?.userId) {
      // Get user from database
      const userResult = await sql`
        SELECT u.id, u.email, u.first_name, u.last_name, sc.stripe_customer_id
        FROM users u
        LEFT JOIN stripe_customers sc ON u.id = sc.user_id
        WHERE u.clerk_id = ${req.auth.userId}
      `;
      
      if (userResult.length > 0) {
        const user = userResult[0];
        stripeCustomerId = user.stripe_customer_id as string | null;
        
        // Create Stripe customer if doesn't exist
        if (!stripeCustomerId) {
          const customer = await stripe.customers.create({
            email: user.email as string,
            name: user.first_name && user.last_name 
              ? `${user.first_name} ${user.last_name}` 
              : undefined,
            metadata: {
              userId: user.id as string,
              clerkId: req.auth.userId,
            },
          });
          
          stripeCustomerId = customer.id;
          
          // Save Stripe customer ID to database
          await sql`
            INSERT INTO stripe_customers (user_id, stripe_customer_id, email, name)
            VALUES (
              ${user.id as string},
              ${stripeCustomerId},
              ${user.email as string},
              ${user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : null}
            )
          `;
          
          logger.info('Created Stripe customer', { 
            userId: user.id, 
            stripeCustomerId 
          });
        }
      }
    }
    
    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      customer: stripeCustomerId || undefined,
      description: description || 'Payment',
      metadata: {
        ...metadata,
        userId: req.auth?.userId || 'guest',
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });
    
    // Store payment record with pending status
    if (req.auth?.userId) {
      const userResult = await sql`SELECT id FROM users WHERE clerk_id = ${req.auth.userId}`;
      
      if (userResult.length > 0) {
        await sql`
          INSERT INTO payments (
            user_id, 
            stripe_payment_intent_id, 
            stripe_customer_id,
            amount, 
            currency, 
            status, 
            description,
            metadata
          )
          VALUES (
            ${userResult[0].id as string},
            ${paymentIntent.id},
            ${stripeCustomerId},
            ${amount},
            'usd',
            'pending',
            ${description || 'Payment'},
            ${metadata ? JSON.stringify(metadata) : null}::jsonb
          )
        `;
      }
    }
    
    logger.info('Payment intent created', {
      paymentIntentId: paymentIntent.id,
      amount,
      customer: stripeCustomerId,
    });
    
    res.json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      },
    });
  }
);

/**
 * Get payment history for authenticated user
 * GET /api/payments/history
 */
export const getPaymentHistory = asyncHandler(
  async (req: Request, res: Response) => {
    const { page = 1, limit = 20 } = req.query;
    const sql = getSql();
    
    // Get user ID
    const userResult = await sql`
      SELECT id FROM users WHERE clerk_id = ${req.auth!.userId}
    `;
    
    if (userResult.length === 0) {
      throw new ApiError(404, 'USER_NOT_FOUND', 'User not found');
    }
    
    const userId = userResult[0].id as string;
    const offset = (Number(page) - 1) * Number(limit);
    
    // Get payments
    const payments = await sql`
      SELECT 
        id,
        stripe_payment_intent_id,
        stripe_invoice_id,
        amount,
        currency,
        status,
        payment_method,
        description,
        receipt_url,
        created_at
      FROM payments
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
      LIMIT ${Number(limit)} OFFSET ${offset}
    `;
    
    const countResult = await sql`
      SELECT COUNT(*) as count FROM payments WHERE user_id = ${userId}
    `;
    
    const total = Number(countResult[0].count);
    
    res.json({
      success: true,
      data: {
        payments,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit)),
        },
      },
    });
  }
);

/**
 * Get payment status by ID
 * GET /api/payments/status/:id
 */
export const getPaymentStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const sql = getSql();
    
    // Get user ID
    const userResult = await sql`
      SELECT id FROM users WHERE clerk_id = ${req.auth!.userId}
    `;
    
    if (userResult.length === 0) {
      throw new ApiError(404, 'USER_NOT_FOUND', 'User not found');
    }
    
    const userId = userResult[0].id as string;
    
    // Get payment
    const payments = await sql`
      SELECT 
        id,
        stripe_payment_intent_id,
        stripe_invoice_id,
        amount,
        currency,
        status,
        payment_method,
        description,
        receipt_url,
        created_at
      FROM payments
      WHERE id = ${id} AND user_id = ${userId}
    `;
    
    if (payments.length === 0) {
      throw new ApiError(404, 'PAYMENT_NOT_FOUND', 'Payment not found');
    }
    
    res.json({
      success: true,
      data: payments[0],
    });
  }
);

/**
 * Get subscription status for authenticated user
 * GET /api/payments/subscription
 */
export const getSubscriptionStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const sql = getSql();
    
    // Get user ID
    const userResult = await sql`
      SELECT id FROM users WHERE clerk_id = ${req.auth!.userId}
    `;
    
    if (userResult.length === 0) {
      throw new ApiError(404, 'USER_NOT_FOUND', 'User not found');
    }
    
    const userId = userResult[0].id as string;
    
    // Get active subscription
    const subscriptions = await sql`
      SELECT 
        s.id,
        s.stripe_subscription_id,
        s.status,
        s.current_period_start,
        s.current_period_end,
        s.cancel_at_period_end,
        s.canceled_at,
        p.stripe_price_id,
        p.unit_amount,
        p.currency,
        p.interval,
        pr.name as product_name,
        pr.description as product_description
      FROM subscriptions s
      LEFT JOIN prices p ON s.price_id = p.id
      LEFT JOIN products pr ON p.product_id = pr.id
      WHERE s.user_id = ${userId}
      AND s.status IN ('active', 'trialing', 'past_due')
      ORDER BY s.created_at DESC
      LIMIT 1
    `;
    
    if (subscriptions.length === 0) {
      res.json({
        success: true,
        data: null,
      });
      return;
    }
    
    res.json({
      success: true,
      data: subscriptions[0],
    });
  }
);

/**
 * Create a Stripe Checkout Session (Express / server-side)
 * POST /api/payments/create-checkout-session
 * Body: { priceId, mode, successUrl, cancelUrl, metadata }
 */
export const createCheckoutSession = asyncHandler(async (req: Request, res: Response) => {
  const { priceId, mode = 'subscription', successUrl, cancelUrl, metadata } = req.body as {
    priceId?: string;
    mode?: 'payment' | 'subscription';
    successUrl?: string;
    cancelUrl?: string;
    metadata?: Record<string, string> | undefined;
  };

  if (!priceId || typeof priceId !== 'string') {
    throw new ApiError(400, 'INVALID_PRICE', 'Missing or invalid priceId');
  }

  if (!successUrl || !cancelUrl) {
    throw new ApiError(400, 'INVALID_URLS', 'Missing successUrl or cancelUrl');
  }

  const sql = getSql();

  // Determine user and customer
  let userId: string | null = null;
  let userEmail: string | null = null;
  let stripeCustomerId: string | null = null;

  // If using Clerk, we expect req.auth?.userId to exist
  if (req.auth?.userId) {
    const userRes = await sql`
      SELECT u.id, u.email, sc.stripe_customer_id
      FROM users u
      LEFT JOIN stripe_customers sc ON u.id = sc.user_id
      WHERE u.clerk_id = ${req.auth.userId}
    `;

    if (userRes.length > 0) {
      userId = userRes[0].id as string;
      userEmail = userRes[0].email as string;
      stripeCustomerId = userRes[0].stripe_customer_id as string | null;
    }
  }

  // If user exists but no customer, create one
  if (userId && userEmail && !stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: userEmail,
      metadata: { userId },
    });
    stripeCustomerId = customer.id;

    await sql`
      INSERT INTO stripe_customers (user_id, stripe_customer_id, email)
      VALUES (${userId}, ${stripeCustomerId}, ${userEmail})
      ON CONFLICT (user_id) DO UPDATE SET stripe_customer_id = ${stripeCustomerId}
    `;
  }

  // Build stripe checkout session params
  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    payment_method_types: ['card'],
    line_items: [
      { price: priceId, quantity: 1 }
    ],
    mode,
    success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: cancelUrl,
    metadata: {
      userId: userId || '',
      ...(metadata || {}),
    },
  };

  if (stripeCustomerId) sessionParams.customer = stripeCustomerId;
  else if (userEmail) sessionParams.customer_email = userEmail;
  if (mode === 'subscription') sessionParams.allow_promotion_codes = true;

  const session = await stripe.checkout.sessions.create(sessionParams);

  return res.json({ success: true, data: { sessionId: session.id, url: session.url } });
});

