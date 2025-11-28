/**
 * Create Stripe Checkout Session
 * POST /api/stripe/create-checkout-session
 * 
 * Creates a checkout session for one-time payments or subscriptions
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import Stripe from "stripe";
import { neon } from "@neondatabase/serverless";
import { verifyToken } from "@clerk/backend";
import { z } from "zod";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const checkoutSchema = z.object({
  priceId: z.string().min(1),
  successUrl: z.string().url(),
  cancelUrl: z.string().url(),
  mode: z.enum(["payment", "subscription"]).default("subscription"),
  metadata: z.record(z.string()).optional(),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ 
      success: false, 
      error: { code: "METHOD_NOT_ALLOWED", message: "Method not allowed" } 
    });
  }

  try {
    // Validate request body
    const validation = checkoutSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid request data",
          details: validation.error.errors,
        },
      });
    }

    const { priceId, successUrl, cancelUrl, mode, metadata } = validation.data;
    const sql = neon(process.env.DATABASE_URL!);

    // Get user info if authenticated
    let userId: string | null = null;
    let userEmail: string | null = null;
    let stripeCustomerId: string | null = null;

    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      try {
        const token = authHeader.substring(7);
        const payload = await verifyToken(token, {
          secretKey: process.env.CLERK_SECRET_KEY!,
        });
        
        if (payload?.sub) {
          // Get user from database
          const userResult = await sql`
            SELECT u.id, u.email, sc.stripe_customer_id 
            FROM users u 
            LEFT JOIN stripe_customers sc ON u.id = sc.user_id
            WHERE u.clerk_id = ${payload.sub}
          `;
          
          if (userResult.length > 0) {
            userId = userResult[0].id as string;
            userEmail = userResult[0].email as string;
            stripeCustomerId = userResult[0].stripe_customer_id as string | null;
          }
        }
      } catch (error) {
        console.error("Token verification failed:", error);
      }
    }

    // Create or retrieve Stripe customer
    if (userId && userEmail && !stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: userEmail,
        metadata: {
          userId,
        },
      });
      
      stripeCustomerId = customer.id;
      
      // Save to database
      await sql`
        INSERT INTO stripe_customers (user_id, stripe_customer_id, email)
        VALUES (${userId}, ${stripeCustomerId}, ${userEmail})
        ON CONFLICT (user_id) DO UPDATE SET stripe_customer_id = ${stripeCustomerId}
      `;
    }

    // Create checkout session
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode,
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      metadata: {
        userId: userId || "",
        ...metadata,
      },
    };

    // Add customer if we have one
    if (stripeCustomerId) {
      sessionParams.customer = stripeCustomerId;
    } else if (userEmail) {
      sessionParams.customer_email = userEmail;
    }

    // For subscriptions, allow promo codes
    if (mode === "subscription") {
      sessionParams.allow_promotion_codes = true;
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return res.status(200).json({
      success: true,
      data: {
        sessionId: session.id,
        url: session.url,
      },
    });
  } catch (error) {
    console.error("Checkout session creation error:", error);
    
    if (error instanceof Stripe.errors.StripeError) {
      return res.status(400).json({
        success: false,
        error: {
          code: error.code || "STRIPE_ERROR",
          message: error.message,
        },
      });
    }

    return res.status(500).json({
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Failed to create checkout session" },
    });
  }
}
