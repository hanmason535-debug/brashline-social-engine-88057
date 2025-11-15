/// <reference types="vitest" />
/**
 * File overview: vite.config.ts
 *
 * Configures build-time or design-time behavior for the app.
 * Behavior:
 * - Centralizes shared configuration to keep feature code focused.
 * - Assumes consumers read these values rather than hard-coding equivalents.
 * Performance:
 * - Changes here may impact bundle size, CSS output, or tooling performance.
 */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    headers: {
      // Development CSP: permissive to allow HMR, eval, inline scripts, DevTools
      // Note: Production CSP is stricter (see vercel.json)
      "Content-Security-Policy": [
        "default-src 'self'",
        "base-uri 'self'",
        "frame-ancestors 'none'",
        "object-src 'none'",
        "form-action 'self'",
        "manifest-src 'self'",
        "worker-src 'self'",
        // Dev: allow unsafe-inline for HMR + React DevTools injection, unsafe-eval for source maps
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com data:",
        // Allow external images and data/blob URLs
        "img-src 'self' data: blob: https:",
        // Allow HMR websocket, API, and DevTools calls
        "connect-src 'self' ws: wss: http: https:"
      ].join('; '),
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@radix-ui/react-accordion', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          'animation-vendor': ['framer-motion', '@tsparticles/react', '@tsparticles/engine'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    minify: 'esbuild',
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setup.ts',
    exclude: ['**/node_modules/**', '**/dist/**', '**/e2e/**', '**/playwright-report/**', '**/test-results/**'],
    pool: 'vmThreads',
  },
}));
