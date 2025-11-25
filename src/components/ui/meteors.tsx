/**
 * File overview: src/components/ui/meteors.tsx
 *
 * React component `meteors` rendering a focused piece of UI.
 * Behavior:
 * - Receives props from parents and may read from hooks or context.
 * - Renders presentational markup and wires callbacks for user interaction.
 * Data flow:
 * - Follows a one-way data flow: parents own data, this component focuses on display.
 * Performance:
 * - Optimized for 60fps with GPU acceleration, device-based particle count, and intersection observer
 */
import { cn } from "@/lib/utils";
import React, { useMemo, useRef, useEffect, useState } from "react";

export const Meteors = ({ number, className }: { number?: number; className?: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(true);

  // Device-based meteor count optimization
  const meteorCount = useMemo(() => {
    const baseCount = number || 20;
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const isLowEnd = typeof navigator !== 'undefined' && navigator.hardwareConcurrency ? navigator.hardwareConcurrency < 4 : false;
    
    if (isMobile) return Math.min(baseCount, 10);
    if (isLowEnd) return Math.min(baseCount, 15);
    return baseCount;
  }, [number]);

  // Memoize meteor configurations to prevent recalculation on every render
  const meteors = useMemo(() => {
    return Array.from({ length: meteorCount }, (_, idx) => ({
      id: `meteor-${idx}`,
      left: Math.floor(Math.random() * 800 - 400),
      delay: Math.random() * 0.6 + 0.2,
      duration: Math.floor(Math.random() * 8 + 2),
    }));
  }, [meteorCount]);

  // Intersection observer to pause animations when off-screen
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "100px" }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none">
      {meteors.map((meteor) => (
        <span
          key={meteor.id}
          className={cn(
            "absolute top-1/2 left-1/2 h-0.5 w-0.5 rounded-[9999px] bg-muted-foreground shadow-[0_0_0_1px_hsl(var(--muted-foreground)_/_0.1)] rotate-[215deg]",
            "before:content-[''] before:absolute before:top-1/2 before:transform before:-translate-y-[50%] before:w-[50px] before:h-[1px] before:bg-gradient-to-r before:from-muted-foreground before:to-transparent",
            isInView ? "animate-meteor-effect" : "",
            className
          )}
          style={{
            top: 0,
            left: `${meteor.left}px`,
            animationDelay: `${meteor.delay}s`,
            animationDuration: `${meteor.duration}s`,
            willChange: isInView ? 'transform, opacity' : 'auto',
            transform: 'translate3d(0, 0, 0)', // Force GPU acceleration
          }}
        />
      ))}
    </div>
  );
};
