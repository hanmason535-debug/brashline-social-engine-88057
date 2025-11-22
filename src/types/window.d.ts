/**
 * Window type extensions for third-party integrations
 */

interface Window {
  gtag?: (
    command: "config" | "event" | "js" | "set",
    targetId: string,
    config?: Record<string, any>
  ) => void;
  dataLayer?: Array<any>;
  Sentry?: {
    captureException: (error: Error, context?: Record<string, any>) => void;
  };
}

declare const window: Window & typeof globalThis;
