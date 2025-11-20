/**
 * File overview: src/hooks/useMediaQuery.ts
 *
 * Custom React hook `useMediaQuery` encapsulating reusable view logic.
 * Inputs:
 * - Parameters passed to the hook and ambient browser/app state.
 * Outputs:
 * - A stable API of state and callbacks for components to consume.
 * Side effects:
 * - Uses React effects where needed and is responsible for its own cleanup.
 * Performance:
 * - Designed so calling components can avoid duplicating logic and re-renders.
 */
import { useState, useEffect } from "react";

// Helper: compute an initial media query match in both browser and SSR environments.
function getInitialMatches(query: string): boolean {
  // On the server, assume desktop for min-width queries so layouts default to wide view.
  if (typeof window === "undefined") {
    return query.includes("min-width");
  }
  return window.matchMedia(query).matches;
}

// Hook: subscribes to a media query and reports whether it currently matches.
// Inputs: a standard CSS media query string.
// Output: a boolean match flag seeded from SSR-safe initial state.
// Performance: attaches a single listener per query and cleans it up on unmount.
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => getInitialMatches(query));

  useEffect(() => {
    const media = window.matchMedia(query);

    // Sync state in case the query result changed between render and effect.
    setMatches(media.matches);

    // Create event listener
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    if (media.addEventListener) {
      media.addEventListener("change", listener);
      return () => media.removeEventListener("change", listener);
    } else {
      media.addListener(listener);
      return () => media.removeListener(listener);
    }
  }, [query]);

  return matches;
}

// Hook: specialized desktop matcher for viewports ≥ 768px.
export function useIsDesktop(): boolean {
  return useMediaQuery("(min-width: 768px)");
}

// Hook: specialized mobile matcher for viewports < 768px.
export function useIsMobile(): boolean {
  return useMediaQuery("(max-width: 767px)");
}
