import { describe, it, expect } from 'vitest';
import { generateUrlEntry } from './sitemap-generator';

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
});
