import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ValueProps from './ValueProps';

// Mock the hooks
vi.mock('react-intersection-observer');
vi.mock('framer-motion', () => ({
  motion: {
    div: (props: any) => <div {...props} />,
  },
}));

// Import after mocking
import { useInView } from 'react-intersection-observer';

describe('ValueProps', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render with initial animation state (not visible)', () => {
    vi.mocked(useInView).mockReturnValue({
      ref: { current: null },
      inView: false,
    });

    render(<ValueProps lang="en" />);

    // In the 'hidden' state, the component should still render the content
    expect(screen.getByText('Social, Handled.')).toBeInTheDocument();
  });

  it('should render with final animation state (visible)', () => {
    vi.mocked(useInView).mockReturnValue({
      ref: { current: null },
      inView: true,
    });

    render(<ValueProps lang="en" />);

    // Verify all value props are visible
    expect(screen.getByText('Websites That Work.')).toBeInTheDocument();
    expect(screen.getByText('Presence That Performs.')).toBeInTheDocument();
  });

  it('should display content in English', () => {
    vi.mocked(useInView).mockReturnValue({
      ref: { current: null },
      inView: true,
    });

    render(<ValueProps lang="en" />);

    // Check titles
    expect(screen.getByText('Social, Handled.')).toBeInTheDocument();
    expect(screen.getByText('Websites That Work.')).toBeInTheDocument();
    expect(screen.getByText('Presence That Performs.')).toBeInTheDocument();
  });

  it('should display content in Spanish', () => {
    vi.mocked(useInView).mockReturnValue({
      ref: { current: null },
      inView: true,
    });

    render(<ValueProps lang="es" />);

    // Check titles
    expect(screen.getByText('Redes Gestionadas.')).toBeInTheDocument();
    expect(screen.getByText('Sitios Web que Funcionan.')).toBeInTheDocument();
    expect(screen.getByText('Presencia que Rinde.')).toBeInTheDocument();
  });

  it('should render three value proposition cards', () => {
    vi.mocked(useInView).mockReturnValue({
      ref: { current: null },
      inView: true,
    });

    const { container } = render(<ValueProps lang="en" />);

    // Check that we have 3 cards
    const cards = container.querySelectorAll('.h-full');
    expect(cards).toHaveLength(3);
  });
});
