import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useCountUp } from './useCountUp';

describe('useCountUp', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => {
      return setTimeout(() => cb(performance.now()), 1) as unknown as number;
    });
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation((id: number) => {
      clearTimeout(id);
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('should count up from start to end', () => {
    const { result } = renderHook(() => useCountUp({ end: 100, duration: 1000, shouldStart: true }));

    expect(result.current).toBe(0);

    act(() => {
      vi.runAllTimers();
    });

    expect(result.current).toBe(100);
  });

  it('should not start counting if shouldStart is false', () => {
    const { result } = renderHook(() => useCountUp({ end: 100, shouldStart: false }));

    expect(result.current).toBe(0);

    act(() => {
      vi.runAllTimers();
    });

    expect(result.current).toBe(0);
  });

  it('should start from a custom start value', () => {
    const { result } = renderHook(() => useCountUp({ start: 50, end: 100, shouldStart: true }));

    expect(result.current).toBe(50);

    act(() => {
      vi.runAllTimers();
    });

    expect(result.current).toBe(100);
  });

  it('should work with a custom duration', () => {
    const { result } = renderHook(() => useCountUp({ end: 100, duration: 500, shouldStart: true }));

    act(() => {
      vi.runAllTimers();
    });

    expect(result.current).toBe(100);
  });

  it('should clean up animation frame on unmount', () => {
    const { unmount } = renderHook(() => useCountUp({ end: 100, shouldStart: true }));
    act(() => {
        vi.advanceTimersByTime(100);
    });
    unmount();
    expect(window.cancelAnimationFrame).toHaveBeenCalled();
  });
});
