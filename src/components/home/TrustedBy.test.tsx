import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import TrustedBy from './TrustedBy';

describe('TrustedBy', () => {
  it('renders the section title', () => {
    render(<TrustedBy />);
    expect(screen.getByText('Trusted By The Best')).toBeInTheDocument();
  });

  it('renders all client logos', () => {
    const { container } = render(<TrustedBy />);
    const images = container.querySelectorAll('img');
    expect(images.length).toBe(5);

    // Check alt text for each image
    expect(screen.getByAltText('Client Logo 1')).toBeInTheDocument();
    expect(screen.getByAltText('Client Logo 2')).toBeInTheDocument();
    expect(screen.getByAltText('Client Logo 3')).toBeInTheDocument();
    expect(screen.getByAltText('Client Logo 4')).toBeInTheDocument();
    expect(screen.getByAltText('Client Logo 5')).toBeInTheDocument();
  });
});
