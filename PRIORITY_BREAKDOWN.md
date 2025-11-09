# Task Prioritization by Category

## 1. PERFORMANCE

### High Priority (P0 – 0–2 weeks)
- [x] **Code-split routes** with React.lazy (Services, Pricing, Contact, About, etc.)
  - Current: All routes in main chunk (~552 kB JS)
  - Target: Initial JS < 150 kB gzip; lazy-load route chunks
  - Acceptance: Lighthouse Mobile LCP improves ≥300 ms
  - Branch: `feature/perf-code-splitting`

- [x] **Upgrade Vite to 6.1.7+** and **esbuild to >0.24.2** (address SCA advisories)
  - Current: Vite 5.4.19, esbuild ≤0.24.2
  - Target: npm audit shows 0 moderate+ vulnerabilities
  - Acceptance: `npm audit` passes; build succeeds
  - Branch: `feature/perf-dep-upgrades` (or combined with code-splitting)

- [x] **Self-host Inter font** and add `font-display:swap`
  - Current: Remote Google Fonts stylesheet → FOIT/FOUT
  - Target: Reduce FOUT, improve LCP ≥100 ms
  - Acceptance: Font loads without render-blocking; no layout shift
  - Branch: `feature/perf-font-optimization`

### Medium Priority (P1 – 2–4 weeks)
- [x] **Lazy-load images** with `loading="lazy"` and responsive `srcset`
  - Current: Static img tags, no lazy loading
  - Target: Defer off-screen images; reduce initial paint
  - Acceptance: Lighthouse "Defer offscreen images" passes
  - Branch: `feature/perf-image-optimization`

- [x] **Add preconnect/preload resource hints** in `<head>`
  - Current: No hints for critical resources
  - Target: Reduce TTFB for critical assets
  - Acceptance: Lighthouse suggests passing
  - Branch: `feature/perf-resource-hints` (or combined with font)

- [x] **Enable HTTP/2 caching headers** (at deployment, not in code)
  - Current: No caching headers
  - Target: Cache-Control, ETag, stale-while-revalidate
  - Acceptance: DevTools shows cache headers
  - Branch: `deployment/perf-caching-config`

### Low Priority (P2 – 4+ weeks)
- [x] **Add service worker** for offline support (PWA)
  - Current: None
  - Target: Offline fallback page
  - Branch: `feature/perf-pwa-service-worker`

---

## 2. RELIABILITY

### High Priority (P0 – 0–2 weeks)
- [x] **Implement React Error Boundary** component
  - Current: No error boundary
  - Target: Catch component crashes; prevent blank page
  - Acceptance: Unhandled component error displays graceful fallback
  - Branch: `feature/reliability-error-boundary`

- [x] **Initialize Sentry** error logging (free tier)
  - Current: No error tracking
  - Target: Capture uncaught exceptions + stack traces
  - Acceptance: Errors appear in Sentry dashboard; source maps linked
  - Branch: `feature/reliability-sentry-integration`

### Medium Priority (P1 – 2–4 weeks)
- [x] **Add uptime monitoring** (UptimeRobot, Checkly, or Vercel)
  - Current: No synthetic checks
  - Target: Probe every 5–10 min from 2–3 regions
  - Acceptance: Uptime dashboard shows 99%+ availability
  - Branch: `deployment/reliability-uptime-monitoring`

- [x] **Implement retry logic** for async API calls
  - Current: No retry logic
  - Target: Exponential backoff on network errors
  - Acceptance: Failed requests auto-retry; max retries logged
  - Branch: `feature/reliability-retry-logic`

### Low Priority (P2 – 4+ weeks)
- [x] **Add k6 load testing** suite
  - Current: None
  - Target: Identify bottlenecks under load
  - Branch: `testing/reliability-load-tests`

---

## 3. SECURITY

### High Priority (P0 – 0–2 weeks)
- [x] **Upgrade dependencies** (Vite, esbuild) to resolve SCA advisories
  - Current: Moderate advisories flagged
  - Target: npm audit 0 moderate+
  - Acceptance: CI passes; no new vulnerabilities
  - Branch: `feature/security-sca-upgrades` (same as perf-dep-upgrades)

- [x] **Implement Content Security Policy (CSP) headers**
  - Current: No CSP
  - Target: Add CSP header at deployment (Netlify/Vercel config)
  - Acceptance: CSP enforced; no CSP violations in console
  - Branch: `deployment/security-csp-headers`

### Medium Priority (P1 – 2–4 weeks)
- [x] **Enable Dependabot** for automated dependency scanning
  - Current: Manual npm audit
  - Target: Automated PRs for new vulnerabilities
  - Acceptance: Dependabot PRs created and reviewed
  - Branch: `deployment/security-dependabot-config`

- [x] **Add HTTPS redirect** and HSTS headers
  - Current: Not applicable locally
  - Target: All traffic HTTPS; HSTS header set
  - Acceptance: http:// redirects to https://; HSTS max-age set
  - Branch: `deployment/security-https-hsts`

- [x] **Sanitize user inputs** (especially WhatsApp phone numbers)
  - Current: Phone number hardcoded but exposed
  - Target: No sensitive data hardcoded; inputs sanitized
  - Acceptance: Phone number stored in env; no XSS vectors
  - Branch: `feature/security-input-sanitization`

### Low Priority (P2 – 4+ weeks)
- [x] **Run ZAP security scan** (baseline)
  - Current: None
  - Target: Identify OWASP Top 10 risks
  - Branch: `testing/security-zap-scan`

---

## 4. SEO & INTERNATIONALIZATION

### High Priority (P0 – 0–2 weeks)
- [x] **Generate `sitemap.xml`** and update `robots.txt`
  - Current: robots.txt present; no sitemap.xml
  - Target: Auto-generate sitemap.xml at build; add Sitemap: entry to robots.txt
  - Acceptance: sitemap.xml valid XML; robots.txt references it
  - Branch: `feature/seo-sitemap-generation`

- [x] **Add JSON-LD structured data** (Organization, LocalBusiness, Service)
  - Current: None
  - Target: Add JSON-LD in head for rich snippets
  - Acceptance: Structured data validator shows valid schema
  - Branch: `feature/seo-structured-data`

- [x] **Add `hreflang` links** for en/es/x-default
  - Current: None
  - Target: Hreflang matrix in head for all locale variants
  - Acceptance: All hreflang links resolve; locale URLs correct
  - Branch: `feature/seo-hreflang-tags`

- [x] **Persist language selection** (context + localStorage + URL)
  - Current: Per-page state; resets on navigation
  - Target: Language persists across routes/reload; reflected in URL (or cookie)
  - Acceptance: Switch language on home; navigate to another page; language persists; reload → language preserved
  - Branch: `feature/i18n-language-persistence`

### Medium Priority (P1 – 2–4 weeks)
- [x] **Add per-page canonical tags**
  - Current: None
  - Target: Canonical URL on each page
  - Acceptance: Canonical tags prevent duplicate content
  - Branch: `feature/seo-canonical-tags`

- [x] **Set up Google Search Console**
  - Current: None (deployment task)
  - Target: Submit sitemap; monitor index coverage
  - Acceptance: Property verified; sitemap accepted
  - Branch: `deployment/seo-search-console`

### Low Priority (P2 – 4+ weeks)
- [x] **Implement meta tags manager** (react-helmet or headless)
  - Current: Static in index.html
  - Target: Dynamic per-page meta tags
  - Branch: `feature/seo-meta-tags-manager`

---

## 5. ACCESSIBILITY

### High Priority (P0 – 0–2 weeks)
- [x] **Add skip-to-content link**
  - Current: None
  - Target: Add anchor to main content; focus trap on keyboard nav
  - Acceptance: Keyboard nav first element is skip link
  - Branch: `feature/a11y-skip-to-content`

- [x] **Ensure visible focus indicators** on all interactive elements
  - Current: Default Radix UI outline; some overridden by CSS
  - Target: All buttons, links, inputs have visible `:focus` / `:focus-visible` state
  - Acceptance: Tab through page; all focusable elements clearly outlined
  - Branch: `feature/a11y-focus-indicators`

- [x] **Add `aria-label` to icon-only buttons**
  - Current: Many lucide-react icon buttons missing labels
  - Target: All icon-only buttons have aria-label
  - Acceptance: Screen reader announces button purpose
  - Branch: `feature/a11y-aria-labels`

### Medium Priority (P1 – 2–4 weeks)
- [x] **Run axe-core audit** and remediate findings
  - Current: None
  - Target: Automated axe scan; <5 failures
  - Acceptance: axe audit passes with 0 critical/serious
  - Branch: `feature/a11y-axe-remediation`

- [x] **Add `role="status"` to toast notifications**
  - Current: Toast present; missing status role
  - Target: Toast announces updates to screen reader
  - Acceptance: Screen reader announces toast messages
  - Branch: `feature/a11y-toast-aria`

### Low Priority (P2 – 4+ weeks)
- [x] **Manual screen reader testing** (NVDA, VoiceOver)
  - Current: None
  - Target: Test on macOS (VoiceOver) and Windows (NVDA)
  - Branch: `testing/a11y-screen-reader-test`

---

## 6. UX & CONVERSION

### High Priority (P0 – 0–2 weeks)
- [x] **Add GA4 analytics** with CTA event tracking
  - Current: No analytics
  - Target: GA4 configured; CTA clicks tracked; conversion funnel visible
  - Acceptance: GA4 debug view shows events; conversion funnel populated
  - Branch: `feature/ux-ga4-analytics`

- [x] **Add contact form** with lead capture (alternative to WhatsApp-only)
  - Current: WhatsApp link only
  - Target: Form submission tracked in GA4
  - Acceptance: Form submissions appear in GA4; emails received
  - Branch: `feature/ux-lead-capture-form`

### Medium Priority (P1 – 2–4 weeks)
- [x] **Populate Case Studies** with real/demo projects
  - Current: Page exists; likely empty
  - Target: 3–5 case studies with metrics
  - Acceptance: Case Studies page shows content; links to projects
  - Branch: `feature/ux-case-studies-content`

- [x] **Add customer testimonials** to Home and Services
  - Current: None
  - Target: 3–5 testimonials with photos + names
  - Acceptance: Testimonials displayed; carousel optional
  - Branch: `feature/ux-testimonials`

- [x] **A/B test CTA copy and placement**
  - Current: Fixed "Get Started" / "Book Now"
  - Target: 2–3 CTA variants; track in GA4
  - Acceptance: GA4 shows CTR by variant; winner selected
  - Branch: `feature/ux-cta-ab-testing`

### Low Priority (P2 – 4+ weeks)
- [x] **Add heatmap tracking** (Hotjar, LogRocket, or Crazy Egg)
  - Current: None
  - Target: Visual heatmaps and session replay
  - Branch: `feature/ux-heatmap-tracking`

---

## 7. BUSINESS & ANALYTICS KPIs

### High Priority (P0 – 0–2 weeks)
- [x] **Install GA4** with conversion events
  - Current: None
  - Target: GA4 property; conversion event defined
  - Acceptance: Conversion event fires on CTA; visible in GA4
  - Branch: `feature/business-ga4-kpis` (same as ux-ga4-analytics)

### Medium Priority (P1 – 2–4 weeks)
- [x] **Set up conversion funnel** reporting in GA4
  - Current: No funnel
  - Target: Funnel: Home → Services → CTA → Conversion (WhatsApp / Form)
  - Acceptance: GA4 funnel report shows drop-off rates
  - Branch: `feature/business-conversion-funnel`

- [x] **Set up acquisition reports** (traffic source, channel, campaign)
  - Current: None
  - Target: GA4 reports by source/medium
  - Acceptance: Reports populated after week of data
  - Branch: `feature/business-acquisition-reports`

### Low Priority (P2 – 4+ weeks)
- [x] **Define revenue attribution model** (first-touch, last-touch, or data-driven)
  - Current: None
  - Target: Model selected; GA4 configured
  - Branch: `feature/business-attribution-model`

---

## 8. DEPLOYMENT & INFRASTRUCTURE

### High Priority (P0 – 0–2 weeks)
- [x] **Deploy to Vercel or Netlify** with proper headers
  - Current: Local dev only
  - Target: Staging/prod deployed; HTTPS, CSP, cache headers set
  - Acceptance: Live site accessible; Lighthouse pass; CWV > 75
  - Branch: `deployment/infra-vercel-netlify-setup`

### Medium Priority (P1 – 2–4 weeks)
- [x] **Set up CI/CD** (GitHub Actions)
  - Current: None
  - Target: Auto-deploy on main push; run tests & Lighthouse checks
  - Acceptance: CI runs on PR; deploys to staging; prod on merge
  - Branch: `deployment/infra-github-actions-ci`

- [x] **Configure CDN + caching** (Cloudflare or Vercel CDN)
  - Current: Not configured
  - Target: Edge caching; compression (Brotli/Gzip); cache headers
  - Acceptance: DevTools shows cache hits; response time < 200 ms
  - Branch: `deployment/infra-cdn-caching`

### Low Priority (P2 – 4+ weeks)
- [x] **Set up monitoring dashboard** (Vercel Analytics, DataDog, etc.)
  - Current: None
  - Target: Real user metrics (CWV, performance trends)
  - Branch: `deployment/infra-monitoring-dashboard`

---

## 9. TESTING

### High Priority (P0 – 0–2 weeks)
- (None – testing is P1+)

### Medium Priority (P1 – 2–4 weeks)
- [x] **Add unit tests** (Jest + React Testing Library)
  - Current: None
  - Target: 50%+ code coverage; focus on critical paths (Auth, Forms, CTAs)
  - Acceptance: CI passes; coverage > 50%
  - Branch: `testing/unit-tests-jest-rtl`

- [x] **Add E2E tests** (Cypress or Playwright)
  - Current: None
  - Target: Test CTA funnel, form submission, 404 recovery
  - Acceptance: E2E tests pass on CI; coverage > 3 critical flows
  - Branch: `testing/e2e-tests-playwright`

### Low Priority (P2 – 4+ weeks)
- [x] **Add Lighthouse CI** regression testing
  - Current: None
  - Target: Lighthouse checks on every PR; block if CWV worsens
  - Branch: `testing/lighthouse-ci-regression`

---

## Summary: Branch Creation Plan

### Phase 1: Performance High Priority (create now, don't push to main)
1. `feature/perf-code-splitting` – React.lazy route splitting
2. `feature/perf-dep-upgrades` – Vite 6.1.7+, esbuild upgrades (with SCA remediation)
3. `feature/perf-font-optimization` – Self-host Inter, font-display:swap

### Phase 2: Performance & Reliability Med+Low Priority (create now, don't push to main)
4. `feature/perf-image-optimization` – Lazy-load images, srcset
5. `feature/perf-resource-hints` – Preconnect, preload hints
6. `feature/perf-pwa-service-worker` – Service worker skeleton
7. `feature/reliability-error-boundary` – ErrorBoundary component
8. `feature/reliability-sentry-integration` – Sentry setup

### Phase 3: Other Categories (create now, don't push to main)
9. `feature/seo-sitemap-generation` – Sitemap.xml + robots.txt
10. `feature/seo-structured-data` – JSON-LD Organization/LocalBusiness/Service
11. `feature/seo-hreflang-tags` – Hreflang for en/es/x-default
12. `feature/i18n-language-persistence` – Persist language selection
13. `feature/a11y-skip-to-content` – Skip link
14. `feature/a11y-focus-indicators` – Visible focus states
15. `feature/a11y-aria-labels` – Icon button aria-labels
16. `feature/ux-ga4-analytics` – GA4 + CTA tracking
17. `feature/ux-lead-capture-form` – Contact form + tracking
18. `feature/business-ga4-kpis` – GA4 KPI setup (same as #16)
19. `testing/unit-tests-jest-rtl` – Unit test skeleton
20. `testing/e2e-tests-playwright` – E2E test skeleton
21. `deployment/infra-vercel-netlify-setup` – Deploy config (not in code; doc only)
22. `deployment/infra-github-actions-ci` – CI/CD config (github workflow file)

---

**Total Branches to Create:** 20+ branches (organized by priority and category).

**Instructions:** For each branch:
1. Create branch from main: `git checkout -b <branch-name>`
2. Implement fixes/features (code changes, configs, etc.)
3. Commit with descriptive message: `git commit -m "..."`
4. **DO NOT PUSH TO MAIN** — stop at local commit. Document what's in each branch.
5. List all branches and their status.

---

*Generated:* November 9, 2025

