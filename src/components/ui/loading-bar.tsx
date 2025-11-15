/**
 * File overview: src/components/ui/loading-bar.tsx
 *
 * React component `loading-bar` rendering a focused piece of UI.
 * Behavior:
 * - Receives props from parents and may read from hooks or context.
 * - Renders presentational markup and wires callbacks for user interaction.
 * Data flow:
 * - Follows a one-way data flow: parents own data, this component focuses on display.
 * Performance:
 * - Avoid expensive work during render and prefer memoized helpers for heavy subtrees.
 */
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

export const LoadingBar = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const location = useLocation();

  useEffect(() => {
    setIsLoading(true);
    setProgress(30);

    const timer1 = setTimeout(() => setProgress(60), 100);
    const timer2 = setTimeout(() => setProgress(90), 300);
    const timer3 = setTimeout(() => {
      setProgress(100);
      setTimeout(() => setIsLoading(false), 200);
    }, 500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [location.pathname]);

  if (!isLoading && progress === 0) return null;

  return (
    <div
      className={cn(
        'fixed top-0 left-0 right-0 h-1 z-50 transition-all duration-300 bg-gradient-to-r from-primary via-primary-glow to-primary',
        isLoading ? 'opacity-100' : 'opacity-0'
      )}
      style={{
        width: `${progress}%`,
        transition: 'width 0.3s ease-out, opacity 0.3s ease-out',
      }}
    />
  );
};
