/**
 * Newsletter routes
 * Handles newsletter subscription API endpoints
 */
import { Router } from "express";
import {
  subscribe,
  unsubscribe,
  getStats,
  getSubscribers,
} from "../controllers/newsletterController.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import { validate, newsletterSchema } from "../middleware/validation.js";

const router = Router();

// Public routes
router.post(
  "/subscribe",
  validate(newsletterSchema),
  subscribe
);

router.post(
  "/unsubscribe",
  validate(newsletterSchema),
  unsubscribe
);

// Protected routes - admin only
router.get(
  "/stats",
  requireAuth,
  requireAdmin,
  getStats
);

router.get(
  "/subscribers",
  requireAuth,
  requireAdmin,
  getSubscribers
);

export default router;
