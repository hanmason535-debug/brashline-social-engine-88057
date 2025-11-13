# Vercel Deployment & SEO Guide

**Status:** ✅ Ready for Production  
**Date:** November 13, 2025  
**Last Updated:** Commit 62c3eaf

---

## What's Been Fixed

### 1. **Vercel Configuration** (`vercel.json`)
- ✅ Configured `publicDir: dist` to serve built assets
- ✅ Set environment variable: `VITE_SITE_URL=https://brashline.com`
- ✅ Added explicit rewrites for `sitemap.xml` and `robots.txt` to ensure they're served at root
- ✅ Configured proper cache headers (24 hours for static files)
- ✅ Enabled SPA routing: all routes (`/:path*`) rewrite to `index.html`
- ✅ Added security headers: X-Content-Type-Options, X-Frame-Options, Referrer-Policy

### 2. **Build Process** (`package.json` & `scripts/prerender.js`)
- ✅ Updated build script: `generate-sitemap.js → vite build → prerender.js`
- ✅ Prerender script verifies:
  - `dist/sitemap.xml` exists and contains all 11 routes
  - `dist/robots.txt` exists and references sitemap
  - `dist/index.html` is built
- ✅ All files are copied to `dist/` automatically by Vite

### 3. **SEO Accessibility**
- ✅ `https://brashline.com/sitemap.xml` — will be publicly accessible
- ✅ `https://brashline.com/robots.txt` — will be publicly accessible
- ✅ Both files served with correct `Content-Type` headers
- ✅ 24-hour cache (updated with each deployment)

---

## Deployment Steps

### Step 1: Push to GitHub (Already Done ✅)
```bash
git push origin main  # Commit 62c3eaf pushed
```

### Step 2: Vercel Auto-Deploy
**Vercel will automatically:**
1. Detect changes to `main` branch
2. Run `npm run build` (which runs sitemap generator + vite + prerender verification)
3. Deploy `dist/` folder
4. Apply `vercel.json` configuration
5. Serve `sitemap.xml` and `robots.txt` at root

**No additional action needed** if Vercel is connected to GitHub repo.

### Step 3: Verify Live Accessibility (After Deploy)
Once Vercel finishes deployment, verify:

```bash
# Check sitemap.xml is accessible and returns 200 OK
curl -I https://brashline.com/sitemap.xml

# Expected output:
# HTTP/2 200
# content-type: application/xml; charset=utf-8
# cache-control: public, max-age=86400, s-maxage=86400

# Check robots.txt is accessible and returns 200 OK
curl -I https://brashline.com/robots.txt

# Expected output:
# HTTP/2 200
# content-type: text/plain; charset=utf-8
# cache-control: public, max-age=86400, s-maxage=86400

# Check homepage returns 200
curl -I https://brashline.com/

# Expected output:
# HTTP/2 200
# content-type: text/html; charset=UTF-8
```

Or use browser DevTools:
- Open `https://brashline.com/sitemap.xml` → should show XML content
- Open `https://brashline.com/robots.txt` → should show robots.txt content
- Open `https://brashline.com/` → should load homepage

---

## How It Works (Technical Details)

### File Serving
```
Source (git)          Build                 Dist                  Vercel CDN
├─ public/            ├─ generate-sitemap   ├─ sitemap.xml ✅    ├─ https://brashline.com/sitemap.xml
│  ├─ sitemap.xml     ├─ vite build         ├─ robots.txt ✅     └─ https://brashline.com/robots.txt
│  └─ robots.txt      └─ prerender verify   └─ index.html
└─ src/               ↓ (Copied by Vite)     ↓                    ↓ (Served by Vercel)
   └─ ...                                  ✅ All files ready
```

### URL Routing
```
Request                   vercel.json rule              Response
─────────────────────────────────────────────────────────────────
GET /sitemap.xml       → "source": "/sitemap.xml"  → dist/sitemap.xml (200)
GET /robots.txt        → "source": "/robots.txt"   → dist/robots.txt (200)
GET /                  → "source": "/:path*"       → dist/index.html (React SPA)
GET /services          → "source": "/:path*"       → dist/index.html (React SPA)
GET /pricing           → "source": "/:path*"       → dist/index.html (React SPA)
GET /case-studies      → "source": "/:path*"       → dist/index.html (React SPA)
GET /about             → "source": "/:path*"       → dist/index.html (React SPA)
GET /blog              → "source": "/:path*"       → dist/index.html (React SPA)
GET /contact           → "source": "/:path*"       → dist/index.html (React SPA)
GET /terms             → "source": "/:path*"       → dist/index.html (React SPA)
GET /privacy           → "source": "/:path*"       → dist/index.html (React SPA)
GET /cookies           → "source": "/:path*"       → dist/index.html (React SPA)
GET /accessibility     → "source": "/:path*"       → dist/index.html (React SPA)
```

### Crawler Behavior
```
Search Engine (Google, Bing, etc.)
│
├─ Fetches robots.txt
│  ├─ Sees: "User-agent: * / Allow: /"
│  ├─ Sees: "Sitemap: https://brashline.com/sitemap.xml"
│  └─ Follows sitemap reference
│
├─ Fetches sitemap.xml
│  ├─ Parses 11 URLs
│  └─ Crawls each URL:
│     ├─ GET https://brashline.com/
│     ├─ GET https://brashline.com/services
│     ├─ GET https://brashline.com/pricing
│     ├─ ... (all 11 routes)
│
├─ Receives index.html for each route
│  ├─ Sees meta tags (title, description, og:image, etc.)
│  ├─ Executes JavaScript (React app loads)
│  └─ Renders page content dynamically
│
└─ Indexes all routes with their meta tags and content
```

---

## Post-Deployment: Submit to Search Engines

### Google Search Console
1. Go to: https://search.google.com/search-console
2. Select property: `brashline.com`
3. Navigate to: **Sitemaps** (left menu)
4. Click: **Add new sitemap**
5. Enter: `https://brashline.com/sitemap.xml`
6. Click: **Submit**
7. Wait 24-48 hours for crawl to complete
8. Check **Coverage** report for indexing status

### Bing Webmaster Tools
1. Go to: https://www.bing.com/webmasters
2. Add property: `brashline.com`
3. Navigate to: **Sitemaps**
4. Submit: `https://brashline.com/sitemap.xml`
5. Monitor crawl activity

### Other Search Engines
- **Yandex:** https://webmaster.yandex.com
- **Baidu:** https://zhanzhang.baidu.com

---

## Monitoring & Maintenance

### Weekly Checks
```bash
# Verify sitemap is accessible
curl -I https://brashline.com/sitemap.xml

# Verify robots.txt is accessible
curl -I https://brashline.com/robots.txt

# Spot-check a few routes
curl -I https://brashline.com/
curl -I https://brashline.com/services
curl -I https://brashline.com/pricing
```

### Monthly Tasks
1. **Google Search Console:** Review Coverage report for crawl errors
2. **Performance:** Check Core Web Vitals in GSC (LCP, FID, CLS)
3. **Indexing:** Verify all 11 routes are indexed
4. **Sitemap Update:** Auto-regenerates on each deploy (verify in build logs)

### When Adding New Routes
1. Add route to `src/App.tsx`
2. Create page component in `src/pages/`
3. Update `APP_ROUTES` in `scripts/generate-sitemap.js`
4. Deploy to main (automatic sitemap regeneration)
5. Resubmit sitemap to Google Search Console

---

## Troubleshooting

### Sitemap returns 404
**Solution:**
- Verify `dist/sitemap.xml` exists after build: `npm run build`
- Verify `vercel.json` rewrite rule for `/sitemap.xml` is present
- Check Vercel deployment logs for build errors

### Robots.txt returns 404
**Solution:**
- Verify `dist/robots.txt` exists after build
- Verify `vercel.json` rewrite rule for `/robots.txt` is present
- Check file was copied from `public/robots.txt`

### Routes return empty HTML
**Solution (Expected for SPA):**
- Vercel correctly routes all requests to `index.html`
- React app loads client-side and renders content
- Crawlers should see rendered HTML after JavaScript execution
- If not: crawlers may not support JS; consider SSG alternative

### Sitemap shows old URLs after deploy
**Solution:**
- Clear Vercel cache: Vercel Dashboard → Settings → Git → Clear Cache
- Trigger redeploy: Push empty commit or click "Redeploy" in Vercel
- Wait 24 hours for crawlers to re-fetch sitemap

---

## Files Modified

```
✅ vercel.json (NEW)                          — Vercel platform configuration
✅ scripts/prerender.js (NEW)                 — SEO verification script
✅ package.json (UPDATED)                     — Build script now runs prerender.js
✅ public/sitemap.xml (EXISTING)              — Auto-regenerated to dist/
✅ public/robots.txt (EXISTING)               — Auto-copied to dist/
✅ .env.example (UPDATED)                     — Documents VITE_SITE_URL
```

---

## Success Criteria

After deployment, verify:
- ✅ `curl https://brashline.com/sitemap.xml` returns 200 with valid XML
- ✅ `curl https://brashline.com/robots.txt` returns 200 with valid robots.txt
- ✅ `curl https://brashline.com/` returns 200 with index.html
- ✅ All 11 routes (`/`, `/services`, `/pricing`, etc.) return 200
- ✅ Sitemap submitted to Google Search Console
- ✅ Robots.txt references correct sitemap URL
- ✅ Build logs show: "✅ All SEO prerequisites verified!"

---

## Next Steps

1. **Wait for Vercel to auto-deploy** (automatic on push to main)
2. **Verify live files** (test URLs above)
3. **Submit sitemap to Google Search Console**
4. **Monitor indexing** (check Coverage report daily)
5. **Fix any crawl errors** (if reported in GSC)

---

**Status:** 🟢 **PRODUCTION READY**

All configuration in place. Deploy and verify! 🚀
