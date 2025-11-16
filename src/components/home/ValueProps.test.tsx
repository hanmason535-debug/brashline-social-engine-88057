import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ValueProps from './ValueProps';

// Mock the hook
vi.mock('@/hooks/useScrollAnimation');

// Import after mocking
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

describe('ValueProps', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render with initial animation state (not visible)', () => {
    vi.mocked(useScrollAnimation).mockReturnValue({
      elementRef: { current: null },
      isVisible: false,
    });

    render(<ValueProps lang="en" />);

    const card = screen.getByText('Social, Handled.').closest('.shadow-soft');
    expect(card).toHaveClass('opacity-0');
    expect(card).toHaveClass('translate-y-10');
  });

  it('should render with final animation state (visible)', () => {
    vi.mocked(useScrollAnimation).mockReturnValue({
      elementRef: { current: null },
      isVisible: true,
    });

    render(<ValueProps lang="en" />);

    const card = screen.getByText('Social, Handled.').closest('.shadow-soft');
    expect(card).toHaveClass('opacity-100');
    expect(card).toHaveClass('translate-y-0');

    // Verify all value props are visible
    expect(screen.getByText('Websites That Work.')).toBeInTheDocument();
    expect(screen.getByText('Presence That Performs.')).toBeInTheDocument();
  });

  it('should display content in English', () => {
    vi.mocked(useScrollAnimation).mockReturnValue({
      elementRef: { current: null },
      isVisible: true,
    });

    render(<ValueProps lang="en" />);

    // Check titles
    expect(screen.getByText('Social, Handled.')).toBeInTheDocument();
    expect(screen.getByText('Websites That Work.')).toBeInTheDocument();
    expect(screen.getByText('Presence That Performs.')).toBeInTheDocument();

    // Check descriptions
    expect(
      screen.getByText(/Consistent, on-brand content that keeps your business visible/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Fast, optimized, and built to turn clicks into customers/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Smart SEO and strategy to grow your brand organically/)
    ).toBeInTheDocument();
  });

  it('should display content in Spanish', () => {
    vi.mocked(useScrollAnimation).mockReturnValue({
      elementRef: { current: null },
      isVisible: true,
    });

    render(<ValueProps lang="es" />);

    // Check titles
    expect(screen.getByText('Redes Gestionadas.')).toBeInTheDocument();
    expect(screen.getByText('Sitios Web que Funcionan.')).toBeInTheDocument();
    expect(screen.getByText('Presencia que Rinde.')).toBeInTheDocument();

    // Check descriptions
    expect(
      screen.getByText(/Contenido constante y de marca que mantiene tu negocio visible/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Rápidos, optimizados y construidos para convertir clics en clientes/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/SEO inteligente y estrategia para hacer crecer tu marca orgánicamente/)
    ).toBeInTheDocument();
  });

  it('should render three value proposition cards', () => {
    vi.mocked(useScrollAnimation).mockReturnValue({
      elementRef: { current: null },
      isVisible: true,
    });

    const { container } = render(<ValueProps lang="en" />);

    // Check that we have 3 cards
    const cards = container.querySelectorAll('.grid > .shadow-soft');
    expect(cards).toHaveLength(3);
  });

  it('should render icons for each value prop', () => {
    vi.mocked(useScrollAnimation).mockReturnValue({
      elementRef: { current: null },
      isVisible: true,
    });

    const { container } = render(<ValueProps lang="en" />);

    // Check that each card has an icon container
    const iconContainers = container.querySelectorAll('.inline-flex');
    expect(iconContainers).toHaveLength(3);

    // Each icon container should have an SVG
    iconContainers.forEach((iconContainer) => {
      const icon = iconContainer.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });
  });

  it('should apply staggered animation delays', () => {
    vi.mocked(useScrollAnimation).mockReturnValue({
      elementRef: { current: null },
      isVisible: true,
    });

    const { container } = render(<ValueProps lang="en" />);

    const cards = container.querySelectorAll('.grid > .shadow-soft');

    // Check that each card has a transition delay
    cards.forEach((card, index) => {
      const expectedDelay = `${index * 150}ms`;
      expect(card).toHaveStyle({ transitionDelay: expectedDelay });
    });
  });

  it('should call useScrollAnimation with correct threshold', () => {
    vi.mocked(useScrollAnimation).mockReturnValue({
      elementRef: { current: null },
      isVisible: true,
    });

    render(<ValueProps lang="en" />);

    expect(useScrollAnimation).toHaveBeenCalledWith({ threshold: 0.2 });
  });

  it('should apply hover effects via CSS classes', () => {
    vi.mocked(useScrollAnimation).mockReturnValue({
      elementRef: { current: null },
      isVisible: true,
    });

    const { container } = render(<ValueProps lang="en" />);

    const cards = container.querySelectorAll('.shadow-soft');

    cards.forEach((card) => {
      // Check for hover classes
      expect(card).toHaveClass('hover:shadow-medium');
      expect(card).toHaveClass('hover:-translate-y-1');
    });
  });

  it('should have proper display name for memo component', () => {
    expect(ValueProps.displayName).toBe('ValueProps');
  });

  it('should render with proper semantic structure', () => {
    vi.mocked(useScrollAnimation).mockReturnValue({
      elementRef: { current: null },
      isVisible: true,
    });

    const { container } = render(<ValueProps lang="en" />);

    // Check for section element
    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();

    // Check for heading elements
    const headings = container.querySelectorAll('h3');
    expect(headings).toHaveLength(3);

    // Check for paragraphs
    const paragraphs = container.querySelectorAll('p');
    expect(paragraphs).toHaveLength(3);
  });
});
