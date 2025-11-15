import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import StatsSection from './StatsSection';

// Mock the hooks
vi.mock('react-intersection-observer');
vi.mock('@/hooks/useCountUp');
vi.mock('framer-motion', () => ({
  motion: {
    div: (props: any) => <div {...props} />,
  },
}));

// Import after mocking to get the mocked versions
import { useInView } from 'react-intersection-observer';
import { useCountUp } from '@/hooks/useCountUp';

describe('StatsSection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render with initial animation state (not visible)', () => {
    // Mock hooks to return initial state
    vi.mocked(useInView).mockReturnValue({
      ref: { current: null },
      inView: false,
    });
    vi.mocked(useCountUp).mockReturnValue(0);

    const { container } = render(<StatsSection lang="en" />);

    // Check that all initial counts are displayed as 0
    const statCards = container.querySelectorAll('.text-center');
    statCards.forEach((card) => {
      const countElement = card.querySelector('.text-4xl');
      expect(countElement?.textContent?.startsWith('0')).toBe(true);
    });
  });

  it('should render with final animation state (visible)', () => {
    // Mock hooks to return visible state with final counts
    vi.mocked(useInView).mockReturnValue({
      ref: { current: null },
      inView: true,
    });
    // Mock useCountUp to return the final values based on options
    vi.mocked(useCountUp).mockImplementation(({ end }) => end);

    render(<StatsSection lang="en" />);

    // Check that all final counts are displayed
    expect(screen.getByText(/500/)).toBeInTheDocument();
    expect(screen.getByText(/98/)).toBeInTheDocument();
    expect(screen.getByText(/24/)).toBeInTheDocument();
    expect(screen.getByText(/150/)).toBeInTheDocument();
  });

  it('should display labels in English', () => {
    vi.mocked(useInView).mockReturnValue({
      ref: { current: null },
      inView: true,
    });
    vi.mocked(useCountUp).mockImplementation(({ end }) => end);

    render(<StatsSection lang="en" />);

    expect(screen.getByText('Clients Served')).toBeInTheDocument();
    expect(screen.getByText('Satisfaction Rate')).toBeInTheDocument();
    expect(screen.getByText('Support Available')).toBeInTheDocument();
    expect(screen.getByText('Avg. Growth')).toBeInTheDocument();
  });

  it('should display labels in Spanish', () => {
    vi.mocked(useInView).mockReturnValue({
      ref: { current: null },
      inView: true,
    });
    vi.mocked(useCountUp).mockImplementation(({ end }) => end);

    render(<StatsSection lang="es" />);

    expect(screen.getByText('Clientes Atendidos')).toBeInTheDocument();
    expect(screen.getByText('Tasa de Satisfacción')).toBeInTheDocument();
    expect(screen.getByText('Soporte Disponible')).toBeInTheDocument();
    expect(screen.getByText('Crecimiento Promedio')).toBeInTheDocument();
  });

  it('should render all stat icons', () => {
    vi.mocked(useInView).mockReturnValue({
      ref: { current: null },
      inView: true,
    });
    vi.mocked(useCountUp).mockImplementation(({ end }) => end);

    const { container } = render(<StatsSection lang="en" />);

    // Check that we have 4 stat cards
    const statCards = container.querySelectorAll('.text-center');
    expect(statCards).toHaveLength(4);

    // Check that each card has an icon container
    statCards.forEach((card) => {
      const iconContainer = card.querySelector('.inline-flex');
      expect(iconContainer).toBeInTheDocument();
    });
  });

  it('should call useCountUp with correct parameters', () => {
    vi.mocked(useInView).mockReturnValue({
      ref: { current: null },
      inView: true,
    });
    vi.mocked(useCountUp).mockImplementation(({ end }) => end);

    render(<StatsSection lang="en" />);

    // Verify useCountUp was called 4 times (once per stat)
    expect(useCountUp).toHaveBeenCalledTimes(4);

    // Verify each call has correct end values and duration
    expect(useCountUp).toHaveBeenCalledWith({
      end: 500,
      duration: 2500,
      shouldStart: true,
    });
    expect(useCountUp).toHaveBeenCalledWith({
      end: 98,
      duration: 2500,
      shouldStart: true,
    });
    expect(useCountUp).toHaveBeenCalledWith({
      end: 24,
      duration: 2500,
      shouldStart: true,
    });
    expect(useCountUp).toHaveBeenCalledWith({
      end: 150,
      duration: 2500,
      shouldStart: true,
    });
  });

  it('should render correct suffixes for each stat', () => {
    vi.mocked(useInView).mockReturnValue({
      ref: { current: null },
      inView: true,
    });
    vi.mocked(useCountUp).mockImplementation(({ end }) => end);

    render(<StatsSection lang="en" />);

    // Check for the suffixes appended to each count
    expect(screen.getByText(/500\+/)).toBeInTheDocument(); // Clients Served
    expect(screen.getByText(/98%/)).toBeInTheDocument(); // Satisfaction Rate
    expect(screen.getByText(/24\/7/)).toBeInTheDocument(); // Support Available
    expect(screen.getByText(/150%/)).toBeInTheDocument(); // Avg. Growth
  });
});
