// Tests: cover the breakpoint behavior of the useIsMobile hook under different simulated viewport widths.
/**
 * File overview: src/hooks/use-mobile.test.tsx
 *
 * Test suite validating the public behavior of the associated module.
 * Behavior:
 * - Focuses on observable outputs and edge cases, not implementation details.
 * Assumptions:
 * - Serves as executable documentation for how callers are expected to use the API.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useIsMobile } from './use-mobile';
import MatchMediaMock from 'vitest-matchmedia-mock';

describe('useIsMobile Hook', () => {
  let matchMediaMock: MatchMediaMock;

  beforeEach(() => {
    matchMediaMock = new MatchMediaMock();
  });

  afterEach(() => {
    matchMediaMock.destroy();
  });

  it('should return true when the screen width is less than the mobile breakpoint', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500,
    });
    matchMediaMock.useMediaQuery('(max-width: 767px)');
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  it('should return false when the screen width is greater than the mobile breakpoint', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
    matchMediaMock.useMediaQuery('(min-width: 768px)');
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });
});
