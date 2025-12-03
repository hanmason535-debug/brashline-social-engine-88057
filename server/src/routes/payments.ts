/**
 * Payment routes
 * Handles payment API endpoints
 */
import { Router } from "express";
import {
  createPaymentIntent,
  getPaymentHistory,
  getPaymentStatus,
  getSubscriptionStatus,
} from "../controllers/paymentController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// All payment routes require authentication
router.use(requireAuth);

// Create payment intent for one-time payment
router.post("/create-intent", createPaymentIntent);

// Get payment history
router.get("/history", getPaymentHistory);

// Get payment status by ID
router.get("/status/:id", getPaymentStatus);

// Get subscription status
router.get("/subscription", getSubscriptionStatus);

export default router;
