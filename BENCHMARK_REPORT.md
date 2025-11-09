# Benchmark report (local preview)

Generated: 2025-11-09

Notes: I attempted to run a full local benchmark against the built preview server on http://localhost:5173. The build completed successfully and several artifacts were collected. Some active checks (TTFB, Lighthouse) failed because the preview server was intermittently unreachable from the CLI session or Chrome prevented the page load. I've recorded what succeeded and listed next steps to finish the remaining metrics.

## Quick summary (available results)

| Category | Metric | Current value | Unit | Target | Tool / Path |
|---|---|---:|---:|---:|---|
| Performance | Main JS bundle (raw) | 467.59 | kB | - | build output (dist/assets/index-*.js) |
| Performance | Main JS bundle (gzipped) | 151.10 | kB | < 150 | build output (dist/assets/index-*.js gzip) |
| Performance | CSS (raw) | 74.46 | kB | < 50 | build output (dist/assets/index-*.css) |
| Performance | CSS (gzipped) | 12.70 | kB | < 50 | build output (dist/assets/index-*.css gzip) |
| Performance | Dist total size | 633.45 | kB | - | Sum of `dist` files (see below)
| Security | npm audit output | saved | json | 0 critical | `artifacts/audit-local.json` (run: `npm audit --json`)

## Collected artifacts

- `artifacts/audit-local.json` — npm audit JSON output
- `artifacts/lighthouse-local.json` — Lighthouse report (attempted; not created due to Chrome/page-load error)
 - `artifacts/ttfb-local.txt` — raw TTFB output from curl

## Commands run (successful)

- `npm run build` — produced the production `dist/` folder (listed sizes above)
- `npm run preview -- --port 5173` — attempted to start preview server (preview start was not stable in the CLI session)
- `npm audit --json > artifacts/audit-local.json`
- Dist sizing via PowerShell `Get-ChildItem` (summed to ~633.45 KB)

## Metrics pending / failed to collect in this run

- TTFB (curl) — curl attempts from the PowerShell session failed intermittently. I created `tools/ttfb.cjs` and tried to run it but the preview endpoint returned connection errors.
- Lighthouse (mobile) — attempted with `npx lighthouse ...` but Chrome prevented the page load (runtime error). This is likely because the preview server didn't respond to headless Chrome from the environment, or Chrome couldn't access `localhost` in headless mode here.
- Measured TTFB (curl):
   - `TTFB: 0.000000s`
   - `Total: 2.247916s`
- k6 load test — not run yet. I can run a lightweight k6 smoke test if you allow installing/running k6 or if you prefer I run a small Node-based synthetic load.

## Next steps (recommendation)

1. Confirm the target environment you want to benchmark (local/staging/production). If you want accurate Lighthouse and TTFB values, run these against a staging or production URL that Chrome can access from this environment (or run lighthouse on the machine with an interactive Chrome). For local runs, consider running Lighthouse in the GUI browser and uploading the JSON.
2. Re-run the full suite:
   - curl TTFB from multiple locations (or use WebPageTest)
   - npx lighthouse --emulated-form-factor=mobile --output=json --output-path=artifacts/lighthouse-<env>.json
   - k6 ramp tests to collect throughput and latency growth curve
   - SSL Labs test for TLS configuration (production/staging only)
3. After collecting, I'll populate the full benchmark matrix and save results to `BENCHMARK_REPORT.md` and update `COMPLETION_REPORT.md` with executive summary and remediation suggestions.

If you want me to continue now, confirm:
- Environment to test: `local` (localhost:5173) or provide `staging`/`production` URL
- Whether it's OK to perform a short load test (k6) against the chosen environment
