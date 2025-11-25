/**
 * File overview: src/pages/Index.test.tsx
 *
 * Test suite validating the public behavior of the associated module.
 * Behavior:
 * - Focuses on observable outputs and edge cases, not implementation details.
 * Assumptions:
 * - Serves as executable documentation for how callers are expected to use the API.
 */
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import { BrowserRouter } from "react-router-dom";
import Index from "./Index";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { ThemeProvider } from "next-themes";

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>{ui}</CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe("Index Page", () => {
  it("should render the header, main content, and footer", async () => {
    renderWithProviders(<Index />);

    // Check for the header (navigation)
    const header = screen.getByRole("banner");
    expect(header).toBeInTheDocument();

    // Check for the main content
    const main = screen.getByRole("main");
    expect(main).toBeInTheDocument();

    // Check for the footer
    const footer = screen.getByRole("contentinfo");
    expect(footer).toBeInTheDocument();
  }, 10000);

  it("should render hero section", () => {
    renderWithProviders(<Index />);

    // Hero should contain a heading
    const heroHeading = screen.getByRole("heading", { level: 1 });
    expect(heroHeading).toBeInTheDocument();
  });

  it("should render all major sections", () => {
    renderWithProviders(<Index />);

    const main = screen.getByRole("main");
    expect(main).toBeInTheDocument();

    // Main should contain multiple sections
    expect(main.children.length).toBeGreaterThan(0);
  });
});
