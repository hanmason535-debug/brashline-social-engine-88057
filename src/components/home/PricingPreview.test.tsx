import { render } from '@testing-library/react';
import { screen, fireEvent } from '@testing-library/dom';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import PricingPreview from './PricingPreview';

// Provide router context so internal <Link> renders without errors

describe('PricingPreview', () => {
  it('renders heading and plan names (English)', () => {
    render(
      <MemoryRouter>
        <PricingPreview lang="en" />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: 'Pick your plan' })).toBeInTheDocument();
    expect(screen.getByText('Starter Spark')).toBeInTheDocument();
    expect(screen.getByText('Brand Pulse')).toBeInTheDocument();
    expect(screen.getByText('Impact Engine')).toBeInTheDocument();

    // CTA buttons (anchor links)
    expect(screen.getAllByRole('link', { name: 'Get Started' }).length).toBeGreaterThan(0);
  });

  it('toggles to annual billing and shows discount badge', () => {
    render(
      <MemoryRouter>
        <PricingPreview lang="en" />
      </MemoryRouter>
    );

    const annual = screen.getByText('Annual');
    fireEvent.click(annual);

    expect(screen.getAllByText(/off/)[0]).toBeInTheDocument();
  });

  it('renders Spanish labels', () => {
    render(
      <MemoryRouter>
        <PricingPreview lang="es" />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { name: 'Elige tu plan' })).toBeInTheDocument();
    expect(screen.getAllByText('Comenzar').length).toBeGreaterThan(0);
  });
});
