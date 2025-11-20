import DOMPurify from "dompurify";

/**
 * Sanitizes HTML content using DOMPurify while preserving whitespace and safe formatting.
 *
 * @param html - Raw HTML string to sanitize
 * @returns Sanitized HTML safe for rendering
 */
export function sanitizeAndPreserveWhitespace(html: string): string {
  if (!html) return "";

  // Configure allowed tags and attributes
  const config = {
    ALLOWED_TAGS: [
      "p",
      "br",
      "strong",
      "em",
      "u",
      "i",
      "b",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "ul",
      "ol",
      "li",
      "a",
      "span",
      "div",
      "blockquote",
      "code",
      "pre",
    ],
    ALLOWED_ATTR: ["href", "title", "target", "rel", "class", "id"],
    ALLOW_DATA_ATTR: false,
    // Preserve whitespace in text nodes
    KEEP_CONTENT: true,
    // Remove script and style tags
    FORBID_TAGS: ["script", "style", "iframe", "object", "embed"],
    // Remove event handlers
    FORBID_ATTR: ["onerror", "onload", "onclick", "onmouseover"],
  };

  return DOMPurify.sanitize(html, config);
}

/**
 * Sanitizes plain text for safe display (escapes HTML entities).
 *
 * @param text - Plain text to sanitize
 * @returns Escaped text safe for rendering
 */
export function sanitizeText(text: string): string {
  if (!text) return "";

  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Sanitizes user input before submission to prevent XSS in form data.
 *
 * @param input - User input string
 * @returns Sanitized input with HTML tags stripped
 */
export function sanitizeUserInput(input: string): string {
  if (!input) return "";

  // Strip all HTML tags and return plain text
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [] });
}

/**
 * Validates and sanitizes URLs to prevent javascript: and data: URIs.
 *
 * @param url - URL to validate
 * @returns Sanitized URL or empty string if invalid
 */
export function sanitizeUrl(url: string): string {
  if (!url) return "";

  try {
    const parsed = new URL(url, window.location.origin);

    // Only allow http, https, and mailto protocols
    if (!["http:", "https:", "mailto:"].includes(parsed.protocol)) {
      return "";
    }

    return parsed.toString();
  } catch {
    // Invalid URL
    return "";
  }
}
