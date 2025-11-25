/**
 * Accessibility Tests
 * Tests for WCAG compliance and keyboard navigation
 */
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import Index from "@/pages/Index";
import Services from "@/pages/Services";
import Contact from "@/pages/Contact";
import CaseStudies from "@/pages/CaseStudies";

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>{ui}</CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe("Accessibility Tests", () => {
  it("homepage should have no accessibility violations", { timeout: 20000 }, async () => {
    const { container } = renderWithProviders(<Index />);
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });

  it("services page should have no accessibility violations", { timeout: 20000 }, async () => {
    const { container } = renderWithProviders(<Services />);
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });

  it("contact page should have no accessibility violations", { timeout: 20000 }, async () => {
    const { container } = renderWithProviders(<Contact />);
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });

  it("case studies page should have no accessibility violations", { timeout: 20000 }, async () => {
    const { container } = renderWithProviders(<CaseStudies />);
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });

  it("should have skip to main content link", () => {
    const { container } = renderWithProviders(<Index />);
    const skipLink = container.querySelector('a[href="#main-content"]');
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveTextContent("Skip to main content");
  });

  it("main content should have correct id", () => {
    const { container } = renderWithProviders(<Index />);
    const main = container.querySelector("main#main-content");
    expect(main).toBeInTheDocument();
  });
});
