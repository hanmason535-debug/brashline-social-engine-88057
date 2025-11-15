/**
 *
 * This file contains unit tests for the HTML sanitization utility.
 *
 * It verifies that the `sanitizeAndPreserveWhitespace` function correctly removes
 * potentially malicious content while preserving allowed HTML tags and attributes.
 *
 * The tests cover the following scenarios:
 * - Removal of script tags
 * - Preservation of allowed tags (p, b, i, a)
 * - Removal of disallowed tags (div, img)
 * - Preservation of allowed attributes (href)
 * - Removal of disallowed attributes (onclick)
 */

import { describe, it, expect } from 'vitest';
import { sanitizeAndPreserveWhitespace } from './sanitizer';

describe('sanitizeAndPreserveWhitespace', () => {
  it('should remove script tags', () => {
    const dirty = '<p>Hello <script>alert("xss")</script> World</p>';
    const clean = '<p>Hello  World</p>';
    expect(sanitizeAndPreserveWhitespace(dirty)).toBe(clean);
  });

  it('should preserve allowed tags', () => {
    const dirty = '<p><b>Bold</b> <i>Italic</i> <a>Link</a></p>';
    const clean = '<p><b>Bold</b> <i>Italic</i> <a>Link</a></p>';
    expect(sanitizeAndPreserveWhitespace(dirty)).toBe(clean);
  });

  it('should remove disallowed tags', () => {
    const dirty = '<div><p>Allowed</p><img src="x" /></div>';
    const clean = '<p>Allowed</p>';
    expect(sanitizeAndPreserveWhitespace(dirty)).toBe(clean);
  });

  it('should preserve allowed attributes', () => {
    const dirty = '<a href="/path" target="_blank" rel="noopener">Link</a>';
    const clean = '<a href="/path" target="_blank" rel="noopener">Link</a>';
    expect(sanitizeAndPreserveWhitespace(dirty)).toBe(clean);
  });

  it('should remove disallowed attributes', () => {
    const dirty = '<p onclick="alert(\'xss\')">Click me</p>';
    const clean = '<p>Click me</p>';
    expect(sanitizeAndPreserveWhitespace(dirty)).toBe(clean);
  });
});
