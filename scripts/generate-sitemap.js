/**
 * File overview: scripts/generate-sitemap.js
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Sitemap generator functions
function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function generateUrlEntry(baseUrl, route) {
  const url = `${baseUrl}${route.path}`.replace(/([^:]\/)\/+/g, '$1');
  const lastmod = route.lastmod ? `    <lastmod>${route.lastmod}</lastmod>\n` : '';
  const changefreq = route.changefreq ? `    <changefreq>${route.changefreq}</changefreq>\n` : '';
  const priority = route.priority !== undefined ? `    <priority>${route.priority}</priority>\n` : '';

  return `  <url>\n    <loc>${escapeXml(url)}</loc>\n${lastmod}${changefreq}${priority}  </url>\n`;
}

function generateSitemapXml(config) {
  const xmlHeader = config.xmlHeader || '<?xml version="1.0" encoding="UTF-8"?>\n';
  
  const sitemapStart = `${xmlHeader}<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  
  const urlEntries = config.routes
    .map(route => generateUrlEntry(config.baseUrl, route))
    .join('');
  
  const sitemapEnd = '</urlset>';

  return sitemapStart + urlEntries + sitemapEnd;
}

// Route definitions - must match src/lib/sitemap-generator.ts
const APP_ROUTES = [
  {
    path: '/',
    changefreq: 'weekly',
    priority: 1.0,
  },
  {
    path: '/services',
    changefreq: 'monthly',
    priority: 0.9,
  },
  {
    path: '/pricing',
    changefreq: 'weekly',
    priority: 0.9,
  },
  {
    path: '/case-studies',
    changefreq: 'monthly',
    priority: 0.85,
  },
  {
    path: '/about',
    changefreq: 'monthly',
    priority: 0.8,
  },
  {
    path: '/blog',
    changefreq: 'weekly',
    priority: 0.8,
  },
  {
    path: '/contact',
    changefreq: 'monthly',
    priority: 0.7,
  },
  {
    path: '/terms',
    changefreq: 'yearly',
    priority: 0.5,
  },
  {
    path: '/privacy',
    changefreq: 'yearly',
    priority: 0.5,
  },
  {
    path: '/cookies',
    changefreq: 'yearly',
    priority: 0.5,
  },
  {
    path: '/accessibility',
    changefreq: 'yearly',
    priority: 0.5,
  },
];

async function generateSitemap() {
  try {
    // Determine base URL from environment or use default
    const baseUrl = process.env.VITE_SITE_URL || 'https://brashline.com';
    
    // Generate sitemap XML
    const sitemapXml = generateSitemapXml({
      baseUrl,
      routes: APP_ROUTES,
    });

    // Ensure public directory exists
    const publicDir = path.join(__dirname, '..', 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    // Write sitemap to public directory
    const sitemapPath = path.join(publicDir, 'sitemap.xml');
    fs.writeFileSync(sitemapPath, sitemapXml, 'utf-8');

    console.log(`✅ Sitemap generated successfully`);
    console.log(`   Location: ${sitemapPath}`);
    console.log(`   Base URL: ${baseUrl}`);
    console.log(`   Routes: ${APP_ROUTES.length}`);
  } catch (error) {
    console.error('❌ Failed to generate sitemap:', error);
    process.exit(1);
  }
}

generateSitemap();
