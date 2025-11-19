# Security Implementation

This document outlines the security measures implemented in the Brashline application to protect against common web vulnerabilities.

## Overview

The security implementation includes:
- **HTML Sanitization** with DOMPurify to prevent XSS attacks
- **Content Security Policy (CSP)** headers to restrict resource loading
- **Google Tag Manager (GTM)** integration with CSP compatibility
- **Input validation** and sanitization for user-submitted data
- **Security headers** to prevent common attacks

## HTML Sanitization

### DOMPurify Integration

Located in `src/utils/sanitizer.ts`, provides multiple sanitization functions:

#### `sanitizeAndPreserveWhitespace(html: string): string`

Sanitizes HTML content while preserving safe formatting tags.

**Allowed Tags:**
- Text formatting: `p`, `br`, `strong`, `em`, `u`, `i`, `b`
- Headings: `h1`, `h2`, `h3`, `h4`, `h5`, `h6`
- Lists: `ul`, `ol`, `li`
- Links and containers: `a`, `span`, `div`
- Code: `blockquote`, `code`, `pre`

**Allowed Attributes:**
- `href`, `title`, `target`, `rel` (for links)
- `class`, `id` (for styling)

**Forbidden:**
- Script tags: `<script>`, `<style>`
- Embedded content: `<iframe>`, `<object>`, `<embed>`
- Event handlers: `onclick`, `onerror`, `onload`, `onmouseover`

**Usage:**
```tsx
import { sanitizeAndPreserveWhitespace } from '@/utils/sanitizer';

// Render user-generated HTML safely
<div dangerouslySetInnerHTML={{ __html: sanitizeAndPreserveWhitespace(userContent) }} />
```

#### `sanitizeText(text: string): string`

Escapes HTML entities in plain text to prevent injection.

**Usage:**
```tsx
import { sanitizeText } from '@/utils/sanitizer';

const safeText = sanitizeText(userInput);
```

#### `sanitizeUserInput(input: string): string`

Strips all HTML tags from user input, returning plain text only.

**Usage:**
```tsx
import { sanitizeUserInput } from '@/utils/sanitizer';

// Before submitting form data
const cleanInput = sanitizeUserInput(formData.message);
```

#### `sanitizeUrl(url: string): string`

Validates and sanitizes URLs to prevent `javascript:` and `data:` URIs.

**Allowed Protocols:**
- `http:`
- `https:`
- `mailto:`

**Usage:**
```tsx
import { sanitizeUrl } from '@/utils/sanitizer';

const safeUrl = sanitizeUrl(userProvidedUrl);
if (safeUrl) {
  window.open(safeUrl);
}
```

## Content Security Policy (CSP)

### Production CSP (vercel.json)

Configured in `vercel.json` with strict directives:

```
default-src 'self'
base-uri 'self'
frame-ancestors 'none'
object-src 'none'
form-action 'self'
manifest-src 'self'
worker-src 'self'
upgrade-insecure-requests
script-src 'self' 'unsafe-inline' https://www.googletagmanager.com
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com
font-src 'self' https://fonts.gstatic.com data:
img-src 'self' data: blob: https: https://www.googletagmanager.com
connect-src 'self' https://vitals.vercel-insights.com https://www.google-analytics.com https://region1.google-analytics.com
frame-src 'self' https://www.googletagmanager.com
report-uri /csp-report
```

**Key Directives:**

- **`default-src 'self'`**: Only load resources from same origin by default
- **`script-src`**: Allow scripts from self, GTM, and inline scripts (required for GTM)
- **`style-src`**: Allow styles from self, Google Fonts, and inline styles (required for Tailwind)
- **`img-src`**: Allow images from self, data URIs, blobs, HTTPS, and GTM tracking pixels
- **`connect-src`**: Allow connections to self, Vercel Speed Insights, and Google Analytics
- **`frame-src`**: Allow iframes from self and GTM (for noscript fallback)
- **`frame-ancestors 'none'`**: Prevent clickjacking by blocking all iframe embedding
- **`upgrade-insecure-requests`**: Automatically upgrade HTTP to HTTPS

### Development CSP (vite.config.ts)

More permissive to support Hot Module Replacement (HMR) and debugging:

```
script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com
connect-src 'self' ws: wss: http: https: https://www.google-analytics.com
```

**Development-only permissions:**
- `'unsafe-eval'`: Required for source maps and React DevTools
- `ws: wss:`: Required for Vite HMR WebSocket connection
- Broad `http: https:`: Allows API testing with various backends

### CSP Violation Reporting

CSP violations are reported to `/csp-report` endpoint. To implement:

1. Create `/api/csp-report` endpoint to log violations
2. Monitor violations to detect attack attempts
3. Adjust CSP if legitimate resources are blocked

## Security Headers

Additional security headers configured in `vercel.json`:

- **`X-Content-Type-Options: nosniff`**: Prevent MIME type sniffing
- **`X-Frame-Options: DENY`**: Block all iframe embedding (legacy, supplemented by CSP)
- **`X-XSS-Protection: 1; mode=block`**: Enable browser XSS protection (legacy)
- **`Referrer-Policy: strict-origin-when-cross-origin`**: Control referrer information

## Google Tag Manager (GTM) Integration

### Implementation

GTM is integrated in `index.html` with two components:

**1. Head Script (Primary):**
```html
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-XXXXXXX');</script>
```

**2. Body Noscript (Fallback):**
```html
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
```

### Configuration

**Before deployment:**

1. **Replace GTM ID**: Change `GTM-XXXXXXX` to your actual GTM container ID in both locations
2. **Verify CSP**: Ensure GTM domains are whitelisted:
   - `script-src`: `https://www.googletagmanager.com`
   - `img-src`: `https://www.googletagmanager.com` (tracking pixels)
   - `connect-src`: `https://www.google-analytics.com https://region1.google-analytics.com`
   - `frame-src`: `https://www.googletagmanager.com` (noscript iframe)

### CSP Compatibility

GTM requires `'unsafe-inline'` in `script-src` because the inline bootstrap script creates the dataLayer and injects the GTM script dynamically. This is a necessary trade-off for GTM functionality.

**Alternative (more secure but more complex):**
- Use CSP nonces for inline scripts
- Generate a unique nonce on each request
- Apply nonce to GTM script: `<script nonce="GENERATED_NONCE">`
- Add nonce to CSP: `script-src 'nonce-GENERATED_NONCE'`

This requires server-side rendering or edge computing (e.g., Vercel Edge Functions).

### Testing GTM

After deployment:

1. **Browser DevTools**: Check Network tab for `gtm.js` load
2. **GTM Preview Mode**: Use GTM's built-in debugger
3. **Google Tag Assistant**: Browser extension to verify GTM installation
4. **Console Check**: Verify `dataLayer` exists: `console.log(window.dataLayer)`

## Form Security

### Contact Form

The contact form in `src/components/forms/ContactForm.tsx` should sanitize inputs before submission:

```tsx
import { sanitizeUserInput } from '@/utils/sanitizer';

const handleSubmit = (data: FormData) => {
  const cleanData = {
    name: sanitizeUserInput(data.name),
    email: sanitizeUserInput(data.email),
    phone: sanitizeUserInput(data.phone),
    message: sanitizeUserInput(data.message),
  };
  
  // Submit cleanData to backend
};
```

**Why sanitize before submit?**
- Prevent XSS in admin panels viewing submissions
- Prevent SQL injection if data is stored unsafely
- Defense in depth: sanitize at input, storage, and output

## Testing

### Sanitizer Tests

Comprehensive tests in `src/utils/sanitizer.test.ts` cover:

- Safe HTML preservation
- Script tag removal
- Inline event handler removal
- Dangerous tag removal (iframe, object, embed)
- Nested tag preservation
- Whitespace preservation
- HTML entity escaping
- URL validation (http/https/mailto allowed, javascript/data blocked)

**Run tests:**
```bash
npm test -- src/utils/sanitizer.test.ts
```

### Manual Security Testing

**1. XSS Prevention:**
```tsx
// Test in ContactForm or similar component
const maliciousInput = '<script>alert("XSS")</script>';
const sanitized = sanitizeUserInput(maliciousInput);
// Should output: "" or plain text without script tags
```

**2. CSP Verification:**
- Open browser DevTools Console
- Check for CSP violation warnings
- Verify no blocked resources (fonts, GTM, images)

**3. GTM Functionality:**
```javascript
// In browser console
console.log(window.dataLayer);
// Should output: Array with GTM initialization object
```

## Deployment Checklist

Before deploying to production:

- [ ] Replace `GTM-XXXXXXX` with actual GTM container ID (2 locations in `index.html`)
- [ ] Test GTM loads correctly and CSP doesn't block it
- [ ] Verify CSP headers in browser DevTools Network tab
- [ ] Check for CSP violations in Console
- [ ] Test all forms with malicious input (XSS payloads)
- [ ] Verify sanitization works on user-generated content
- [ ] Test all external resource loading (fonts, images, analytics)
- [ ] Confirm `X-Frame-Options` and `X-Content-Type-Options` headers present
- [ ] Test GTM dataLayer pushes (if custom events configured)
- [ ] Verify Google Analytics tracks correctly via GTM
- [ ] Check Vercel Speed Insights still works with CSP
- [ ] Monitor `/csp-report` endpoint for violations (if implemented)

## Security Best Practices

### General Guidelines

1. **Always sanitize user input** before rendering with `dangerouslySetInnerHTML`
2. **Validate URLs** before opening or linking with `sanitizeUrl()`
3. **Strip HTML from form submissions** with `sanitizeUserInput()`
4. **Test CSP changes** in development before deploying
5. **Monitor CSP violations** to detect attacks or misconfigurations
6. **Keep DOMPurify updated** to protect against new XSS vectors
7. **Review GTM tags** regularly to ensure no malicious tags injected

### React-Specific

- Prefer React's default text rendering over `dangerouslySetInnerHTML`
- Only use `dangerouslySetInnerHTML` when absolutely necessary
- Always sanitize before using `dangerouslySetInnerHTML`
- Avoid inline event handlers (`onClick={eval(userInput)}`)
- Use controlled components for form inputs

### CSP Considerations

- Avoid adding `'unsafe-eval'` to production CSP
- Minimize use of `'unsafe-inline'` (required for Tailwind and GTM)
- Consider CSP nonces for inline scripts in future iterations
- Test CSP changes thoroughly to avoid breaking functionality
- Use `report-uri` to monitor violations without blocking

## Troubleshooting

### CSP Violations

**Symptom:** Browser console shows "Content Security Policy" errors

**Solutions:**
1. Check CSP directive in vercel.json or vite.config.ts
2. Add missing domain to appropriate directive (script-src, img-src, etc.)
3. Verify protocol matches (http vs https)
4. Clear browser cache after CSP changes

### GTM Not Loading

**Symptom:** `window.dataLayer` is undefined or GTM script blocked

**Solutions:**
1. Verify GTM ID is correct (not `GTM-XXXXXXX`)
2. Check CSP allows `https://www.googletagmanager.com` in `script-src`
3. Check Network tab for failed gtm.js request
4. Disable browser extensions (ad blockers) that block GTM
5. Test in incognito mode

### Sanitizer Breaks Formatting

**Symptom:** User content loses formatting after sanitization

**Solutions:**
1. Check if required tags are in `ALLOWED_TAGS` (sanitizer.ts)
2. Use `sanitizeAndPreserveWhitespace()` instead of `sanitizeUserInput()`
3. Add missing safe tags to DOMPurify config
4. Test with sample content to verify expected tags preserved

## Resources

- [DOMPurify Documentation](https://github.com/cure53/DOMPurify)
- [Content Security Policy Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [Google Tag Manager Developer Guide](https://developers.google.com/tag-platform/tag-manager)
- [OWASP XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [CSP Evaluator Tool](https://csp-evaluator.withgoogle.com/)
- [Google Tag Assistant](https://tagassistant.google.com/)
