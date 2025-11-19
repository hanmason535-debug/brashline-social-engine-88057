/**
 * File overview: src/main.tsx
 *
 * General TypeScript module supporting the application.
 * Behavior:
 * - Encapsulates a small, well-defined responsibility within the codebase.
 * Assumptions:
 * - Callers rely on the exported surface; internal details may evolve over time.
 * Performance:
 * - Keep logic straightforward and avoid hidden global side effects.
 */
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";
import { logSEOAudit } from "@/utils/seo";
import { SpeedInsights } from "@vercel/speed-insights/react";

// Log SEO audit reminder in dev mode
logSEOAudit();

// Register service worker for offline functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('SW registered:', registration);
      })
      .catch((error) => {
        console.log('SW registration failed:', error);
      });
  });
}

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
    <SpeedInsights />
  </HelmetProvider>
);
