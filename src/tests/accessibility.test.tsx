/**
 * Accessibility Tests
 * Tests for WCAG compliance and keyboard navigation
 */
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { BrowserRouter } from "react-router-dom";
import Index from "@/pages/Index";
import Services from "@/pages/Services";
import Contact from "@/pages/Contact";
import CaseStudies from "@/pages/CaseStudies";

describe("Accessibility Tests", () => {
  it("homepage should have no accessibility violations", async () => {
    const { container } = render(
      <BrowserRouter>
        <Index />
      </BrowserRouter>
    );
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });

  it("services page should have no accessibility violations", async () => {
    const { container } = render(
      <BrowserRouter>
        <Services />
      </BrowserRouter>
    );
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });

  it("contact page should have no accessibility violations", async () => {
    const { container } = render(
      <BrowserRouter>
        <Contact />
      </BrowserRouter>
    );
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });

  it("case studies page should have no accessibility violations", async () => {
    const { container } = render(
      <BrowserRouter>
        <CaseStudies />
      </BrowserRouter>
    );
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });

  it("should have skip to main content link", () => {
    const { container } = render(
      <BrowserRouter>
        <Index />
      </BrowserRouter>
    );
    const skipLink = container.querySelector('a[href="#main-content"]');
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveTextContent("Skip to main content");
  });

  it("main content should have correct id", () => {
    const { container } = render(
      <BrowserRouter>
        <Index />
      </BrowserRouter>
    );
    const main = container.querySelector("main#main-content");
    expect(main).toBeInTheDocument();
  });
});
