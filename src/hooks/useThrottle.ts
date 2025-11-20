/**
 * File overview: src/hooks/useThrottle.ts
 *
 * Custom React hook `useThrottle` encapsulating reusable view logic.
 * Inputs:
 * - Parameters passed to the hook and ambient browser/app state.
 * Outputs:
 * - A stable API of state and callbacks for components to consume.
 * Side effects:
 * - Uses React effects where needed and is responsible for its own cleanup.
 * Performance:
 * - Designed so calling components can avoid duplicating logic and re-renders.
 */
import { useEffect, useRef } from "react";

// Hook: returns a throttled version of a callback that limits how often it can run.
// Inputs: the target callback and a minimum delay between invocations.
// Output: a stable function that forwards the latest arguments while respecting the delay.
// Performance: coalesces rapid calls and ensures a trailing call is delivered without tight loops.
export function useThrottle<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const lastRun = useRef(Date.now());
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (...args: Parameters<T>) => {
    const now = Date.now();
    const timeSinceLastRun = now - lastRun.current;

    if (timeSinceLastRun >= delay) {
      callback(...args);
      lastRun.current = now;
    } else {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callback(...args);
        lastRun.current = Date.now();
      }, delay - timeSinceLastRun);
    }
  };
}
