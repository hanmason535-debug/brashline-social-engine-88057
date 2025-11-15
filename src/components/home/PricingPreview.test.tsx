import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import PricingPreview from './PricingPreview';

// Mock the hooks
vi.mock('react-intersection-observer');
vi.mock('framer-motion', () => ({
  motion: {
    div: (props: any) => <div {...props} />,
    h2: (props: any) => <h2 {...props} />,
    p: (props: any) => <p {...props} />,
  },
}));

// Import after mocking
import { useInView } from 'react-intersection-observer';

describe('PricingPreview', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useInView).mockReturnValue({
      ref: { current: null },
      inView: true,
    });
  });

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
  });

  it('toggles to annual billing and shows discount badge', () => {
    render(
      <MemoryRouter>
        <PricingPreview lang="en" />
      </MemoryRouter>
    );

    const annualToggle = screen.getByLabelText('Annual billing');
    fireEvent.click(annualToggle);

    expect(screen.getByText('Save up to 15%')).toBeInTheDocument();
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
