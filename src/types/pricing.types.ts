import { LocalizedContent } from './service.types';

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
}

export interface OneTimePackage {
  name: string;
  price: number;
  type: 'one-time';
  tagline: LocalizedContent;
  features: PricingFeature[];
  bestFor: LocalizedContent;
}

export interface LocalizedRecurringPlan extends Omit<RecurringPlan, 'tier' | 'summary' | 'features'> {
  tier: string;
  summary: string;
  features: string[];
}

export interface LocalizedOneTimePackage extends Omit<OneTimePackage, 'tagline' | 'features' | 'bestFor'> {
  tagline: string;
  features: string[];
  bestFor: string;
}
