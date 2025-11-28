/**
 * Get Customer Portal Session
 * POST /api/stripe/customer-portal
 * 
 * Creates a customer portal session for managing subscriptions
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import Stripe from "stripe";
import { neon } from "@neondatabase/serverless";
import { verifyToken } from "@clerk/backend";
import { z } from "zod";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const portalSchema = z.object({
  returnUrl: z.string().url(),
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
    const validation = portalSchema.safeParse(req.body);
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

    const { returnUrl } = validation.data;

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

    // Get user's Stripe customer ID
    const result = await sql`
      SELECT sc.stripe_customer_id 
      FROM users u 
      JOIN stripe_customers sc ON u.id = sc.user_id
      WHERE u.clerk_id = ${payload.sub}
    `;

    if (result.length === 0 || !result[0].stripe_customer_id) {
      return res.status(404).json({
        success: false,
        error: { code: "NO_CUSTOMER", message: "No billing account found" },
      });
    }

    const stripeCustomerId = result[0].stripe_customer_id as string;

    // Create customer portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: returnUrl,
    });

    return res.status(200).json({
      success: true,
      data: {
        url: session.url,
      },
    });
  } catch (error) {
    console.error("Customer portal error:", error);
    
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
      error: { code: "INTERNAL_ERROR", message: "Failed to create portal session" },
    });
  }
}
