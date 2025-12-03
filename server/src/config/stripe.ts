/**
 * Stripe Configuration
 * Server-side Stripe SDK initialization
 */
import Stripe from 'stripe';
import { logger } from '../utils/logger.js';

// Validate Stripe secret key exists
if (!process.env.STRIPE_SECRET_KEY) {
  logger.error('STRIPE_SECRET_KEY is not set in environment variables');
  throw new Error('STRIPE_SECRET_KEY is not set');
}

// Initialize Stripe with secret key
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-11-17.clover',
  typescript: true,
  appInfo: {
    name: 'Brashline Social Engine',
    version: '1.0.0',
  },
});

// Webhook secret for signature verification
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';

if (!STRIPE_WEBHOOK_SECRET) {
  logger.warn('STRIPE_WEBHOOK_SECRET is not set - webhook signature verification will be skipped in development');
}

logger.info('Stripe SDK initialized successfully');
