import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Hero from './Hero';

// Mock BackgroundPaths and motion to keep test light
vi.mock('@/components/ui/background-paths', () => ({ default: () => <div data-testid="bg-paths" /> }));
vi.mock('framer-motion', () => ({
  motion: {
    div: (props: any) => <div {...props} />,
    h1: (props: any) => <h1 {...props} />,
    p: (props: any) => <p {...props} />,
    span: (props: any) => <span {...props} />,
  },
  AnimatePresence: (props: any) => <div {...props} />,
}));

describe('Hero', () => {
  it('renders English content and CTA', () => {
    render(<Hero lang="en" />);
    expect(screen.getByText('Florida-Grown')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Book Strategic Call/i })).toBeInTheDocument();
  });

  it('renders Spanish content', () => {
    render(<Hero lang="es" />);
    expect(screen.getByText('Crecido en Florida')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reservar Llamada Estratégica/i })).toBeInTheDocument();
  });
});
