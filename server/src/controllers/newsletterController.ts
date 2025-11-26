/**
 * Newsletter controller
 * Handles newsletter subscriptions
 */
import { Request, Response } from "express";
import { getSql } from "../config/database.js";
import { asyncHandler, ApiError } from "../middleware/error.js";
import { NewsletterInput } from "../middleware/validation.js";
import { logger } from "../utils/logger.js";

/**
 * Subscribe to newsletter
 * POST /api/newsletter/subscribe
 */
export const subscribe = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, name, source, metadata } = req.body as NewsletterInput;
    const sql = getSql();
    
    const existing = await sql`SELECT id, status FROM newsletter_subscribers WHERE email = ${email}`;
    
    if (existing.length > 0) {
      const subscriber = existing[0];
      
      if (subscriber.status === "active") {
        res.json({ success: true, data: { message: "You're already subscribed to our newsletter!", status: "existing" } });
        return;
      }
      
      await sql`UPDATE newsletter_subscribers SET status = 'active', unsubscribed_at = NULL, name = COALESCE(${name || null}, name), source = COALESCE(${source || null}, source), metadata = COALESCE(${metadata ? JSON.stringify(metadata) : null}::jsonb, metadata) WHERE id = ${subscriber.id}`;
      logger.info("Newsletter subscription reactivated", { email });
      res.json({ success: true, data: { message: "Welcome back! Your subscription has been reactivated.", status: "reactivated" } });
      return;
    }
    
    const result = await sql`INSERT INTO newsletter_subscribers (email, name, status, source, metadata) VALUES (${email}, ${name || null}, 'active', ${source || 'website'}, ${metadata ? JSON.stringify(metadata) : null}::jsonb) RETURNING id, subscribed_at`;
    logger.info("New newsletter subscription", { email, id: result[0].id });
    res.status(201).json({
      success: true,
      data: { id: result[0].id, message: "Thank you for subscribing to our newsletter!", status: "subscribed", subscribedAt: result[0].subscribed_at },
    });
  }
);

/**
 * Unsubscribe from newsletter
 * POST /api/newsletter/unsubscribe
 */
export const unsubscribe = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body as NewsletterInput;
    const sql = getSql();
    
    const existing = await sql`SELECT id, status FROM newsletter_subscribers WHERE email = ${email}`;
    if (existing.length === 0) throw ApiError.notFound("Email not found in our subscription list");
    
    const subscriber = existing[0];
    if (subscriber.status === "unsubscribed") {
      res.json({ success: true, data: { message: "You've already unsubscribed from our newsletter.", status: "already_unsubscribed" } });
      return;
    }
    
    await sql`UPDATE newsletter_subscribers SET status = 'unsubscribed', unsubscribed_at = NOW() WHERE id = ${subscriber.id}`;
    logger.info("Newsletter unsubscription", { email });
    res.json({ success: true, data: { message: "You've been unsubscribed from our newsletter. We're sorry to see you go!", status: "unsubscribed" } });
  }
);

/**
 * Get newsletter stats (admin)
 * GET /api/newsletter/stats
 */
export const getStats = asyncHandler(
  async (_req: Request, res: Response) => {
    const sql = getSql();
    const stats = await sql`
      SELECT COUNT(*) FILTER (WHERE status = 'active') as active_count,
        COUNT(*) FILTER (WHERE status = 'unsubscribed') as unsubscribed_count,
        COUNT(*) as total_count, MIN(subscribed_at) as first_subscription, MAX(subscribed_at) as latest_subscription
      FROM newsletter_subscribers
    `;
    
    res.json({
      success: true,
      data: {
        active: Number(stats[0].active_count), unsubscribed: Number(stats[0].unsubscribed_count),
        total: Number(stats[0].total_count), firstSubscription: stats[0].first_subscription, latestSubscription: stats[0].latest_subscription,
      },
    });
  }
);

/**
 * Get all subscribers (admin)
 * GET /api/newsletter/subscribers
 */
export const getSubscribers = asyncHandler(
  async (req: Request, res: Response) => {
    const sql = getSql();
    const page = Number(req.query.page) || 1;
    const limit = Math.min(Number(req.query.limit) || 20, 100);
    const status = req.query.status as string | undefined;
    const offset = (page - 1) * limit;
    
    let subscribers;
    let countResult;
    
    if (status && ["active", "unsubscribed"].includes(status)) {
      subscribers = await sql`SELECT id, email, status, subscribed_at, unsubscribed_at FROM newsletter_subscribers WHERE status = ${status} ORDER BY subscribed_at DESC LIMIT ${limit} OFFSET ${offset}`;
      countResult = await sql`SELECT COUNT(*) as count FROM newsletter_subscribers WHERE status = ${status}`;
    } else {
      subscribers = await sql`SELECT id, email, status, subscribed_at, unsubscribed_at FROM newsletter_subscribers ORDER BY subscribed_at DESC LIMIT ${limit} OFFSET ${offset}`;
      countResult = await sql`SELECT COUNT(*) as count FROM newsletter_subscribers`;
    }
    
    const total = Number(countResult[0].count);
    res.json({ success: true, data: { subscribers, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } } });
  }
);
