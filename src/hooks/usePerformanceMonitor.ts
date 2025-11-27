/**
 * Performance Monitoring Hook
 * Tracks component render times and provides optimization insights
 */

import { useEffect, useRef } from "react";

interface PerformanceMetrics {
  renderCount: number;
  lastRenderTime: number;
  avgRenderTime: number;
}

export function usePerformanceMonitor(componentName: string, enabled = import.meta.env.DEV) {
  const metricsRef = useRef<PerformanceMetrics>({
    renderCount: 0,
    lastRenderTime: 0,
    avgRenderTime: 0,
  });

  const renderStartRef = useRef<number>(0);

  // Mark render start
  renderStartRef.current = performance.now();

  useEffect(() => {
    if (!enabled) return;

    // Calculate render time
    const renderEnd = performance.now();
    const renderTime = renderEnd - renderStartRef.current;

    // Update metrics
    metricsRef.current.renderCount++;
    metricsRef.current.lastRenderTime = renderTime;
    metricsRef.current.avgRenderTime =
      (metricsRef.current.avgRenderTime * (metricsRef.current.renderCount - 1) + renderTime) /
      metricsRef.current.renderCount;

    // Warn if render is slow
    if (renderTime > 16.67) {
      console.warn(
        `[Performance] ${componentName} render took ${renderTime.toFixed(2)}ms (>16.67ms budget)`,
        {
          renderCount: metricsRef.current.renderCount,
          avgRenderTime: metricsRef.current.avgRenderTime.toFixed(2),
        }
      );
    }
  });

  return metricsRef.current;
}

/**
 * Log Web Vitals
 */
export function useWebVitals() {
  useEffect(() => {
    if (!import.meta.env.DEV) return;

    // Log performance metrics on page load
    window.addEventListener("load", () => {
      const perfData = window.performance.timing;
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
      const domContentLoaded = perfData.domContentLoadedEventEnd - perfData.navigationStart;
      const firstPaint = performance.getEntriesByType("paint")[0]?.startTime || 0;

      console.log("[Web Vitals]", {
        pageLoadTime: `${pageLoadTime}ms`,
        domContentLoaded: `${domContentLoaded}ms`,
        firstPaint: `${firstPaint.toFixed(2)}ms`,
      });
    });
  }, []);
}
