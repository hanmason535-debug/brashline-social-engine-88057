import { render } from "@testing-library/react";
import { waitFor } from "@testing-library/dom";
import { HelmetProvider } from "react-helmet-async";
import { describe, it, expect } from "vitest";
import ReviewSchema from "./ReviewSchema";

describe("ReviewSchema", () => {
  it("renders AggregateRating and Review JSON-LD", async () => {
    render(
      <HelmetProvider>
        <ReviewSchema />
      </HelmetProvider>
    );

    // Helmet injects script tags into head; wait until they exist
    await waitFor(() => {
      const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
      expect(scripts.length).toBeGreaterThanOrEqual(1);
    });

    const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
    const json = JSON.parse(scripts[0].textContent || "{}");
    expect(json["@type"]).toBe("Organization");
    expect(json.aggregateRating).toBeDefined();

    const reviewScripts = scripts.slice(1).map((s) => JSON.parse(s.textContent || "{}"));
    expect(reviewScripts[0]["@type"]).toBe("Review");
    expect(reviewScripts[0].author).toBeDefined();
  });
});
