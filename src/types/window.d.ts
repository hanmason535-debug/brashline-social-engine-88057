/**
 * Window type extensions for third-party integrations
 */

interface Window {
  gtag?: (
    command: "config" | "event" | "js" | "set",
    targetId: string,
    config?: Record<string, unknown>
  ) => void;
  dataLayer?: Array<Record<string, unknown>>;
  Sentry?: {
    captureException: (error: Error, context?: Record<string, unknown>) => void;
  };
}

declare const window: Window & typeof globalThis;
