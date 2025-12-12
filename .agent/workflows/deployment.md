---
description: How to deploy to production on Vercel
---

# Deployment Workflow

## Automatic Deployment

Pushing to `main` triggers automatic deployment to Vercel.

// turbo
1. Ensure all tests pass:
```bash
npm test -- --run
```

// turbo
2. Build locally to verify:
```bash
npm run build
```

3. Push to main:
```bash
git push origin main
```

4. Monitor deployment at https://vercel.com/dashboard

## Manual Deployment

If automatic deployment is disabled:

```bash
npx vercel --prod
```

## Pre-Deployment Checklist

- [ ] All tests passing (`npm test`)
- [ ] Build succeeds (`npm run build`)
- [ ] No lint errors (`npm run lint`)
- [ ] Environment variables set in Vercel dashboard
- [ ] Feature branch merged to main

## Environment Variables (Vercel)

Required in Vercel dashboard → Settings → Environment Variables:

| Variable | Purpose |
|----------|---------|
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk auth (Production key) |
| `VITE_STRIPE_PRICE_*` | Stripe price IDs |
| `VITE_API_URL` | Backend API URL |

## Post-Deployment Verification

1. Check production URL loads
2. Test authentication flow
3. Test contact form submission
4. Test pricing page / checkout
5. Run Lighthouse audit
6. Verify in Google Search Console

## Rollback

If issues found in production:

```bash
# Via Vercel CLI
npx vercel rollback

# Or via git
git revert HEAD
git push origin main
```
