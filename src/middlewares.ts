/**
 *
 * This file configures security-related HTTP headers to enhance the application's security posture.
 *
 *
 * The headers defined here are:
 * - X-Content-Type-Options: Prevents MIME-sniffing attacks.
 * - X-Frame-Options: Protects against clickjacking by disallowing the page to be rendered in iframes.
 * - Referrer-Policy: Controls how much referrer information is sent with requests.
 * - X-XSS-Protection: Enables the browser's built-in XSS filter.
 *
 * These headers are applied to incoming requests in `vite.config.ts` to ensure a secure development and production environment.
 */

export const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-XSS-Protection': '1; mode=block',
};
