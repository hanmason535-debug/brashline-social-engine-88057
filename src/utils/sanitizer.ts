/**
 *
 * This file provides a centralized HTML sanitization utility using DOMPurify.
 *
 * It configures DOMPurify with a strict set of allowed tags and attributes to prevent XSS attacks
 * while preserving essential formatting. The `sanitizeAndPreserveWhitespace` function
 * ensures that any HTML passed through it is safe to render, and it also preserves
 * whitespace for better readability of the sanitized content.
 *
 * This utility should be used whenever rendering user-generated content or any content
 * that may contain HTML from an untrusted source.
 */

import DOMPurify from 'dompurify';

const PRESERVE_WHITESPACE_CONFIG = {
  ALLOWED_TAGS: ['p', 'br', 'b', 'i', 'em', 'strong', 'a'],
  ALLOWED_ATTR: ['href', 'target', 'rel'],
  KEEP_CONTENT: true,
};

export const sanitizeAndPreserveWhitespace = (html: string): string => {
  return DOMPurify.sanitize(html, PRESERVE_WHITESPACE_CONFIG);
};
