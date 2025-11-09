Brashline — Audit One‑Pager
Date: 2025-11-09
Repo: brashline-social-engine-88057 (main)

Purpose
A single-page summary of the full audit with prioritized, actionable recommendations across Performance, Reliability, Security, SEO, Accessibility, UX, Business KPIs, Deployment, and Testing.

TL;DR
- Modern stack (React + Vite + Tailwind). Good foundation.
- Biggest risks: missing analytics/monitoring, bundle size & Core Web Vitals, accessibility gaps, and lack of structured data.
- Immediate priorities (P0): Analytics + tracking, Accessibility fixes, Error handling/logging, Structured data + sitemap, Code-splitting.

Audit folder findings (key items pulled from `audit/report.md`)
- Bundle sizes measured: JS ~552 kB (gzip ~174 kB) and CSS ~73.9 kB (gzip ~12.6 kB). There is an entry chunk >500 kB — recommend manualChunks/dynamic imports. (Priority: P0)
- Security SCA advisories: esbuild <=0.24.2 (GHSA-67mh-4wv8-2f99) and Vite versions with advisories; current Vite is 5.4.19 — upgrade to patched versions (Priority: P0/P1)
- No `sitemap.xml` detected; `robots.txt` exists. Add sitemap and reference in `robots.txt` (Priority: P0)
- Internationalization: language toggle is per-page state and not persisted across routes/sessions. Persist via context + URL or cookie and add `hreflang` (Priority: P0)
- Fonts: Inter currently loaded via remote stylesheet; consider self-hosting + font-display to reduce FOUT/FOIT and improve LCP (Priority: P1)
- SPA router: BrowserRouter requires host-level SPA fallback for deep links; confirm hosting rewrite rules (Priority: P1)


Top 6 Priorities (P0 / P1 / P2)
P0 (Critical, 0–2 weeks)
- Add GA4 + event tracking (owner: product) — Effort: 1–2 days
- Implement React Error Boundary + Sentry (owner: dev) — Effort: 1–2 days
- Fix core accessibility issues (skip-link, focus outlines, ARIA labels) (owner: dev/UX) — Effort: 2–3 days
- Add JSON-LD structured data + sitemap.xml and update robots.txt (owner: SEO) — Effort: 1–2 days
- Route-based code-splitting (React.lazy) for heavy pages (owner: dev) — Effort: 2–3 days

P1 (High, 2–6 weeks)
- Lazy-load images, convert to WebP/AVIF, add srcset (owner: dev) — Effort: 2–4 days
- Set HTTP caching headers + CDN configuration (owner: infra) — Effort: 1–2 days
- Automated dependency scanning (Dependabot) + run npm audit fixes (owner: devops) — Effort: 1 day
- Add CI pipeline with Lighthouse checks + unit tests (owner: devops) — Effort: 1–2 weeks

P2 (Medium/Longer term)
- Service worker / PWA (owner: product/dev) — Effort: 1–2 weeks
- Load testing (k6) and synthetic monitors (Checkly) (owner: devops) — Effort: 2–4 days
- Heatmaps and session replay (Hotjar/LogRocket) (owner: product) — Effort: 1–2 days

Recommendations by Category (concise)
Performance
- P0: Code-split routes; lazy-load non-critical components.
- P1: Optimize and modernize images; enable brotli/gzip at CDN.
- P1: Add resource hints (preload fonts, prefetch important routes).

Reliability
- P0: Implement application error boundaries and Sentry / LogRocket.
- P1: Add synthetic uptime checks and alerting (PagerDuty / Slack).
- P2: Add circuit breakers and retry logic for API calls.

Security
- P0: Enforce HTTPS, HSTS, CSP headers at CDN/app server.
- P1: Enable Dependabot and fix high/critical npm audit items.
- P2: Pen test or security review for any backend/API endpoints.

SEO
- P0: Add JSON-LD (Organization, LocalBusiness, Service, FAQ). Generate sitemap.xml and publish.
- P1: Ensure per-page meta tags (title/description) via a head manager (react-helmet/headless).
- P2: Set up Search Console and submit sitemap; monitor index coverage.

Accessibility
- P0: Add skip-to-content, visible focus states, aria-labels for icon-only buttons.
- P1: Run axe-core CI checks and remediate failures.
- P2: Conduct screen reader testing (NVDA, VoiceOver).

UX & Conversion
- P0: Add analytics and track CTA clicks; add a lead capture form (track events).
- P1: Add testimonials, populate Case Studies and Blog for trust & SEO.
- P2: A/B test CTA copy/placement.

Business KPIs
- P0: Install GA4 and configure conversion events & funnels.
- P1: Configure reports: acquisition, conversion, bounce, revenue/visitor.

Deployment & Infra
- P0: Deploy to a CDN-backed host (Vercel/Netlify) with proper headers.
- P1: Add CI/CD and Lighthouse checks on PRs.

Testing
- P1: Add unit tests (Vitest/Jest) and E2E (Playwright/Cypress).
- P2: Add performance regression testing via Lighthouse CI.

Quick Action Plan (next 7 days)
Day 1–2: Install GA4; wire CTA events; create backup branch.  
Day 2–4: Implement error boundary + Sentry, fix top 3 accessibility issues (skip link, focus, aria).  
Day 4–7: Add JSON-LD + sitemap, code-split main routes, run initial Lighthouse and commit tickets for remaining items.

Where to start (first PRs)
1. Add GA4 snippet and data-attributes on CTA buttons.  
2. Add React Error Boundary and Sentry minimal init.  
3. Add skip-to-content anchor, ensure focus outlines are visible.  
4. Create sitemap.xml generator script and add to build.

Notes
- I recommend pairing a Product owner and Dev owner to triage the P0 items, then schedule P1 and P2 work.  
- I can implement the GA4 + CTA event tracking, Error Boundary + Sentry, or create PR templates and CI workflows if you want — tell me which item to take next.

Status
- This file added to the repository: `AUDIT_ONE_PAGER.md`.

---
Generated by audit tooling and repository analysis on 2025-11-09.
