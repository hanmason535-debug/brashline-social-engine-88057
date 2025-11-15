// Tests: ensure the useScrollAnimation hook exposes a stable ref and visibility flag with sensible defaults.
/**
 * File overview: src/hooks/useScrollAnimation.test.tsx
 *
 * Test suite validating the public behavior of the associated module.
 * Behavior:
 * - Focuses on observable outputs and edge cases, not implementation details.
 * Assumptions:
 * - Serves as executable documentation for how callers are expected to use the API.
 */
import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useScrollAnimation } from './useScrollAnimation';

describe('useScrollAnimation', () => {
  it('should initialize with isVisible false', () => {
    const { result } = renderHook(() => useScrollAnimation());

    expect(result.current.isVisible).toBe(false);
    expect(result.current.elementRef).toBeDefined();
    expect(result.current.elementRef.current).toBeNull();
  });

  it('should return ref and visibility state', () => {
    const { result } = renderHook(() => useScrollAnimation());

    expect(result.current).toHaveProperty('elementRef');
    expect(result.current).toHaveProperty('isVisible');
    expect(typeof result.current.isVisible).toBe('boolean');
  });

  it('should handle missing element gracefully', () => {
    const { result } = renderHook(() => useScrollAnimation());

    expect(result.current.elementRef.current).toBeNull();
    expect(() => result.current).not.toThrow();
  });

  it('should accept default options', () => {
    const { result } = renderHook(() => useScrollAnimation());

    expect(result.current.isVisible).toBe(false);
    expect(result.current.elementRef).toBeDefined();
  });

  it('should accept custom threshold option', () => {
    const { result } = renderHook(() => useScrollAnimation({ threshold: 0.5 }));

    expect(result.current.isVisible).toBe(false);
    expect(result.current.elementRef).toBeDefined();
  });

  it('should accept custom rootMargin option', () => {
    const { result } = renderHook(() => useScrollAnimation({ rootMargin: '50px' }));

    expect(result.current.isVisible).toBe(false);
    expect(result.current.elementRef).toBeDefined();
  });

  it('should accept all custom options', () => {
    const { result } = renderHook(() =>
      useScrollAnimation({
        threshold: 0.8,
        rootMargin: '100px',
        triggerOnce: false,
      })
    );

    expect(result.current.isVisible).toBe(false);
    expect(result.current.elementRef).toBeDefined();
  });
});
