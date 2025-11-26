/**
 * Auth routes
 * Handles Clerk webhooks and user operations
 */
import { Router, Request, Response } from "express";
import { Webhook } from "svix";
import {
  syncUser,
  deleteUser,
  getCurrentUser,
  updatePreferences,
  getAllUsers,
} from "../controllers/userController.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import { asyncHandler, ApiError } from "../middleware/error.js";
import { logger } from "../utils/logger.js";

const router = Router();

// Clerk webhook types
interface WebhookEvent {
  type: string;
  data: {
    id: string;
    email_addresses: Array<{ email_address: string }>;
    first_name: string | null;
    last_name: string | null;
    image_url: string | null;
    public_metadata?: Record<string, unknown>;
  };
}

/**
 * Clerk webhook handler
 * POST /api/auth/webhook
 */
router.post(
  "/webhook",
  asyncHandler(async (req: Request, res: Response) => {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    
    if (!webhookSecret) {
      logger.error("CLERK_WEBHOOK_SECRET not configured");
      throw ApiError.internal("Webhook not configured");
    }
    
    // Get headers for verification
    const svix_id = req.headers["svix-id"] as string;
    const svix_timestamp = req.headers["svix-timestamp"] as string;
    const svix_signature = req.headers["svix-signature"] as string;
    
    if (!svix_id || !svix_timestamp || !svix_signature) {
      throw ApiError.badRequest("Missing webhook headers");
    }
    
    // Verify webhook signature
    const wh = new Webhook(webhookSecret);
    let event: WebhookEvent;
    
    try {
      const rawBody = JSON.stringify(req.body);
      event = wh.verify(rawBody, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as WebhookEvent;
    } catch (err) {
      logger.error("Webhook verification failed", { error: err });
      throw ApiError.badRequest("Invalid webhook signature");
    }
    
    // Handle webhook events
    logger.info("Clerk webhook received", { type: event.type });
    
    switch (event.type) {
      case "user.created":
      case "user.updated":
        await syncUser(event.data);
        break;
        
      case "user.deleted":
        await deleteUser(event.data.id);
        break;
        
      default:
        logger.debug("Unhandled webhook event", { type: event.type });
    }
    
    res.json({ success: true, received: true });
  })
);

// User routes
router.get("/me", requireAuth, getCurrentUser);
router.patch("/me/preferences", requireAuth, updatePreferences);

// Admin routes
router.get("/users", requireAuth, requireAdmin, getAllUsers);

export default router;
