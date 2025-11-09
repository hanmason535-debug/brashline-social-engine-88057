import React from "react";
import ReactDOM from "react-dom/client";
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import App from "./App.tsx";
import "./index.css";

// Initialize Sentry for error tracking and performance monitoring
const initSentry = () => {
  const DSN = import.meta.env.VITE_SENTRY_DSN || "";
  
  if (!DSN) {
    console.warn("Sentry DSN not configured. Error tracking disabled.");
    return null;
  }

  Sentry.init({
    dsn: DSN,
    environment: import.meta.env.MODE || "development",
    integrations: [
      new BrowserTracing({
        // Set sampling rate for performance monitoring
        tracePropagationTargets: ["localhost", /^\//],
        routingInstrumentation: Sentry.reactRouterV6Instrumentation(
          // avoid explicit `any` cast for linting; Sentry instrumentation expects a history-like object
          window.history as unknown as object
        ),
      }),
      new Sentry.Replay({
        maskAllText: true, // Mask sensitive data in session replay
        blockAllMedia: true,
      }),
    ],
    tracesSampleRate: import.meta.env.MODE === "production" ? 0.1 : 1.0, // 10% in prod, 100% in dev
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
};

// Initialize Sentry
initSentry();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
