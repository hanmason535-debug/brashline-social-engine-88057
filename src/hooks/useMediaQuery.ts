import { useState, useEffect } from 'react';

/**
 * Get initial matches value safely (works in SSR and client)
 */
function getInitialMatches(query: string): boolean {
  // For SSR/initial render, check if window exists
  if (typeof window === 'undefined') {
    // Default to desktop for SSR to match most common viewport
    return query.includes('min-width');
  }
  return window.matchMedia(query).matches;
}

/**
 * Custom hook for detecting media queries
 * @param query Media query string
 * @returns Boolean indicating if media query matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => getInitialMatches(query));

  useEffect(() => {
    const media = window.matchMedia(query);
    
    // Set initial value in case it changed
    setMatches(media.matches);

    // Create event listener
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Modern browsers
    if (media.addEventListener) {
      media.addEventListener('change', listener);
      return () => media.removeEventListener('change', listener);
    } else {
      // Legacy browsers
      media.addListener(listener);
      return () => media.removeListener(listener);
    }
  }, [query]);

  return matches;
}

/**
 * Convenience hook for desktop detection
 * @returns Boolean indicating if viewport is desktop (>= 768px)
 */
export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 768px)');
}

/**
 * Convenience hook for mobile detection
 * @returns Boolean indicating if viewport is mobile (< 768px)
 */
export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 767px)');
}
