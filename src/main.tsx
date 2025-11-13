import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { logSEOAudit } from "@/utils/seo";

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

createRoot(document.getElementById("root")!).render(<App />);
