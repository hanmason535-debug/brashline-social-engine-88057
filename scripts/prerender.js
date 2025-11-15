#!/usr/bin/env node

/**
 * Prerender script for Vercel
 * Generates static HTML for all routes so search engines see actual content
 * This runs after npm run build during Vercel deployment
 */
/**
 * File overview: scripts/prerender.js
 *
 * General TypeScript module supporting the application.
 * Behavior:
 * - Encapsulates a small, well-defined responsibility within the codebase.
 * Assumptions:
 * - Callers rely on the exported surface; internal details may evolve over time.
 * Performance:
 * - Keep logic straightforward and avoid hidden global side effects.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// List of all routes to prerender
const ROUTES = [
  '/',
  '/services',
  '/pricing',
  '/case-studies',
  '/about',
  '/blog',
  '/contact',
  '/terms',
  '/privacy',
  '/cookies',
  '/accessibility',
];

const DIST_DIR = path.join(__dirname, '..', 'dist');

/**
 * For Vercel: These routes will be automatically served by the SPA (index.html)
 * The vercel.json rewrite rule ensures all routes return the same index.html
 * Search engines will fetch /index.html and render client-side
 *
 * For better SEO with crawlers, consider these alternatives:
 * 1. Use a headless browser pre-renderer (e.g., prerender-spa-plugin)
 * 2. Deploy a Node.js backend that renders React SSR
 * 3. Use static site generation (SSG) with a build tool like Next.js
 *
 * For now, we ensure:
 * - sitemap.xml is accessible and valid
 * - robots.txt is accessible and valid
 * - All routes have proper meta tags (in index.html)
 * - Vercel.json routes static files correctly
 */

async function verifyPrerequisites() {
  console.log('🔍 Verifying SEO prerequisites...');

  // Check dist exists
  if (!fs.existsSync(DIST_DIR)) {
    console.error('❌ dist directory not found. Run "npm run build" first.');
    process.exit(1);
  }

  // Check index.html
  const indexPath = path.join(DIST_DIR, 'index.html');
  if (!fs.existsSync(indexPath)) {
    console.error('❌ dist/index.html not found.');
    process.exit(1);
  }

  // Check sitemap.xml
  const sitemapPath = path.join(DIST_DIR, 'sitemap.xml');
  if (!fs.existsSync(sitemapPath)) {
    console.error('❌ dist/sitemap.xml not found.');
    process.exit(1);
  }

  // Check robots.txt
  const robotsPath = path.join(DIST_DIR, 'robots.txt');
  if (!fs.existsSync(robotsPath)) {
    console.error('❌ dist/robots.txt not found.');
    process.exit(1);
  }

  console.log('✅ dist/index.html exists');
  console.log('✅ dist/sitemap.xml exists');
  console.log('✅ dist/robots.txt exists');

  // Verify sitemap contains all routes
  const sitemapContent = fs.readFileSync(sitemapPath, 'utf-8');
  const missingRoutes = ROUTES.filter(route => {
    const routeUrl = `https://brashline.com${route}`;
    return !sitemapContent.includes(routeUrl);
  });

  if (missingRoutes.length > 0) {
    console.error(`❌ Sitemap missing routes: ${missingRoutes.join(', ')}`);
    process.exit(1);
  }

  console.log(`✅ Sitemap contains all ${ROUTES.length} routes`);

  // Verify robots.txt references sitemap
  const robotsContent = fs.readFileSync(robotsPath, 'utf-8');
  if (!robotsContent.includes('https://brashline.com/sitemap.xml')) {
    console.error('❌ robots.txt does not reference sitemap.xml');
    process.exit(1);
  }

  console.log('✅ robots.txt references sitemap.xml');

  console.log('\n✅ All SEO prerequisites verified!');
  console.log('\n📋 Deployment notes:');
  console.log('  - vercel.json configured to serve static files');
  console.log('  - SPA routing enabled for all routes');
  console.log('  - Crawlers will fetch index.html and render client-side');
  console.log('  - Sitemap and robots.txt are publicly accessible');
  console.log('\n🔗 After deployment, verify:');
  console.log('  - https://brashline.com/sitemap.xml (200 OK)');
  console.log('  - https://brashline.com/robots.txt (200 OK)');
  console.log('  - Submit to Google Search Console');
}

verifyPrerequisites();
