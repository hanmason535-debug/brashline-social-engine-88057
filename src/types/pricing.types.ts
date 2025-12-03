/**
 * File overview: src/types/pricing.types.ts
 *
 * Shared TypeScript type definitions for this feature area.
 * Behavior:
 * - Documents the shape of domain data and narrows allowable values at compile time.
 * Assumptions:
 * - Runtime data is normalized to match these shapes before reaching UI components.
 */
import { LocalizedContent } from "./service.types";

export interface PricingFeature {
  en: string;
  es: string;
}

export interface RecurringPlan {
  tier: LocalizedContent;
  name: string;
  price: number;
  annualPrice: number;
  annualDiscount: number;
  featured?: boolean;
  summary: LocalizedContent;
  features: PricingFeature[];
  stripeProductId?: string;
  stripePriceIds?: {
    monthly?: string;
    yearly?: string;
  };
}

export interface OneTimePackage {
  name: string;
  price: number;
  type: "one-time";
  tagline: LocalizedContent;
  features: PricingFeature[];
  bestFor: LocalizedContent;
  stripeProductId?: string;
}

export interface LocalizedRecurringPlan
  extends Omit<RecurringPlan, "tier" | "summary" | "features"> {
  tier: string;
  summary: string;
  features: string[];
}

export interface LocalizedOneTimePackage
  extends Omit<OneTimePackage, "tagline" | "features" | "bestFor"> {
  tagline: string;
  features: string[];
  bestFor: string;
}
