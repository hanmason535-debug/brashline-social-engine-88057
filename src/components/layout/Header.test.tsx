/**
 * File overview: src/components/layout/Header.test.tsx
 *
 * Test suite validating the public behavior of the associated module.
 * Behavior:
 * - Focuses on observable outputs and edge cases, not implementation details.
 * Assumptions:
 * - Serves as executable documentation for how callers are expected to use the API.
 */
import { render } from "@testing-library/react";
import { screen, fireEvent } from "@testing-library/dom";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import Header from "./Header";
import { ThemeProvider } from "next-themes";
import React from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { setMockAuthState, resetMockAuthState } from "@/tests/mocks/clerk";

// Mock window.matchMedia for responsive tests
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

const renderWithProviders = (ui: React.ReactElement, { route = "/" } = {}) => {
  window.history.pushState({}, "Test page", route);
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

describe("Header", () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
    resetMockAuthState();
  });

  it("should render the logo and desktop navigation", () => {
    renderWithProviders(<Header />);
    expect(screen.getByAltText("Brashline Logo")).toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();
  });

  it("should render navigation links", () => {
    renderWithProviders(<Header />);
    expect(screen.getByText("Services")).toBeInTheDocument();
    expect(screen.getByText("Pricing")).toBeInTheDocument();
    expect(screen.getByText("About")).toBeInTheDocument();
  });

  it("should render action buttons", () => {
    renderWithProviders(<Header />);
    const buttons = screen.getAllByRole("button");
    // Should have theme toggle, mobile menu toggle, and contact button at minimum
    expect(buttons.length).toBeGreaterThan(0);
  });

  it("should render the WhatsApp contact button", () => {
    renderWithProviders(<Header />);
    const contactButton = screen.getByRole("link", { name: /book strategic call/i });
    expect(contactButton).toBeInTheDocument();
  });

  it("should handle logo image errors gracefully", () => {
    renderWithProviders(<Header />);
    const image = screen.getByAltText("Brashline Logo") as HTMLImageElement;

    // Check initial source
    expect(image.src).toContain("/logo.png");

    // Trigger error
    fireEvent.error(image);

    // Check if the source has been updated to the fallback SVG
    expect(image.src).toContain("/logo.svg");

    // Image should still be in the document even after error
    expect(image).toBeInTheDocument();
  });

  it("should show sign in button when user is not authenticated", () => {
    setMockAuthState({ isSignedIn: false });
    renderWithProviders(<Header />);
    // The Sign In button should be visible (from Clerk mock)
    expect(screen.getByText("Sign In")).toBeInTheDocument();
  });

  it("should show user button when user is authenticated", () => {
    setMockAuthState({ isSignedIn: true });
    renderWithProviders(<Header />);
    // Dashboard link and user button should be visible
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByTestId("clerk-user-button")).toBeInTheDocument();
  });
});
