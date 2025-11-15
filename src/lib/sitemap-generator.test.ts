/**
 * File overview: src/lib/sitemap-generator.test.ts
 *
 * Test suite validating the public behavior of the associated module.
 * Behavior:
 * - Focuses on observable outputs and edge cases, not implementation details.
 * Assumptions:
 * - Serves as executable documentation for how callers are expected to use the API.
 */
import { describe, it, expect } from 'vitest';
import { generateUrlEntry, generateSitemapXml, generateSitemapIndex } from './sitemap-generator';

describe('Sitemap Generator', () => {
  describe('generateUrlEntry', () => {
    it('should handle double slashes in the path', () => {
      const baseUrl = 'http://example.com';
      const route = { path: '//about' };
      const result = generateUrlEntry(baseUrl, route);
      expect(result).toContain('<loc>http://example.com/about</loc>');
    });

    it('should handle multiple slashes in the path', () => {
      const baseUrl = 'http://example.com';
      const route = { path: '///contact' };
      const result = generateUrlEntry(baseUrl, route);
      expect(result).toContain('<loc>http://example.com/contact</loc>');
    });

    it('should not corrupt the domain with double slashes', () => {
      const baseUrl = 'http://example.com/';
      const route = { path: '/services' };
      const result = generateUrlEntry(baseUrl, route);
      expect(result).toContain('<loc>http://example.com/services</loc>');
    });
  });

  describe('generateSitemapXml', () => {
    it('should generate a full sitemap with multiple routes and custom header', () => {
      const xml = generateSitemapXml({
        baseUrl: 'https://example.com',
        routes: [
          { path: '/' },
          { path: '/about', changefreq: 'monthly', priority: 0.8 },
        ],
        xmlHeader: '<?xml version="1.0"?>\n',
      });
      expect(xml.startsWith('<?xml version="1.0"?>'));
      expect(xml).toContain('<urlset');
      expect(xml).toContain('<loc>https://example.com/</loc>');
      expect(xml).toContain('<loc>https://example.com/about</loc>');
      expect(xml).toContain('<changefreq>monthly</changefreq>');
      expect(xml).toContain('<priority>0.8</priority>');
      expect(xml.endsWith('</urlset>')).toBe(true);
    });
  });

  describe('generateSitemapIndex', () => {
    it('should generate a sitemap index with lastmod entries and escaped URLs', () => {
      const index = generateSitemapIndex([
        { loc: 'https://example.com/sitemap-1.xml', lastmod: '2025-01-01' },
        { loc: 'https://example.com/sitemap-2.xml?lang=en&v=1' },
      ]);
      expect(index).toContain('<sitemapindex');
      expect(index).toContain('<loc>https://example.com/sitemap-1.xml</loc>');
      expect(index).toContain('<lastmod>2025-01-01</lastmod>');
      expect(index).toContain('sitemap-2.xml?lang=en&amp;v=1');
      expect(index.endsWith('</sitemapindex>')).toBe(true);
    });
  });
});
