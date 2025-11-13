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
