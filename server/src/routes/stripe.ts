/**
 * Stripe API router - minimal compatibility layer for server deployments
 */
import { Router } from 'express';
import { createCheckoutSession, createPaymentIntent } from '../controllers/paymentController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Allow unauthenticated calls for checkout (customer email can be passed)
router.post('/create-checkout-session', createCheckoutSession);

// For backward compatibility we also expose createPaymentIntent here (requires auth)
router.post('/create-payment-intent', requireAuth, createPaymentIntent);

export default router;
