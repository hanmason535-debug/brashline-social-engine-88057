/**
 * File overview: src/hooks/useCountUp.tsx
 *
 * Custom React hook `useCountUp` encapsulating reusable view logic.
 * Inputs:
 * - Parameters passed to the hook and ambient browser/app state.
 * Outputs:
 * - A stable API of state and callbacks for components to consume.
 * Side effects:
 * - Uses React effects where needed and is responsible for its own cleanup.
 * Performance:
 * - Designed so calling components can avoid duplicating logic and re-renders.
 */
import { useEffect, useState } from 'react';

// Hook: animates a numeric value from a start to an end value over time.
// Inputs: target end value, duration, optional start, and a flag indicating when to start.
// Output: the current animated count suitable for display components.
// Performance: uses requestAnimationFrame and a cheap easing function to keep updates smooth without extra renders.

interface UseCountUpOptions {
  end: number;
  duration?: number;
  start?: number;
  shouldStart?: boolean;
}

export const useCountUp = ({
  end,
  duration = 2000,
  start = 0,
  shouldStart = false,
}: UseCountUpOptions) => {
  const [count, setCount] = useState(start);

  useEffect(() => {
    if (!shouldStart) return;

    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      // Apply an ease-out curve so the count changes quickly at first and settles smoothly.
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(start + (end - start) * easeOutQuart);

      setCount(currentCount);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration, start, shouldStart]);

  return count;
};
