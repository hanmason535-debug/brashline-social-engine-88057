/**
 * File overview: src/components/ui/background-paths.tsx
 *
 * React component `background-paths` rendering a focused piece of UI.
 * Behavior:
 * - Receives props from parents and may read from hooks or context.
 * - Renders presentational markup and wires callbacks for user interaction.
 * Data flow:
 * - Follows a one-way data flow: parents own data, this component focuses on display.
 * Performance:
 * - Avoid expensive work during render and prefer memoized helpers for heavy subtrees.
 */
"use client";

import { motion } from "framer-motion";
import { useIsDesktop } from "@/hooks/useMediaQuery";
import { useMemo, useRef, useEffect, useState } from "react";

function FloatingPaths({ position }: { position: number }) {
  const isDesktop = useIsDesktop();
  const [isInView, setIsInView] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Increased path count for more visible animation effect
  // Balance between visual impact and performance
  const pathCount = isDesktop ? 28 : 36;

  // Phase 2 Optimization: Memoize stable random durations to avoid recalculating on every render
  const durations = useMemo(() => {
    return Array.from({ length: pathCount }, () => 20 + Math.random() * 10);
  }, [pathCount]);

  // Phase 2 Optimization: Memoize path data to compute once per pathCount/position change
  const paths = useMemo(
    () =>
      Array.from({ length: pathCount }, (_, i) => ({
        id: i,
        d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
          380 - i * 5 * position
        } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
          152 - i * 5 * position
        } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
          684 - i * 5 * position
        } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
        width: 0.5 + i * 0.03,
      })),
    [pathCount, position]
  );

  // Phase 2 Optimization: Suspend animations when offscreen using IntersectionObserver
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
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none"
      style={{ contain: "layout style paint", transform: "translate3d(0, 0, 0)" }}
    >
      <svg
        className="w-full h-full text-foreground/70"
        viewBox="0 0 696 316"
        fill="none"
        style={{
          willChange: isInView ? "transform, opacity" : "auto",
          transform: "translate3d(0, 0, 0)",
          backfaceVisibility: "hidden",
        }}
      >
        <title>Background Paths</title>
        {/* Optimized group animation with increased visibility */}
        <motion.g
          initial={{ opacity: 0.8 }}
          animate={
            isInView
              ? {
                  opacity: [0.5, 0.8, 0.5],
                }
              : { opacity: 0.5 }
          }
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            willChange: isInView ? "opacity" : "auto",
          }}
        >
          {paths.map((path, index) => (
            <motion.path
              key={path.id}
              d={path.d}
              stroke="currentColor"
              strokeWidth={path.width}
              strokeOpacity={0.3 + path.id * 0.02}
              initial={{ pathLength: 0.3 }}
              animate={
                isInView
                  ? {
                      pathLength: 1,
                      pathOffset: [0, 1, 0],
                    }
                  : { pathLength: 1, pathOffset: 0 }
              }
              transition={{
                duration: durations[index],
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                vectorEffect: "non-scaling-stroke",
              }}
            />
          ))}
        </motion.g>
      </svg>
    </div>
  );
}

export default function BackgroundPaths() {
  return (
    <div className="absolute inset-0">
      <FloatingPaths position={1} />
      <FloatingPaths position={-1} />
    </div>
  );
}
