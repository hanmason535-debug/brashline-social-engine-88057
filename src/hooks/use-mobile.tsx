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
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}
