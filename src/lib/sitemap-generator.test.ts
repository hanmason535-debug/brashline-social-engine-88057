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
