/**
 * File overview: src/components/layout/Header.test.tsx
 *
 * Test suite validating the public behavior of the associated module.
 * Behavior:
 * - Focuses on observable outputs and edge cases, not implementation details.
 * Assumptions:
 * - Serves as executable documentation for how callers are expected to use the API.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Header from './Header';

describe('Header', () => {
  beforeEach(async () => {
    const { mediaQuery } = await import('vitest-matchmedia-mock');
    // Set viewport to desktop to ensure desktop components are rendered
    mediaQuery.set({ width: '1024px' });
  });

  it('should render the logo and desktop navigation', () => {
    render(
      <HelmetProvider>
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      </HelmetProvider>
    );
    const logo = screen.getByAltText('Brashline Logo');
    expect(logo).toBeInTheDocument();
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
  });

  it('should render navigation links', () => {
    render(
      <HelmetProvider>
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      </HelmetProvider>
    );
    const homeLink = screen.getByText('Home');
    expect(homeLink).toBeInTheDocument();
    const servicesLink = screen.getByText('Services');
    expect(servicesLink).toBeInTheDocument();
  });

  it('should render action buttons', () => {
    render(
      <HelmetProvider>
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      </HelmetProvider>
    );
    const themeSwitch = screen.getByTitle('theme');
    expect(themeSwitch).toBeInTheDocument();
    const languageButton = screen.getByRole('button', { name: /en/i });
    expect(languageButton).toBeInTheDocument();
  });

  it('should render the WhatsApp contact button', () => {
    render(
      <HelmetProvider>
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      </HelmetProvider>
    );
    const contactButton = screen.getByRole('button', { name: /Book Strategic Call/i });
    expect(contactButton).toBeInTheDocument();
  });

  it('should handle logo image errors gracefully', () => {
    render(
      <HelmetProvider>
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      </HelmetProvider>
    );
    const logo = screen.getByAltText('Brashline Logo');
    fireEvent.error(logo);
    expect(logo.src).toContain('logo.svg');
  });
});
