import { render } from "@testing-library/react";
import { screen, fireEvent } from "@testing-library/dom";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import PricingPreview from "./PricingPreview";
import { CartProvider } from "@/contexts/CartContext";

// Wrapper to provide router and cart context
const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <MemoryRouter>
      <CartProvider>{ui}</CartProvider>
    </MemoryRouter>
  );
};

describe("PricingPreview", () => {
  it("renders heading and plan names (English)", () => {
    renderWithProviders(<PricingPreview lang="en" />);

    expect(screen.getByRole("heading", { name: "Pick your plan" })).toBeInTheDocument();
    expect(screen.getByText("Starter Spark")).toBeInTheDocument();
    expect(screen.getByText("Brand Pulse")).toBeInTheDocument();
    expect(screen.getByText("Impact Engine")).toBeInTheDocument();

    // CTA buttons (Add to Cart)
    expect(screen.getAllByRole("button", { name: /Add to Cart/i }).length).toBeGreaterThan(0);
  });

  it("toggles to annual billing and shows discount badge", () => {
    renderWithProviders(<PricingPreview lang="en" />);

    const annual = screen.getByText("Annual");
    fireEvent.click(annual);

    expect(screen.getAllByText(/off/)[0]).toBeInTheDocument();
  });

  it("renders Spanish labels", () => {
    renderWithProviders(<PricingPreview lang="es" />);
    expect(screen.getByRole("heading", { name: "Elige tu plan" })).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /Agregar al Carrito/i }).length).toBeGreaterThan(0);
  });
});
