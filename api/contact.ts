/**
 * Contact form submission endpoint for Vercel
 * POST /api/contact
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { neon } from "@neondatabase/serverless";
import { z } from "zod";
import { verifyToken } from "@clerk/backend";

// Validation schema
const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(255),
  company: z.string().max(100).optional(),
  phone: z.string().max(20).optional(),
  serviceType: z.string().max(50).optional(),
  message: z.string().min(10).max(1000),
  source: z.string().max(50).optional(),
  metadata: z.record(z.unknown()).optional(),
});

// Simple in-memory rate limiting (reset on each cold start)
const submissionTimes = new Map<string, number[]>();
const RATE_LIMIT = 5; // 5 submissions per hour per IP
const RATE_WINDOW = 60 * 60 * 1000; // 1 hour

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
      error: { code: "RATE_LIMITED", message: "Too many submissions. Please try again later." },
    });
  }

  try {
    // Validate request body
    const validation = contactSchema.safeParse(req.body);
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

    const { name, email, company, phone, serviceType, message, source, metadata } = validation.data;
    const sql = neon(process.env.DATABASE_URL!);

    // Get user ID if authenticated
    let userId: string | null = null;
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      try {
        const token = authHeader.substring(7);
        const payload = await verifyToken(token, {
          secretKey: process.env.CLERK_SECRET_KEY!,
        });
        if (payload?.sub) {
          const userResult = await sql`SELECT id FROM users WHERE clerk_id = ${payload.sub}`;
          if (userResult.length > 0) {
            userId = userResult[0].id as string;
          }
        }
      } catch {
        // Token verification failed, continue without user
      }
    }

    // Insert contact submission
    const result = await sql`
      INSERT INTO contact_submissions (name, email, company, phone, service_type, message, user_id, status, source, metadata)
      VALUES (${name}, ${email}, ${company || null}, ${phone || null}, ${serviceType || null}, ${message}, ${userId}, 'new', ${source || "website"}, ${metadata ? JSON.stringify(metadata) : null}::jsonb)
      RETURNING id, created_at
    `;

    recordSubmission(clientIp);

    return res.status(201).json({
      success: true,
      data: {
        id: result[0].id,
        createdAt: result[0].created_at,
        message: "Thank you for your message. We'll get back to you soon!",
      },
    });
  } catch (error) {
    console.error("Contact submission error:", error);
    return res.status(500).json({
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Failed to submit contact form. Please try again." },
    });
  }
}
