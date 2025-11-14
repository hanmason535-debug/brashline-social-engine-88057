import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useParallax } from './useParallax';

describe('useParallax', () => {
  beforeEach(() => {
    // Mock window.pageYOffset
    Object.defineProperty(window, 'pageYOffset', {
      writable: true,
      configurable: true,
      value: 0,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize with offset 0', () => {
    const { result } = renderHook(() => useParallax());

    expect(Math.abs(result.current)).toBe(0); // Handle -0 vs +0
  });

  it('should calculate parallax offset on scroll (up direction)', () => {
    const { result } = renderHook(() => useParallax({ speed: 0.5, direction: 'up' }));

    act(() => {
      Object.defineProperty(window, 'pageYOffset', { value: 100, writable: true });
      window.dispatchEvent(new Event('scroll'));
    });

    expect(result.current).toBe(-50); // 100 * 0.5 * -1
  });

  it('should calculate parallax offset on scroll (down direction)', () => {
    const { result } = renderHook(() => useParallax({ speed: 0.5, direction: 'down' }));

    act(() => {
      Object.defineProperty(window, 'pageYOffset', { value: 100, writable: true });
      window.dispatchEvent(new Event('scroll'));
    });

    expect(result.current).toBe(50); // 100 * 0.5 * 1
  });

  it('should use default options when none provided', () => {
    const { result } = renderHook(() => useParallax());

    act(() => {
      Object.defineProperty(window, 'pageYOffset', { value: 200, writable: true });
      window.dispatchEvent(new Event('scroll'));
    });

    expect(result.current).toBe(-100); // 200 * 0.5 * -1 (default: speed=0.5, direction='up')
  });

  it('should handle different speed values', () => {
    const { result } = renderHook(() => useParallax({ speed: 1.0, direction: 'up' }));

    act(() => {
      Object.defineProperty(window, 'pageYOffset', { value: 100, writable: true });
      window.dispatchEvent(new Event('scroll'));
    });

    expect(result.current).toBe(-100); // 100 * 1.0 * -1
  });

  it('should handle speed 0', () => {
    const { result } = renderHook(() => useParallax({ speed: 0, direction: 'up' }));

    act(() => {
      Object.defineProperty(window, 'pageYOffset', { value: 100, writable: true });
      window.dispatchEvent(new Event('scroll'));
    });

    expect(Math.abs(result.current)).toBe(0); // Handle -0 vs +0
  });

  it('should update offset on multiple scroll events', () => {
    const { result } = renderHook(() => useParallax({ speed: 0.5, direction: 'up' }));

    act(() => {
      Object.defineProperty(window, 'pageYOffset', { value: 100, writable: true });
      window.dispatchEvent(new Event('scroll'));
    });

    expect(result.current).toBe(-50);

    act(() => {
      Object.defineProperty(window, 'pageYOffset', { value: 200, writable: true });
      window.dispatchEvent(new Event('scroll'));
    });

    expect(result.current).toBe(-100);
  });

  it('should calculate initial offset on mount', () => {
    Object.defineProperty(window, 'pageYOffset', { value: 150, writable: true });

    const { result } = renderHook(() => useParallax({ speed: 0.5, direction: 'up' }));

    expect(result.current).toBe(-75); // Initial calculation
  });

  it('should remove scroll listener on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

    const { unmount } = renderHook(() => useParallax());

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
  });

  it('should handle negative speed values', () => {
    const { result } = renderHook(() => useParallax({ speed: -0.5, direction: 'up' }));

    act(() => {
      Object.defineProperty(window, 'pageYOffset', { value: 100, writable: true });
      window.dispatchEvent(new Event('scroll'));
    });

    expect(result.current).toBe(50); // 100 * -0.5 * -1
  });

  it('should update when speed or direction changes', () => {
    const { result, rerender } = renderHook(
      ({ speed, direction }) => useParallax({ speed, direction }),
      { initialProps: { speed: 0.5, direction: 'up' as 'up' | 'down' } }
    );

    act(() => {
      Object.defineProperty(window, 'pageYOffset', { value: 100, writable: true });
      window.dispatchEvent(new Event('scroll'));
    });

    expect(result.current).toBe(-50);

    rerender({ speed: 0.5, direction: 'down' });

    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });

    expect(result.current).toBe(50); // Same scroll, different direction
  });

  it('should handle large scroll values', () => {
    const { result } = renderHook(() => useParallax({ speed: 0.3, direction: 'up' }));

    act(() => {
      Object.defineProperty(window, 'pageYOffset', { value: 5000, writable: true });
      window.dispatchEvent(new Event('scroll'));
    });

    expect(result.current).toBe(-1500); // 5000 * 0.3 * -1
  });

  it('should work with fractional speed values', () => {
    const { result } = renderHook(() => useParallax({ speed: 0.25, direction: 'down' }));

    act(() => {
      Object.defineProperty(window, 'pageYOffset', { value: 400, writable: true });
      window.dispatchEvent(new Event('scroll'));
    });

    expect(result.current).toBe(100); // 400 * 0.25 * 1
  });
});
