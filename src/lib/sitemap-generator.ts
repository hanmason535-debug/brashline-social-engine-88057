/**
 * Sitemap Generator Utility
 * Automatically generates XML sitemaps from route definitions
 * for better SEO indexing by search engines
 */
/**
 * File overview: src/lib/sitemap-generator.ts
 *
 * Library / utility helpers shared across the app.
 * Behavior:
 * - Provides pure or side-effect-aware functions with clear, reusable contracts.
 * Assumptions:
 * - Callers respect input contracts and handle error cases where documented.
 * Performance:
 * - Keep helpers small and composable to avoid hidden complexity in call sites.
 */

export interface SitemapRoute {
  path: string;
  /** Last modification date (ISO 8601 format) */
  lastmod?: string;
  /** Change frequency: always, hourly, daily, weekly, monthly, yearly, never */
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  /** Priority: 0.0 to 1.0 (default 0.5) */
  priority?: number;
}

export interface SitemapConfig {
  baseUrl: string;
  routes: SitemapRoute[];
  /** Custom XML header, defaults to standard XML 1.0 declaration */
  xmlHeader?: string;
}

/**
 * Escapes special XML characters in URL strings
 */
function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Generates URL entry XML for a single route
 */
export function generateUrlEntry(baseUrl: string, route: SitemapRoute): string {
  // Sanitize path to remove any duplicate slashes, which can cause issues with URL construction
  const sanitizedPath = route.path.replace(/\/+/g, "/");
  const url = new URL(sanitizedPath, baseUrl).toString();

  const lastmod = route.lastmod ? `    <lastmod>${route.lastmod}</lastmod>\n` : "";
  const changefreq = route.changefreq ? `    <changefreq>${route.changefreq}</changefreq>\n` : "";
  const priority =
    route.priority !== undefined ? `    <priority>${route.priority}</priority>\n` : "";

  return `  <url>\n    <loc>${escapeXml(url)}</loc>\n${lastmod}${changefreq}${priority}  </url>\n`;
}

/**
 * Generates complete XML sitemap content
 */
export function generateSitemapXml(config: SitemapConfig): string {
  const xmlHeader = config.xmlHeader || '<?xml version="1.0" encoding="UTF-8"?>\n';

  const sitemapStart = `${xmlHeader}<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  const urlEntries = config.routes.map((route) => generateUrlEntry(config.baseUrl, route)).join("");

  const sitemapEnd = "</urlset>";

  return sitemapStart + urlEntries + sitemapEnd;
}

/**
 * Generates a sitemap index XML (for when you have multiple sitemaps)
 */
export function generateSitemapIndex(sitemaps: Array<{ loc: string; lastmod?: string }>): string {
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n';
  const indexStart = `${xmlHeader}<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  const sitemapEntries = sitemaps
    .map((sitemap) => {
      const lastmod = sitemap.lastmod ? `    <lastmod>${sitemap.lastmod}</lastmod>\n` : "";
      return `  <sitemap>\n    <loc>${escapeXml(sitemap.loc)}</loc>\n${lastmod}  </sitemap>\n`;
    })
    .join("");

  const indexEnd = "</sitemapindex>";

  return indexStart + sitemapEntries + indexEnd;
}

import APP_ROUTES_DATA from "@/data/routes.json";

/**
 * Defines all public application routes with SEO metadata
 * This is the source of truth for sitemap generation
 */
export const APP_ROUTES: SitemapRoute[] = APP_ROUTES_DATA;
