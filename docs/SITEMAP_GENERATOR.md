# Sitemap Generator Documentation

## Overview

The sitemap generator automatically creates XML sitemaps from your route definitions for better SEO indexing by search engines. It runs during the build process and ensures your sitemap is always up-to-date with your application routes.

## Features

- ✅ **Automatic Generation** - Generates `sitemap.xml` during build process
- ✅ **Route-Based** - Automatically discovers routes from `APP_ROUTES` definition
- ✅ **SEO Metadata** - Includes priority, change frequency, and last modified dates
- ✅ **Multi-Language Ready** - Can be extended for alternate language variants
- ✅ **Zero Configuration** - Works out of the box with sensible defaults
- ✅ **Environment Support** - Configurable base URL via `VITE_SITE_URL`

## How It Works

### 1. Route Definition

All application routes are defined in `src/lib/sitemap-generator.ts` in the `APP_ROUTES` array:

```typescript
export const APP_ROUTES: SitemapRoute[] = [
  {
    path: '/',
    changefreq: 'weekly',
    priority: 1.0,
  },
  {
    path: '/about',
    changefreq: 'monthly',
    priority: 0.8,
  },
  // ... more routes
];
```

### 2. Build Process

When you run `npm run build`, the process:

1. Executes `scripts/generate-sitemap.js`
2. Reads all routes from `APP_ROUTES`
3. Generates XML sitemap content
4. Writes to `/public/sitemap.xml`
5. Proceeds with Vite build

```bash
$ npm run build
✅ Sitemap generated successfully
   Location: ./public/sitemap.xml
   Base URL: https://brashline.io
   Routes: 11
vite v6.1.7 building for production...
```

### 3. Generated Sitemap

The resulting `public/sitemap.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://brashline.io/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://brashline.io/about</loc>
    <lastmod>2025-11-11</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <!-- ... more URLs ... -->
</urlset>
```

## Configuration

### Base URL

Set the `VITE_SITE_URL` environment variable to control the base URL:

```bash
# .env
VITE_SITE_URL=https://brashline.io

# .env.production
VITE_SITE_URL=https://brashline.io

# .env.staging
VITE_SITE_URL=https://staging.brashline.io
```

**Default:** `https://brashline.io`

### Adding New Routes

When you add a new route:

1. Add the component import in `src/App.tsx`
2. Add the route definition in `App.tsx` Routes section
3. Add the route to `APP_ROUTES` in `src/lib/sitemap-generator.ts` with SEO metadata

Example:

```typescript
// src/App.tsx
const Portfolio = lazy(() => import("./pages/Portfolio"));

// In Routes:
<Route path="/portfolio" element={<Portfolio />} />

// src/lib/sitemap-generator.ts
{
  path: '/portfolio',
  changefreq: 'monthly',
  priority: 0.85,
},
```

### Priority Levels

Use these priority guidelines:

- **1.0** - Homepage, critical pages (Services, Pricing)
- **0.9** - Primary content pages
- **0.85** - Secondary content (Case Studies)
- **0.8** - Content pages (About, Blog)
- **0.7** - Utility pages (Contact)
- **0.5** - Legal/footer pages (Terms, Privacy, Cookies, Accessibility)

### Change Frequency

Guide search engines on how often to crawl each page:

- **always** - Pages that change every time
- **hourly** - Dynamic pages (blogs)
- **daily** - Regularly updated content
- **weekly** - Content that changes weekly
- **monthly** - Infrequently changing content
- **yearly** - Static pages (legal)
- **never** - Archived/outdated content

## Usage

### Building with Sitemap

```bash
# Automatically generates sitemap before building
npm run build

# Development (no sitemap generation)
npm dev

# Build without sitemap (if needed)
npx vite build
```

### Viewing Routes

Use the `SitemapDisplay` component to see all routes and metadata:

```tsx
import { SitemapDisplay } from '@/components/sitemap-display';

export function DebugPage() {
  return <SitemapDisplay />;
}
```

### Programmatic Sitemap Generation

```typescript
import { generateSitemapXml, APP_ROUTES } from '@/lib/sitemap-generator';

const xml = generateSitemapXml({
  baseUrl: 'https://brashline.io',
  routes: APP_ROUTES,
});

console.log(xml);
```

## SEO Best Practices

### robots.txt Configuration

Ensure your `public/robots.txt` references the sitemap:

```robots
User-agent: *
Allow: /

Sitemap: https://brashline.io/sitemap.xml
```

### Submit to Search Engines

1. **Google Search Console** - Submit sitemap URL
2. **Bing Webmaster Tools** - Submit sitemap URL
3. **Yandex** - Submit sitemap URL

### Canonical Tags

For pages with multiple URLs (e.g., with/without trailing slash), add canonical tags:

```tsx
<head>
  <link rel="canonical" href="https://brashline.io/about" />
</head>
```

### Structured Data

Consider adding schema.org structured data to pages:

```tsx
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Brashline",
  "url": "https://brashline.io"
}
</script>
```

## File Structure

```
src/
├── lib/
│   └── sitemap-generator.ts       # Core sitemap generation logic
├── components/
│   └── sitemap-display.tsx        # Debug component
scripts/
├── generate-sitemap.js             # Build script
public/
├── sitemap.xml                    # Generated sitemap (auto-created)
├── robots.txt                     # Robots configuration
```

## Troubleshooting

### Sitemap Not Generated

**Problem:** Build completes but no `sitemap.xml` in dist/

**Solution:** Check `public/` folder (before Vite copies assets). The file should be copied automatically during build.

### Base URL Not Used Correctly

**Problem:** Sitemap has wrong domain

**Solution:** Ensure `VITE_SITE_URL` is set in your `.env` file

```bash
VITE_SITE_URL=https://your-domain.com
```

### Routes Missing from Sitemap

**Problem:** New route not in sitemap

**Solution:** Add route to `APP_ROUTES` in `src/lib/sitemap-generator.ts`

```typescript
{
  path: '/new-route',
  changefreq: 'weekly',
  priority: 0.8,
},
```

## Performance Impact

- **Build Time:** +100-200ms (minimal)
- **Sitemap Size:** ~2-5KB for typical site (scales with route count)
- **No Runtime Impact:** Sitemap is static, generated at build time

## Future Enhancements

Potential improvements:

- [ ] Automatic lastmod date tracking
- [ ] Blog post/case study dynamic routes
- [ ] Sitemap index for large sites (>50K URLs)
- [ ] Multi-language alternate URLs
- [ ] Dynamic route discovery from React Router
- [ ] Video/image sitemap support
- [ ] News sitemap support

## Related Files

- `src/lib/sitemap-generator.ts` - Core utilities
- `scripts/generate-sitemap.js` - Build script
- `package.json` - Updated build script
- `src/components/sitemap-display.tsx` - Debug component
- `.env.example` - Configuration example
