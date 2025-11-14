import { useEffect, useState, useRef } from "react";
import { useIsDesktop } from "./useMediaQuery";

interface ParallaxOptions {
  speed?: number;
  direction?: "up" | "down";
  enableOnMobile?: boolean;
}

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
    // Disable parallax on mobile for better performance (unless explicitly enabled)
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

    // Use passive event listener for better scroll performance
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial calculation

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [speed, direction, isDesktop, enableOnMobile]);

  return offset;
}
