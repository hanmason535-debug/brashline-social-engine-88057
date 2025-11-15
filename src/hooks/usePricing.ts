/**
 * File overview: src/hooks/usePricing.ts
 *
 * Custom React hook `usePricing` encapsulating reusable view logic.
 * Inputs:
 * - Parameters passed to the hook and ambient browser/app state.
 * Outputs:
 * - A stable API of state and callbacks for components to consume.
 * Side effects:
 * - Uses React effects where needed and is responsible for its own cleanup.
 * Performance:
 * - Designed so calling components can avoid duplicating logic and re-renders.
 */
import { useMemo } from 'react';
import { RECURRING_PLANS, MAIN_PACKAGE, ADDON_PACKAGES } from '@/data/pricing.data';
import { LocalizedRecurringPlan, LocalizedOneTimePackage } from '@/types/pricing.types';

// Hook: builds localized pricing view models from static plan definitions.
// Inputs: current language code.
// Output: memoized recurring plans and one-time packages ready for rendering.
// Performance: memoizes all derived structures so pricing sections stay cheap to rerender.
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
