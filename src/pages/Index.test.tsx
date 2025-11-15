/**
 * File overview: src/pages/Index.test.tsx
 *
 * Test suite validating the public behavior of the associated module.
 * Behavior:
 * - Focuses on observable outputs and edge cases, not implementation details.
 * Assumptions:
 * - Serves as executable documentation for how callers are expected to use the API.
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Index from './Index';

describe('Index Page', () => {
  it(
    'should render the header, main content, and footer',
    async () => {
      render(
        <HelmetProvider>
          <BrowserRouter
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
            }}
          >
            <Index />
          </BrowserRouter>
        </HelmetProvider>
      );

      // Check for the header (navigation)
      const header = screen.getByRole('banner');
      expect(header).toBeInTheDocument();

      // Check for the main content
      const main = screen.getByRole('main');
      expect(main).toBeInTheDocument();

      // Check for the footer
      const footer = screen.getByRole('contentinfo');
      expect(footer).toBeInTheDocument();
    },
    10000
  );

  it('should render hero section', () => {
    render(
      <HelmetProvider>
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <Index />
        </BrowserRouter>
      </HelmetProvider>
    );

    // Hero should contain a heading
    const heroHeading = screen.getByRole('heading', { level: 1 });
    expect(heroHeading).toBeInTheDocument();
  });

  it('should render all major sections', () => {
    render(
      <HelmetProvider>
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <Index />
        </BrowserRouter>
      </HelmetProvider>
    );

    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
    
    // Main should contain multiple sections
    expect(main.children.length).toBeGreaterThan(0);
  });
});
