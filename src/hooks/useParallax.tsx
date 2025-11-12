import { useEffect, useState } from "react";

interface ParallaxOptions {
  speed?: number;
  direction?: "up" | "down";
}

export function useParallax({ speed = 0.5, direction = "up" }: ParallaxOptions = {}) {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const parallaxOffset = scrolled * speed * (direction === "up" ? -1 : 1);
      setOffset(parallaxOffset);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial calculation

    return () => window.removeEventListener("scroll", handleScroll);
  }, [speed, direction]);

  return offset;
}
