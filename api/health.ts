/**
 * Health check endpoint for Vercel
 * GET /api/health
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { neon } from "@neondatabase/serverless";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const startTime = Date.now();

  try {
    // Test database connection
    const sql = neon(process.env.DATABASE_URL!);
    await sql`SELECT 1`;

    return res.status(200).json({
      success: true,
      data: {
        status: "healthy",
        database: "connected",
        timestamp: new Date().toISOString(),
        latency: Date.now() - startTime,
      },
    });
  } catch (error) {
    return res.status(503).json({
      success: false,
      error: {
        code: "SERVICE_UNAVAILABLE",
        message: "Database connection failed",
      },
    });
  }
}
