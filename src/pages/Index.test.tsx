import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Index from './Index';

describe('Index Page', () => {
  it(
    'should render the header, main content, and footer',
    async () => {
      render(
        <MemoryRouter>
          <Index />
        </MemoryRouter>
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
      <MemoryRouter>
        <Index />
      </MemoryRouter>
    );

    // Hero should contain a heading
    const heroHeading = screen.getByRole('heading', { level: 1 });
    expect(heroHeading).toBeInTheDocument();
  });

  it('should render all major sections', () => {
    render(
      <MemoryRouter>
        <Index />
      </MemoryRouter>
    );

    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
    
    // Main should contain multiple sections
    expect(main.children.length).toBeGreaterThan(0);
  });
});
