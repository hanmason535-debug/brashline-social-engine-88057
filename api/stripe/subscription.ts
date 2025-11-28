/**
 * Get Subscription Status
 * GET /api/stripe/subscription
 * 
 * Returns the current user's subscription status
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import Stripe from "stripe";
import { neon } from "@neondatabase/serverless";
import { verifyToken } from "@clerk/backend";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ 
      success: false, 
      error: { code: "METHOD_NOT_ALLOWED", message: "Method not allowed" } 
    });
  }

  try {
    // Require authentication
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: { code: "UNAUTHORIZED", message: "Authentication required" },
      });
    }

    const token = authHeader.substring(7);
    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY!,
    });

    if (!payload?.sub) {
      return res.status(401).json({
        success: false,
        error: { code: "INVALID_TOKEN", message: "Invalid authentication token" },
      });
    }

    const sql = neon(process.env.DATABASE_URL!);

    // Get user's subscription info
    const result = await sql`
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
      FROM users u 
      JOIN subscriptions s ON u.id = s.user_id
      LEFT JOIN prices p ON s.price_id = p.id
      LEFT JOIN products pr ON p.product_id = pr.id
      WHERE u.clerk_id = ${payload.sub}
      AND s.status IN ('active', 'trialing', 'past_due')
      ORDER BY s.created_at DESC
      LIMIT 1
    `;

    if (result.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          hasSubscription: false,
          subscription: null,
        },
      });
    }

    const sub = result[0];

    return res.status(200).json({
      success: true,
      data: {
        hasSubscription: true,
        subscription: {
          id: sub.id,
          stripeSubscriptionId: sub.stripe_subscription_id,
          status: sub.status,
          currentPeriodStart: sub.current_period_start,
          currentPeriodEnd: sub.current_period_end,
          cancelAtPeriodEnd: sub.cancel_at_period_end,
          canceledAt: sub.canceled_at,
          price: {
            stripePriceId: sub.stripe_price_id,
            amount: sub.unit_amount,
            currency: sub.currency,
            interval: sub.interval,
          },
          product: {
            name: sub.product_name,
            description: sub.product_description,
          },
        },
      },
    });
  } catch (error) {
    console.error("Get subscription error:", error);
    
    return res.status(500).json({
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Failed to get subscription" },
    });
  }
}
