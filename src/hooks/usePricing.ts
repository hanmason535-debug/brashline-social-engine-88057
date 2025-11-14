import { useMemo } from 'react';
import { RECURRING_PLANS, MAIN_PACKAGE, ADDON_PACKAGES } from '@/data/pricing.data';
import { LocalizedRecurringPlan, LocalizedOneTimePackage } from '@/types/pricing.types';

export const usePricing = (lang: 'en' | 'es') => {
  const localizedRecurringPlans = useMemo<LocalizedRecurringPlan[]>(
    () =>
      RECURRING_PLANS.map((plan) => ({
        ...plan,
        tier: plan.tier[lang],
        summary: plan.summary[lang],
        features: plan.features.map((f) => f[lang]),
      })),
    [lang]
  );

  const localizedMainPackage = useMemo<LocalizedOneTimePackage>(
    () => ({
      ...MAIN_PACKAGE,
      tagline: MAIN_PACKAGE.tagline[lang],
      features: MAIN_PACKAGE.features.map((f) => f[lang]),
      bestFor: MAIN_PACKAGE.bestFor[lang],
    }),
    [lang]
  );

  const localizedAddonPackages = useMemo<LocalizedOneTimePackage[]>(
    () =>
      ADDON_PACKAGES.map((pkg) => ({
        ...pkg,
        tagline: pkg.tagline[lang],
        features: pkg.features.map((f) => f[lang]),
        bestFor: pkg.bestFor[lang],
      })),
    [lang]
  );

  return {
    recurringPlans: localizedRecurringPlans,
    mainPackage: localizedMainPackage,
    addonPackages: localizedAddonPackages,
  };
};
