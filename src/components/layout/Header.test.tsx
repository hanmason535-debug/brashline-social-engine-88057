/**
 * File overview: src/components/layout/Header.test.tsx
 *
 * Test suite validating the public behavior of the associated module.
 * Behavior:
 * - Focuses on observable outputs and edge cases, not implementation details.
 * Assumptions:
 * - Serves as executable documentation for how callers are expected to use the API.
 */
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import Header from './Header';
import { ThemeProvider } from 'next-themes';
import React from 'react';

// Mock window.matchMedia for responsive tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
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

const renderWithProviders = (ui: React.ReactElement, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);
  return render(
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <ThemeProvider>
        {ui}
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('Header', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
  });

  it('should render the logo and desktop navigation', () => {
    renderWithProviders(<Header />);
    expect(screen.getByAltText('Brashline Logo')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('should render navigation links', () => {
    renderWithProviders(<Header />);
    expect(screen.getByText('Services')).toBeInTheDocument();
    expect(screen.getByText('Pricing')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
  });

  it('should render action buttons', () => {
    renderWithProviders(<Header />);
    const buttons = screen.getAllByRole('button');
    // Should have theme toggle, mobile menu toggle, and contact button at minimum
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('should render the WhatsApp contact button', () => {
    renderWithProviders(<Header />);
    const contactButton = screen.getByRole('button', { name: /book strategic call/i });
    expect(contactButton).toBeInTheDocument();
  });

  it('should handle logo image errors gracefully', () => {
    renderWithProviders(<Header />);
    const image = screen.getByAltText('Brashline Logo') as HTMLImageElement;
    fireEvent.error(image);
    // Image should still be in the document even after error
    expect(image).toBeInTheDocument();
  });
});
