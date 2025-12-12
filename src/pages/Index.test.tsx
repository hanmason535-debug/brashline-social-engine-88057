/**
 * File overview: src/pages/Index.test.tsx
 *
 * Test suite validating the public behavior of the associated module.
 * Behavior:
 * - Focuses on observable outputs and edge cases, not implementation details.
 * Assumptions:
 * - Serves as executable documentation for how callers are expected to use the API.
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Index from './Index';

// Mock child components to keep the test focused on the Index page structure
vi.mock('@/components/layout/Header', () => ({ default: () => <header role="banner">Header</header> }));
vi.mock('@/components/layout/Footer', () => ({ default: () => <footer role="contentinfo">Footer</footer> }));
vi.mock('@/components/home/Hero', () => ({ default: () => <section><h1>Hero</h1></section> }));
vi.mock('@/components/home/TrustedBy', () => ({ default: () => <section>TrustedBy</section> }));
vi.mock('@/components/home/ValueProps', () => ({ default: () => <section>ValueProps</section> }));
vi.mock('@/components/home/StatsSection', () => ({ default: () => <section>StatsSection</section> }));
vi.mock('@/components/home/PricingPreview', () => ({ default: () => <section>PricingPreview</section> }));
vi.mock('@/components/forms/ContactFormDialog', () => ({ ContactFormDialog: () => <button>Contact Us</button> }));
vi.mock('react-intersection-observer', () => ({
  useInView: () => ({ ref: { current: null }, inView: true }),
}));
vi.mock('framer-motion', () => ({
  motion: {
    div: (props: any) => <div {...props} />,
    h2: (props: any) => <h2 {...props} />,
    p: (props: any) => <p {...props} />,
  },
}));


describe('Index Page', () => {
  it(
    'should render the header, main content, and footer',
    () => {
      render(
        <BrowserRouter>
          <Index />
        </BrowserRouter>
      );

      // Check for the header (navigation)
      expect(screen.getByRole('banner')).toBeInTheDocument();

      // Check for the main content
      expect(screen.getByRole('main')).toBeInTheDocument();

      // Check for the footer
      expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    }
  );

  it('should render hero section', () => {
    render(
      <BrowserRouter>
        <Index />
      </BrowserRouter>
    );

    // Hero should contain a heading
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('should render all major sections', async () => {
    render(
      <BrowserRouter>
        <Index />
      </BrowserRouter>
    );

    expect(await screen.findByText('TrustedBy')).toBeInTheDocument();
    expect(await screen.findByText('ValueProps')).toBeInTheDocument();
    expect(await screen.findByText('StatsSection')).toBeInTheDocument();
    expect(await screen.findByText('PricingPreview')).toBeInTheDocument();
  });
});
