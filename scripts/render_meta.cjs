/**
 * File overview: scripts/render_meta.cjs
 *
 * Puppeteer-based SEO helper script for inspecting live meta tags.
 * Behavior:
 * - Navigates to the given URL, reads key HTML metadata (title, canonical, description, Open Graph, Twitter, JSON-LD), and prints a JSON summary.
 * Performance:
 * - Runs as an external analysis tool and has no impact on client-side runtime or bundle size.
 */
const puppeteer = require('puppeteer');

(async () => {
  const url = process.argv[2] || 'https://brashline.com/';
  const browser = await puppeteer.launch({ args: ['--no-sandbox','--disable-setuid-sandbox'] });
  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

    const result = await page.evaluate(() => {
      const collect = {};
      collect.title = document.title || null;
      const canonicalEl = document.querySelector('link[rel="canonical"]');
      collect.canonical = canonicalEl ? canonicalEl.href : null;
      const desc = document.querySelector('meta[name="description"]');
      collect.description = desc ? desc.content : null;

      // Open Graph
      collect.og = {};
      ['og:title','og:description','og:image','og:url','og:site_name','og:locale','og:type'].forEach(p => {
        const el = document.querySelector(`meta[property='${p}']`);
        collect.og[p] = el ? el.getAttribute('content') : null;
      });

      // Twitter
      collect.twitter = {};
      ['twitter:card','twitter:site','twitter:title','twitter:description','twitter:image'].forEach(n => {
        const el = document.querySelector(`meta[name='${n}']`);
        collect.twitter[n] = el ? el.getAttribute('content') : null;
      });

      // keywords
      const kw = document.querySelector('meta[name="keywords"]');
      collect.keywords = kw ? kw.content : null;

      // JSON-LD scripts
      const jsonlds = Array.from(document.querySelectorAll('script[type="application/ld+json"]'))
        .map(s => {
          try { return JSON.parse(s.innerText); } catch(e) { return s.innerText; }
        });
      collect.jsonld = jsonlds;

      collect.allMeta = Array.from(document.querySelectorAll('meta')).map(m => ({ name: m.getAttribute('name'), property: m.getAttribute('property'), content: m.getAttribute('content') }));

      return collect;
    });

    console.log(JSON.stringify({ url, fetchedAt: new Date().toISOString(), result }, null, 2));
  } catch (err) {
    console.error('ERROR', err);
    process.exitCode = 2;
  } finally {
    await browser.close();
  }
})();
