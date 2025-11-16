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
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import { BrowserRouter } from 'react-router-dom';
import Index from './Index';

describe('Index Page', () => {
  it(
    'should render the header, main content, and footer',
    async () => {
      render(
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <Index />
        </BrowserRouter>
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
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Index />
      </BrowserRouter>
    );

    // Hero should contain a heading
    const heroHeading = screen.getByRole('heading', { level: 1 });
    expect(heroHeading).toBeInTheDocument();
  });

  it('should render all major sections', () => {
    render(
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Index />
      </BrowserRouter>
    );

    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
    
    // Main should contain multiple sections
    expect(main.children.length).toBeGreaterThan(0);
  });
});
