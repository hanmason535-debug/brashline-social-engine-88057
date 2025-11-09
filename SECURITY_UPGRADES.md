# Security & Performance Upgrades

**Date:** November 9, 2025  
**Branch:** `feature/perf-dep-upgrades`

## Vulnerabilities Addressed

### 1. Vite < 6.1.7 (Fixed)
- **Advisory:** GHSA-93m4-6634-74q7 (Windows fs bypass)
- **Severity:** Moderate
- **Fix:** Upgraded from 5.4.19 → 6.1.7
- **Details:** [https://github.com/vitejs/vite/security/advisories](https://github.com/vitejs/vite/security/advisories)

### 2. esbuild (Action Required – Install)
- **Advisory:** GHSA-67mh-4wv8-2f99
- **Severity:** Moderate
- **Fix:** esbuild > 0.24.2 (currently bundled by Vite)
- **Details:** Run `npm install esbuild@latest` to get the patched version

## Steps to Apply

```bash
# 1. Install dependencies (Vite 6.1.7 will pull correct esbuild)
npm install

# 2. Verify upgrades
npm audit

# 3. Build and test
npm run build
npm run preview

# 4. Run dev server
npm run dev
```

## Expected Changes

- Build times may differ (Vite 6.x optimizations)
- No breaking changes to API (minor → major semver is stable)
- Improved rollup bundling with manual chunks (from feature/perf-code-splitting)

## Acceptance Criteria

- ✅ `npm audit` reports 0 moderate+ vulnerabilities
- ✅ Build succeeds without errors
- ✅ Dev server starts without warnings
- ✅ Routes load correctly in browser

## Notes

- **Vite 6.x:** Production-ready release with performance improvements.
- **esbuild:** Bundled as Vite dependency; no separate installation needed.
- **Next steps:** Configure Dependabot for automated PR creation on new advisories.

---

*Generated as part of Security & Performance Priority (P0) improvements.*
