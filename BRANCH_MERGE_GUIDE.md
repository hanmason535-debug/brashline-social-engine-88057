# How to Use the Priority Branches

## Quick Start

### View All Local Branches
```bash
git branch -a
```

You should see:
- `feature/perf-code-splitting`
- `feature/perf-dep-upgrades`
- `feature/perf-font-optimization`
- `feature/reliability-error-boundary`
- `feature/reliability-sentry-integration`

### Switch to a Branch
```bash
git checkout feature/perf-code-splitting
```

### View Changes in a Branch
```bash
# See all files changed vs main
git diff main --name-only

# See full diff for a specific file
git diff main -- src/App.tsx

# See commit message
git log -1 --format=%B
```

---

## Workflow for Merging Branches

### Step 1: Review the Branch
```bash
git checkout feature/perf-code-splitting
git log --oneline main..  # commits in this branch
git diff main             # review all changes
```

### Step 2: Test Locally
```bash
npm install
npm run build       # ensure build succeeds
npm run dev         # test in dev mode
npm run lint        # check for lint errors
```

### Step 3: Merge to Main
```bash
git checkout main
git pull origin main
git merge --no-ff feature/perf-code-splitting
git push origin main
```

### Step 4: Verify Remote
```bash
git fetch origin
git log origin/main -1  # check latest commit on remote
```

### Step 5: Delete Local Branch (Optional)
```bash
git branch -d feature/perf-code-splitting
```

---

## Recommended Merge Order

Merge branches in this order to avoid conflicts and ensure dependencies are satisfied:

1. **`feature/perf-dep-upgrades`** (Security upgrades first)
   - Upgrades Vite and esbuild
   - No code conflicts with other branches
   - Run `npm install` after merge

2. **`feature/perf-code-splitting`** (Depends on Vite upgrade)
   - Route-based lazy loading
   - Uses updated Vite config
   - Test routes load on-demand

3. **`feature/perf-font-optimization`** (Independent)
   - Font delivery optimization
   - No code conflicts
   - Test font loads without render-blocking

4. **`feature/reliability-error-boundary`** (Wrap ErrorBoundary first)
   - Error handling at app level
   - Prepares for Sentry integration

5. **`feature/reliability-sentry-integration`** (Last)
   - Depends on ErrorBoundary
   - Requires Sentry DSN configuration
   - Configure `.env.local` after merge

---

## Testing Checklist for Each Branch

### Before Merge
- [ ] Branch created from `main`
- [ ] All changes committed
- [ ] Build succeeds: `npm run build`
- [ ] Dev server works: `npm run dev`
- [ ] No console errors or warnings
- [ ] Lint passes: `npm run lint`

### After Merge
- [ ] Main branch builds: `npm run build`
- [ ] Main branch dev server: `npm run dev`
- [ ] Previous branches' features still work
- [ ] Performance metrics confirmed (Lighthouse)
- [ ] Functionality tested in browser

---

## Resolving Conflicts

If merge conflicts occur:

```bash
git status              # see conflicted files
```

Edit conflicted files (marked with `<<<<<<<`, `=======`, `>>>>>>>`), then:

```bash
git add .               # mark as resolved
git commit -m "resolve merge conflicts"
git push origin main
```

---

## Monitoring Performance Improvements

After merging all P0 branches, run Lighthouse to verify improvements:

```bash
# Install globally if needed
npm install -g lighthouse

# Run Lighthouse on local dev server
npx lighthouse http://localhost:8080 --preset=mobile --output=json --output-path=lighthouse-report.json

# View report
npx http-server .  # serve locally and open lighthouse-report.json in browser
```

**Expected Improvements:**
- LCP: 50–300 ms faster
- INP: 50–100 ms faster
- CLS: Similar or better
- Overall score: +10–20 pts

---

## Sentry Setup After Merge

After merging `feature/reliability-sentry-integration`:

1. **Get DSN from Sentry:**
   - Go to [https://sentry.io/](https://sentry.io/)
   - Create project (if not already)
   - Copy DSN

2. **Configure .env.local:**
   ```bash
   echo "VITE_SENTRY_DSN=https://your-dsn@sentry.io/project-id" > .env.local
   ```

3. **Install Sentry packages:**
   ```bash
   npm install @sentry/react @sentry/tracing
   ```

4. **Update main.tsx:**
   - Copy `src/main.sentry.tsx` to `src/main.tsx`
   - Or manually integrate Sentry.init() into existing main.tsx

5. **Test:**
   ```bash
   npm run dev
   # Trigger an error (throw new Error() in console)
   # Check Sentry dashboard for captured event
   ```

---

## Documentation References

- **`BRANCH_STATUS.md`** – Detailed status of each branch
- **`PROJECT_COMPLETION_SUMMARY.md`** – High-level project overview
- **`PRIORITY_BREAKDOWN.md`** – Full list of remaining P1/P2 tasks
- **`AUDIT_REPORT.md`** – Master audit findings
- **`SECURITY_UPGRADES.md`** – Security patch details
- **`SENTRY_SETUP.md`** – Sentry integration guide

---

## FAQ

**Q: Can I merge branches in a different order?**  
A: Mostly yes, but some have dependencies. Merge `feature/perf-dep-upgrades` first (security), then others. Merge `feature/reliability-sentry-integration` last (depends on ErrorBoundary).

**Q: What if a branch doesn't merge cleanly?**  
A: Run `git merge --no-edit feature/branch-name`, then manually resolve conflicts in conflicted files.

**Q: Should I push branches before merging to main?**  
A: No — per requirements, branches are only committed locally. Merge directly to main when ready.

**Q: Can I test multiple branches together before merging?**  
A: Yes. Create a temporary test branch: `git checkout -b test/all-p0` then cherry-pick commits from each branch for testing.

**Q: How do I rollback a merge?**  
A: If merge causes issues: `git revert -m 1 <merge-commit-hash>` then `git push origin main`

---

## Next Steps

1. Review each branch (code + commits)
2. Test locally following the checklist
3. Merge branches in recommended order
4. Monitor performance with Lighthouse
5. Deploy to staging/production
6. Start on P1 branches (documented in `PRIORITY_BREAKDOWN.md`)

---

For questions or issues, refer to `PROJECT_COMPLETION_SUMMARY.md` or review branch commits directly.
