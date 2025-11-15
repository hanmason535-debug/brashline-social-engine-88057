/**
 * File overview: src/lib/utils.test.ts
 *
 * Test suite validating the public behavior of the associated module.
 * Behavior:
 * - Focuses on observable outputs and edge cases, not implementation details.
 * Assumptions:
 * - Serves as executable documentation for how callers are expected to use the API.
 */
import { describe, it, expect } from 'vitest';
import { cn, generateSrcSet, generateSizesAttribute } from './utils';

describe('Utils', () => {
  describe('cn', () => {
    it('should merge class names correctly', () => {
      expect(cn('px-4', 'py-2')).toBe('px-4 py-2');
    });

    it('should handle conditional classes', () => {
      const condition = false;
      expect(cn('px-4', condition && 'py-2', 'text-sm')).toBe('px-4 text-sm');
    });

    it('should merge tailwind classes correctly', () => {
      // twMerge should deduplicate conflicting classes
      expect(cn('px-4 px-2')).toBe('px-2');
    });
  });

  describe('generateSrcSet', () => {
    it('should generate a valid srcset string for webp format', () => {
      const srcSet = generateSrcSet('image', [100, 200, 300], 'webp');
      expect(srcSet).toBe(
        '/images/image-100w.webp 100w, /images/image-200w.webp 200w, /images/image-300w.webp 300w'
      );
    });

    it('should generate a valid srcset string for png format', () => {
      const srcSet = generateSrcSet('image', [150, 300], 'png');
      expect(srcSet).toBe('/images/image-150w.png 150w, /images/image-300w.png 300w');
    });

    it('should handle an empty sizes array', () => {
      const srcSet = generateSrcSet('image', [], 'webp');
      expect(srcSet).toBe('');
    });

    it('should default to webp format', () => {
      const srcSet = generateSrcSet('logo', [40, 80]);
      expect(srcSet).toContain('.webp');
    });
  });

  describe('generateSizesAttribute', () => {
    it('should generate a valid sizes attribute string for multiple sizes', () => {
      const sizes = generateSizesAttribute([320, 640, 1024]);
      // Current implementation uses 640px breakpoint, middle size, and max size
      expect(sizes).toBe('(max-width: 640px) 320px, (max-width: 1024px) 640px, 1024px');
    });

    it('should handle a single size', () => {
      const sizes = generateSizesAttribute([500]);
      expect(sizes).toBe('500px');
    });

    it('should handle an empty sizes array', () => {
      const sizes = generateSizesAttribute([]);
      expect(sizes).toBe('100vw');
    });

    it('should sort sizes correctly', () => {
      // Should work even if input isn't sorted
      const sizes = generateSizesAttribute([1024, 320, 640]);
      expect(sizes).toContain('320px');
      expect(sizes).toContain('640px');
      expect(sizes).toContain('1024px');
    });

    it('should handle a two-item array correctly', () => {
      // Regression test: two-item arrays should generate one media query
      // Bug: Previous implementation generated three queries even for two sizes
      const sizes = generateSizesAttribute([300, 800]);
      expect(sizes).toBe('(max-width: 640px) 300px, 800px');
    });
  });
});
