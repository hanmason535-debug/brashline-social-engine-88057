/**
 * Newsletter subscription endpoints for Vercel
 * POST /api/newsletter/subscribe
 * POST /api/newsletter/unsubscribe
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { neon } from "@neondatabase/serverless";
import { z } from "zod";

// Validation schema
const subscribeSchema = z.object({
  email: z.string().email().max(255),
  name: z.string().max(100).optional(),
  source: z.string().max(50).optional(),
  metadata: z.record(z.unknown()).optional(),
});

const unsubscribeSchema = z.object({
  email: z.string().email().max(255),
});

// Simple in-memory rate limiting
const submissionTimes = new Map<string, number[]>();
const RATE_LIMIT = 3;
const RATE_WINDOW = 60 * 60 * 1000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const times = submissionTimes.get(ip) || [];
  const recentTimes = times.filter((t) => now - t < RATE_WINDOW);
  submissionTimes.set(ip, recentTimes);
  return recentTimes.length >= RATE_LIMIT;
}

function recordSubmission(ip: string): void {
  const times = submissionTimes.get(ip) || [];
  times.push(Date.now());
  submissionTimes.set(ip, times);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: { code: "METHOD_NOT_ALLOWED", message: "Method not allowed" } });
  }

  // Rate limiting
  const clientIp = (req.headers["x-forwarded-for"] as string)?.split(",")[0] || "unknown";
  if (isRateLimited(clientIp)) {
    return res.status(429).json({
      success: false,
      error: { code: "RATE_LIMITED", message: "Too many requests. Please try again later." },
    });
  }

  // Determine action from URL
  const url = req.url || "";
  const isUnsubscribe = url.includes("unsubscribe");

  try {
    const sql = neon(process.env.DATABASE_URL!);

    if (isUnsubscribe) {
      // Unsubscribe
      const validation = unsubscribeSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({
          success: false,
          error: { code: "VALIDATION_ERROR", message: "Invalid email address" },
        });
      }

      const { email } = validation.data;
      const existing = await sql`SELECT id, status FROM newsletter_subscribers WHERE email = ${email}`;

      if (existing.length === 0) {
        return res.status(404).json({
          success: false,
          error: { code: "NOT_FOUND", message: "Email not found in our subscription list" },
        });
      }

      if (existing[0].status === "unsubscribed") {
        return res.status(200).json({
          success: true,
          data: { message: "You've already unsubscribed from our newsletter.", status: "already_unsubscribed" },
        });
      }

      await sql`UPDATE newsletter_subscribers SET status = 'unsubscribed', unsubscribed_at = NOW() WHERE id = ${existing[0].id}`;

      return res.status(200).json({
        success: true,
        data: { message: "You've been unsubscribed from our newsletter.", status: "unsubscribed" },
      });
    } else {
      // Subscribe
      const validation = subscribeSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid request data",
            details: validation.error.errors.map((e) => ({ field: e.path.join("."), message: e.message })),
          },
        });
      }

      const { email, name, source, metadata } = validation.data;
      const existing = await sql`SELECT id, status FROM newsletter_subscribers WHERE email = ${email}`;

      if (existing.length > 0) {
        if (existing[0].status === "active") {
          return res.status(200).json({
            success: true,
            data: { message: "You're already subscribed to our newsletter!", status: "existing" },
          });
        }

        // Reactivate
        await sql`UPDATE newsletter_subscribers SET status = 'active', unsubscribed_at = NULL, name = COALESCE(${name || null}, name), source = COALESCE(${source || null}, source), metadata = COALESCE(${metadata ? JSON.stringify(metadata) : null}::jsonb, metadata) WHERE id = ${existing[0].id}`;

        recordSubmission(clientIp);

        return res.status(200).json({
          success: true,
          data: { message: "Welcome back! Your subscription has been reactivated.", status: "reactivated" },
        });
      }

      // New subscription
      const result = await sql`
        INSERT INTO newsletter_subscribers (email, name, status, source, metadata)
        VALUES (${email}, ${name || null}, 'active', ${source || "website"}, ${metadata ? JSON.stringify(metadata) : null}::jsonb)
        RETURNING id, subscribed_at
      `;

      recordSubmission(clientIp);

      return res.status(201).json({
        success: true,
        data: {
          id: result[0].id,
          message: "Thank you for subscribing to our newsletter!",
          status: "subscribed",
          subscribedAt: result[0].subscribed_at,
        },
      });
    }
  } catch (error) {
    console.error("Newsletter error:", error);
    return res.status(500).json({
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Failed to process request. Please try again." },
    });
  }
}
