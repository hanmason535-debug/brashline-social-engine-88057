// Tests: exercise the localization behavior and basic shape of the useAbout hook without asserting implementation details.
/**
 * File overview: src/hooks/useAbout.test.ts
 *
 * Test suite validating the public behavior of the associated module.
 * Behavior:
 * - Focuses on observable outputs and edge cases, not implementation details.
 * Assumptions:
 * - Serves as executable documentation for how callers are expected to use the API.
 */
import { renderHook } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useAbout } from "./useAbout";

describe("useAbout", () => {
  it("should return localized value cards in English", () => {
    const { result } = renderHook(() => useAbout("en"));

    expect(result.current.valueCards).toHaveLength(3);
    expect(result.current.valueCards[0].title).toBe("Simplify Digital");
  });

  it("should return localized value cards in Spanish", () => {
    const { result } = renderHook(() => useAbout("es"));

    expect(result.current.valueCards).toHaveLength(3);
    expect(result.current.valueCards[0].title).toBe("Simplificar lo Digital");
  });

  it("should include icon in value cards", () => {
    const { result } = renderHook(() => useAbout("en"));

    result.current.valueCards.forEach((card) => {
      expect(card).toHaveProperty("icon");
      expect(card.icon).toBeDefined(); // Lucide icons are objects/components
      expect(card).toHaveProperty("title");
      expect(card).toHaveProperty("description");
    });
  });

  it("should return localized hero content", () => {
    const { result: enResult } = renderHook(() => useAbout("en"));
    const { result: esResult } = renderHook(() => useAbout("es"));

    expect(enResult.current.content.hero.title).toBe("About Brashline");
    expect(esResult.current.content.hero.title).toBe("Acerca de Brashline");

    expect(enResult.current.content.hero.subtitle).toContain("Digital made simple");
    expect(esResult.current.content.hero.subtitle).toContain("Lo digital simplificado");
  });

  it("should return localized story content", () => {
    const { result } = renderHook(() => useAbout("en"));

    expect(result.current.content.story.title).toBe("Our Story");
    expect(result.current.content.story.paragraphs).toHaveLength(4);
    expect(result.current.content.story.paragraphs[0]).toContain("Brashline started");
  });

  it("should localize all story paragraphs", () => {
    const { result: enResult } = renderHook(() => useAbout("en"));
    const { result: esResult } = renderHook(() => useAbout("es"));

    expect(enResult.current.content.story.paragraphs).toHaveLength(4);
    expect(esResult.current.content.story.paragraphs).toHaveLength(4);

    expect(enResult.current.content.story.paragraphs[3]).toContain("Real people");
    expect(esResult.current.content.story.paragraphs[3]).toContain("Personas reales");
  });

  it("should memoize results for the same language", () => {
    const { result, rerender } = renderHook(({ lang }) => useAbout(lang), {
      initialProps: { lang: "en" as "en" | "es" },
    });

    const firstResult = result.current;
    rerender({ lang: "en" });
    const secondResult = result.current;

    expect(firstResult.valueCards).toBe(secondResult.valueCards);
    expect(firstResult.content).toBe(secondResult.content);
  });

  it("should return different results when language changes", () => {
    const { result, rerender } = renderHook(({ lang }) => useAbout(lang), {
      initialProps: { lang: "en" as "en" | "es" },
    });

    const enResult = result.current;
    rerender({ lang: "es" });
    const esResult = result.current;

    expect(enResult.valueCards).not.toBe(esResult.valueCards);
    expect(enResult.content).not.toBe(esResult.content);
    expect(enResult.valueCards[0].title).not.toBe(esResult.valueCards[0].title);
  });

  it("should maintain consistent structure across languages", () => {
    const { result: enResult } = renderHook(() => useAbout("en"));
    const { result: esResult } = renderHook(() => useAbout("es"));

    expect(enResult.current.valueCards.length).toBe(esResult.current.valueCards.length);
    expect(enResult.current.content.story.paragraphs.length).toBe(
      esResult.current.content.story.paragraphs.length
    );
  });

  it("should include all required hero fields", () => {
    const { result } = renderHook(() => useAbout("en"));

    expect(result.current.content.hero).toHaveProperty("title");
    expect(result.current.content.hero).toHaveProperty("subtitle");
    expect(result.current.content.hero).toHaveProperty("description");
    expect(result.current.content.hero.description).toContain("Brashline helps businesses");
  });
});
