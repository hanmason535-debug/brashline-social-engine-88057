/**
 * File overview: src/hooks/use-mobile.tsx
 *
 * Custom React hook `use-mobile` encapsulating reusable view logic.
 * Inputs:
 * - Parameters passed to the hook and ambient browser/app state.
 * Outputs:
 * - A stable API of state and callbacks for components to consume.
 * Side effects:
 * - Uses React effects where needed and is responsible for its own cleanup.
 * Performance:
 * - Designed so calling components can avoid duplicating logic and re-renders.
 */
import * as React from "react";

const MOBILE_BREAKPOINT = 768;

// Hook: reports whether the viewport is currently below the mobile breakpoint.
// Inputs: a fixed breakpoint constant shared with layout decisions.
// Output: a boolean flag that updates when the underlying media query changes.
// Performance: uses matchMedia events instead of resize polling to keep updates lightweight.
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

    const handleChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };

    // Set the initial state
    setIsMobile(mediaQuery.matches);

    // Add the event listener
    mediaQuery.addEventListener('change', handleChange);

    // Clean up the event listener on component unmount
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return isMobile;
}
