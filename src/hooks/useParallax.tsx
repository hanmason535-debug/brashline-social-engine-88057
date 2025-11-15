/**
 * File overview: src/hooks/useParallax.tsx
 *
 * Custom React hook `useParallax` encapsulating reusable view logic.
 * Inputs:
 * - Parameters passed to the hook and ambient browser/app state.
 * Outputs:
 * - A stable API of state and callbacks for components to consume.
 * Side effects:
 * - Uses React effects where needed and is responsible for its own cleanup.
 * Performance:
 * - Designed so calling components can avoid duplicating logic and re-renders.
 */
import { useEffect, useState, useRef } from "react";
import { useIsDesktop } from "./useMediaQuery";

interface ParallaxOptions {
  speed?: number;
  direction?: "up" | "down";
  enableOnMobile?: boolean;
}

// Hook: derives a scroll-based parallax offset using RAF to batch updates.
// Inputs: tuning options for speed, direction, and mobile enable flag.
// Output: a signed offset value intended for transform-based animations.
// Performance: disables work on non-desktop by default and uses a single scroll listener with rAF throttling.
export function useParallax({ 
  speed = 0.5, 
  direction = "up",
  enableOnMobile = false 
}: ParallaxOptions = {}) {
  const [offset, setOffset] = useState(0);
  const isDesktop = useIsDesktop();
  const rafRef = useRef<number>();
  const lastScrollRef = useRef(0);

  useEffect(() => {
    // Skip parallax on non-desktop by default to avoid extra scroll work on constrained devices.
    if (!enableOnMobile && !isDesktop) {
      return;
    }

    let ticking = false;

    const handleScroll = () => {
      lastScrollRef.current = window.pageYOffset;
      
      if (!ticking) {
        rafRef.current = requestAnimationFrame(() => {
          const scrolled = lastScrollRef.current;
          const parallaxOffset = scrolled * speed * (direction === "up" ? -1 : 1);
          setOffset(parallaxOffset);
          ticking = false;
        });
        ticking = true;
      }
    };

    // Use a passive scroll listener so handlers cannot block the main thread.
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Prime offset based on the current scroll position.

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [speed, direction, isDesktop, enableOnMobile]);

  return offset;
}
