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

## Brashline — Audit One‑Pager
**Date:** 2025-11-09
**Repo:** `brashline-social-engine-88057` (branch: `audit/one-pager-updates`)

Purpose
A concise, single-page summary of the full repository audit with prioritized, actionable recommendations across Performance, Reliability, Security, SEO, Accessibility, UX, Business KPIs, Deployment, and Testing.

TL;DR
- Modern stack (React + Vite + Tailwind). Good foundation.
- Biggest risks: missing analytics/monitoring, large initial bundle (>500 kB), dependency advisories, accessibility gaps, and missing sitemap/structured data.
- Immediate priorities (P0): Analytics + tracking, Accessibility fixes, Error handling/logging, Structured data + sitemap, Code-splitting, and SCA upgrades.

Top priorities (P0 / P1 / P2)

P0 — Critical (0–2 weeks)
- Add GA4 + event tracking (owner: Product) — 1–2 days
- Implement React Error Boundary + Sentry minimal init (owner: Dev) — 1–2 days
- Fix core accessibility issues (skip-to-content, visible focus outlines, aria labels) (owner: Dev/UX) — 2–3 days
- Add JSON-LD structured data, generate `sitemap.xml` and update `robots.txt` (owner: SEO) — 1–2 days
- Code-split routes / reduce initial JS (manualChunks / dynamic import) to address >500 kB entry chunk (owner: Dev) — 2–3 days
- Upgrade build tooling to resolve SCA advisories (Vite, esbuild) (owner: Dev) — 1 day

P1 — High (2–6 weeks)
- Lazy-load images, convert to WebP/AVIF and add responsive `srcset` (owner: Dev)
- Host assets on CDN and set HTTP caching/edge headers (owner: Infra)
- Enable Dependabot and run `npm audit` fixes (owner: DevOps)
- Add CI pipeline with Lighthouse checks and unit tests (owner: DevOps)

P2 — Medium / Longer term
- PWA / Service Worker (owner: Product/Dev)
- Load testing (k6) and synthetic monitors (Checkly) (owner: DevOps)
- Heatmaps/session replay (Hotjar/LogRocket) for UX insight (owner: Product)

Key findings (from `audit/report.md`) — concise
1. Bundle sizes (codebase build): JS ~552 kB (gzip ~174 kB), CSS ~73.9 kB (gzip ~12.6 kB). Entry chunk >500 kB — causes slow LCP on mobile (P0).
2. Security SCA advisories: `esbuild` (<=0.24.2) and Vite versions flagged — upgrade recommended (P0/P1).
3. SEO: `robots.txt` present; no `sitemap.xml`; no canonical links or `hreflang` entries for en/es; SPA deep-route fallback required on host (P0).
4. I18n/UX: Language toggle is per-page state (not persisted). Persist selection via context + localStorage or reflect in URL; add `hreflang` (P0).
5. Fonts: Inter loaded via external stylesheet — consider self-hosting + `font-display` to reduce FOIT/FOUT and improve LCP (P1).
6. Delivery & infra: No preconnect/preload hints found; confirm HTTP/2/3, compression, caching and CDN configuration (P1).
7. Tests/artifacts: Runtime metrics (Lighthouse, WebPageTest, axe, k6, ZAP) are still pending and will complete the scorecard (Data required).

Quick wins (0–7 days)
- Add GA4 and wire CTA events (+ basic consent handling) — immediate measurement.
- Add React Error Boundary and initialize Sentry (free tier) — capture runtime exceptions.
- Commit a `sitemap.xml` (auto-generated at build) and add `hreflang` and canonical tags where applicable.

Action plan (first 7 days)
Day 1: Create `analytics/` PR — add GA4 snippet and data-attributes on primary CTAs; add an events plan.
Day 2: Add React Error Boundary + Sentry minimal configuration; add basic error logging to console with Sentry capture.
Day 3: Add `sitemap.xml` generator (script) and include it in build; update `robots.txt`.
Day 4–7: Create follow-up PRs for: Vite/esbuild upgrades, route code-splitting (manualChunks), and top 3 accessibility fixes.

Acceptance criteria (examples)
- GA4: conversion events fired on CTA clicks; events visible in GA4 debug view.
- Sentry: uncaught exceptions appear in Sentry with source mapping where possible.
- Performance: initial JS reduced; Lighthouse Mobile LCP improved by target (example: ≥300 ms).
- SEO: `sitemap.xml` published and accepted in Search Console; `hreflang` present for en/es.

Commands & evidence to collect (short)
- Lighthouse (mobile):
	`npx lighthouse <URL> --preset=mobile --output=json --output-path=audit/artifacts/lighthouse/mobile.json`
- axe quick run:
	`npx @axe-core/cli <URL> --tags wcag2a,wcag2aa -o audit/artifacts/axe/site.json`
- k6 ramp example: see `audit/report.md` for template.

Where to start (first PRs)
1. `feature/analytics-ga4` — GA4 + CTA event wiring.
2. `feature/sentry-errors` — ErrorBoundary + Sentry init.
3. `feature/sitemap-hreflang` — sitemap generation + hreflang + robots update.

Notes
- Runtime benchmarks require a public/staging `TARGET_URL` to complete the full scorecard. Provide `TARGET_URL` and `ALT_ROUTES` to run the 12-way test matrix.
- I can implement any P0 item; say which one and I’ll create the branch and PR.

Status
- Updated one-pager with findings from `audit/report.md` and committed on branch `audit/one-pager-updates`. PR updates automatically.

---
Generated from codebase audit and `audit/report.md` on 2025-11-09.
