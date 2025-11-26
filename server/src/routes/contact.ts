/**
 * Contact routes
 * Handles contact form API endpoints
 */
import { Router } from "express";
import {
  submitContact,
  getContactSubmissions,
  getContactById,
  updateContactStatus,
} from "../controllers/contactController.js";
import { requireAuth, requireAdmin, optionalAuth } from "../middleware/auth.js";
import { validate, contactFormSchema, contactListSchema } from "../middleware/validation.js";

const router = Router();

// Public route - submit contact form (optional auth to link user)
router.post(
  "/",
  optionalAuth,
  validate(contactFormSchema),
  submitContact
);

// Protected routes - admin only
router.get(
  "/",
  requireAuth,
  requireAdmin,
  validate(contactListSchema, "query"),
  getContactSubmissions
);

router.get(
  "/:id",
  requireAuth,
  requireAdmin,
  getContactById
);

router.patch(
  "/:id",
  requireAuth,
  requireAdmin,
  updateContactStatus
);

export default router;
