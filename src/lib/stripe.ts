/**
 * Stripe Configuration
 * Client-side Stripe SDK initialization for React components
 */
import { loadStripe, type Stripe } from "@stripe/stripe-js";

// Singleton promise to ensure Stripe is only loaded once
let stripePromise: Promise<Stripe | null> | null = null;

/**
 * Get the Stripe instance (client-side only)
 * Uses a singleton pattern to ensure Stripe.js is only loaded once
 */
export function getStripe(): Promise<Stripe | null> {
  if (!stripePromise) {
    const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

    if (!publishableKey) {
      console.error("Missing VITE_STRIPE_PUBLISHABLE_KEY environment variable");
      return Promise.resolve(null);
    }

    stripePromise = loadStripe(publishableKey);
  }

  return stripePromise;
}

/**
 * Stripe price IDs for subscription plans
 * These should be created in your Stripe Dashboard
 */
export const STRIPE_PRICE_IDS = {
  // One-time payments
  starter: {
    monthly: "", // Create in Stripe Dashboard: price_starter_monthly
    yearly: "", // Create in Stripe Dashboard: price_starter_yearly
  },
  professional: {
    monthly: "", // Create in Stripe Dashboard: price_professional_monthly
    yearly: "", // Create in Stripe Dashboard: price_professional_yearly
  },
  enterprise: {
    monthly: "", // Create in Stripe Dashboard: price_enterprise_monthly
    yearly: "", // Create in Stripe Dashboard: price_enterprise_yearly
  },
} as const;

/**
 * Product metadata for display
 */
export const PRODUCTS = {
  starter: {
    id: "starter",
    name: "Starter Package",
    description: "Perfect for small businesses just getting started",
    features: [
      "Social media management (2 platforms)",
      "Basic analytics dashboard",
      "Monthly content calendar",
      "Email support",
    ],
    prices: {
      monthly: 499,
      yearly: 4990, // ~2 months free
    },
  },
  professional: {
    id: "professional",
    name: "Professional Package",
    description: "For growing businesses ready to scale",
    features: [
      "Social media management (5 platforms)",
      "Advanced analytics & reporting",
      "Weekly content calendar",
      "Priority email support",
      "Monthly strategy calls",
      "Competitor analysis",
    ],
    prices: {
      monthly: 999,
      yearly: 9990, // ~2 months free
    },
  },
  enterprise: {
    id: "enterprise",
    name: "Enterprise Package",
    description: "Complete solution for established brands",
    features: [
      "Unlimited social platforms",
      "Full analytics suite",
      "Daily content management",
      "24/7 priority support",
      "Weekly strategy calls",
      "Dedicated account manager",
      "Custom integrations",
      "White-label reporting",
    ],
    prices: {
      monthly: 2499,
      yearly: 24990, // ~2 months free
    },
  },
} as const;

export type ProductId = keyof typeof PRODUCTS;
export type BillingInterval = "monthly" | "yearly";

/**
 * Format price for display
 */
export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

/**
 * Calculate savings for yearly billing
 */
export function calculateYearlySavings(
  monthlyPrice: number,
  yearlyPrice: number
): number {
  const fullYearlyPrice = monthlyPrice * 12;
  return fullYearlyPrice - yearlyPrice;
}
