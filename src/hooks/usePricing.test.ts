// Tests: confirm that usePricing projects localized plans and packages while preserving expected counts.
/**
 * File overview: src/hooks/usePricing.test.ts
 *
 * Test suite validating the public behavior of the associated module.
 * Behavior:
 * - Focuses on observable outputs and edge cases, not implementation details.
 * Assumptions:
 * - Serves as executable documentation for how callers are expected to use the API.
 */
import { renderHook } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { usePricing } from "./usePricing";

describe("usePricing", () => {
  it("should return localized pricing data in English", () => {
    const { result } = renderHook(() => usePricing("en"));

    expect(result.current.recurringPlans).toHaveLength(3);
    expect(result.current.mainPackage).toBeDefined();
    expect(result.current.addonPackages).toHaveLength(7);
  });

  it("should return localized pricing data in Spanish", () => {
    const { result } = renderHook(() => usePricing("es"));

    expect(result.current.recurringPlans).toHaveLength(3);
    expect(result.current.mainPackage).toBeDefined();
    expect(result.current.addonPackages).toHaveLength(7);
  });

  it("should localize recurring plan tier and summary", () => {
    const { result: enResult } = renderHook(() => usePricing("en"));
    const { result: esResult } = renderHook(() => usePricing("es"));

    expect(enResult.current.recurringPlans[0].tier).toBe("BASIC");
    expect(esResult.current.recurringPlans[0].tier).toBe("BÁSICO");

    expect(enResult.current.recurringPlans[0].summary).toContain("Keep accounts active");
    expect(esResult.current.recurringPlans[0].summary).toContain("Mantén las cuentas");
  });

  it("should localize recurring plan features", () => {
    const { result } = renderHook(() => usePricing("en"));

    result.current.recurringPlans.forEach((plan) => {
      expect(Array.isArray(plan.features)).toBe(true);
      expect(plan.features.length).toBeGreaterThan(0);
      plan.features.forEach((feature) => {
        expect(typeof feature).toBe("string");
      });
    });
  });

  it("should preserve pricing numbers across languages", () => {
    const { result: enResult } = renderHook(() => usePricing("en"));
    const { result: esResult } = renderHook(() => usePricing("es"));

    expect(enResult.current.recurringPlans[0].price).toBe(99);
    expect(esResult.current.recurringPlans[0].price).toBe(99);

    expect(enResult.current.mainPackage.price).toBe(2999);
    expect(esResult.current.mainPackage.price).toBe(2999);
  });

  it("should localize main package tagline and features", () => {
    const { result: enResult } = renderHook(() => usePricing("en"));
    const { result: esResult } = renderHook(() => usePricing("es"));

    expect(enResult.current.mainPackage.tagline).toContain("Full business setup");
    expect(esResult.current.mainPackage.tagline).toContain("Configuración completa");

    expect(enResult.current.mainPackage.features.length).toBeGreaterThan(0);
    expect(esResult.current.mainPackage.features.length).toBeGreaterThan(0);
  });

  it("should localize addon package tagline and bestFor", () => {
    const { result } = renderHook(() => usePricing("en"));

    result.current.addonPackages.forEach((addon) => {
      expect(addon.tagline).toBeDefined();
      expect(typeof addon.tagline).toBe("string");
      expect(addon.bestFor).toBeDefined();
      expect(typeof addon.bestFor).toBe("string");
    });
  });

  it("should identify featured plan", () => {
    const { result } = renderHook(() => usePricing("en"));

    const featuredPlan = result.current.recurringPlans.find((p) => p.featured);
    expect(featuredPlan).toBeDefined();
    expect(featuredPlan?.name).toBe("Brand Pulse");
  });

  it("should memoize results for the same language", () => {
    const { result, rerender } = renderHook(({ lang }) => usePricing(lang), {
      initialProps: { lang: "en" as const },
    });

    const firstResult = result.current;
    rerender({ lang: "en" });
    const secondResult = result.current;

    expect(firstResult.recurringPlans).toBe(secondResult.recurringPlans);
    expect(firstResult.mainPackage).toBe(secondResult.mainPackage);
    expect(firstResult.addonPackages).toBe(secondResult.addonPackages);
  });

  it("should return different results when language changes", () => {
    const { result, rerender } = renderHook(({ lang }) => usePricing(lang), {
      initialProps: { lang: "en" as "en" | "es" },
    });

    const enResult = result.current;
    rerender({ lang: "es" });
    const esResult = result.current;

    expect(enResult.recurringPlans).not.toBe(esResult.recurringPlans);
    expect(enResult.recurringPlans[0].tier).not.toBe(esResult.recurringPlans[0].tier);
  });

  it("should include all addon packages with correct structure", () => {
    const { result } = renderHook(() => usePricing("en"));

    expect(result.current.addonPackages).toHaveLength(7);

    result.current.addonPackages.forEach((addon) => {
      expect(addon).toHaveProperty("name");
      expect(addon).toHaveProperty("price");
      expect(addon).toHaveProperty("type", "one-time");
      expect(addon).toHaveProperty("tagline");
      expect(addon).toHaveProperty("features");
      expect(addon).toHaveProperty("bestFor");
      expect(Array.isArray(addon.features)).toBe(true);
    });
  });
});
