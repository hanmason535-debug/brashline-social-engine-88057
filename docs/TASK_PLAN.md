# Comprehensive Task Plan - Brashline Social Engine

## Overview
This document outlines the complete task plan for fixing animations, implementing Stripe checkout, and optimizing the website.

**Status: ✅ COMPLETED (December 4, 2025)**

---

## 🎯 Priority 1: Stripe Checkout Integration

### Current State
- ✅ Product IDs mapped to pricing data
- ✅ Checkout session API exists (`api/stripe/create-checkout-session.ts`)
- ✅ Stripe context with `createCheckoutSession` function
- ✅ OneTimePackageCard component with "Buy Now" and "Add to Cart" options
- ✅ stripePriceId field added to OneTimePackage type
- ⚠️ Price IDs are placeholders (need real Stripe price IDs from you)

### Tasks
| # | Task | Status | Priority |
|---|------|--------|----------|
| 1.1 | Create prices in Stripe for each product (monthly/yearly) | ⚠️ Waiting | High |
| 1.2 | Update `pricing.data.ts` with real price IDs | ⚠️ Waiting | High |
| 1.3 | Verify checkout flow redirects to Stripe | ✅ Ready | High |
| 1.4 | Test success/cancel URL handling | ⚠️ Waiting | Medium |
| 1.5 | Implement one-time payment checkout for add-on packages | ✅ Done | High |

### Required Information from You
- **Price IDs** for each product (monthly and yearly intervals)
  - Format: `price_xxx` from Stripe Dashboard

---

## 🎨 Priority 2: Fix Broken Animations - ✅ COMPLETED

### Animation Fixes Applied

| Component | Fix Applied | Status |
|-----------|-------------|--------|
| Hero.tsx | Restored spring-based word rotation from backup | ✅ Fixed |
| background-paths.tsx | Increased paths (28/36), full animation range [0,1,0] | ✅ Fixed |
| meteors.tsx | CSS keyframes verified in tailwind.config.ts | ✅ Working |

---

## ⚡ Priority 3: Performance Optimization - ✅ ANALYZED

### Build Analysis Results
- Total CSS: 100KB (gzipped: 16.9KB)
- React vendor: 339KB
- Animation vendor: 196KB (framer-motion)
- Main index: 489KB
- ✅ Code splitting via lazy() for all routes
- ✅ Image lazy loading implemented
- ✅ Manual chunks configured in Vite

### Bundle Sizes (Top 5)
| Bundle | Size | Notes |
|--------|------|-------|
| index.js | 489KB | Main app bundle - expected |
| Analytics.js | 434KB | Lazy loaded (OK) |
| react-vendor.js | 339KB | React + Router |
| animation-vendor.js | 196KB | Framer Motion |
| Pricing.js | 102KB | Lazy loaded |

---

## 📋 Next Steps Guide

### Immediate Actions Required From You

#### 1. Get Stripe Price IDs (Required for Checkout)
Go to Stripe Dashboard → Products and create prices for:

**Recurring Plans:**
```
Starter Spark (prod_TVRrohKG1uB7fa):
  - Monthly: $99/mo → price_xxx
  - Yearly: $1106/yr → price_yyy

Brand Pulse (prod_TVRrso4JzT9ceT):
  - Monthly: $179/mo → price_xxx
  - Yearly: $1826/yr → price_yyy

Impact Engine (prod_TVRsONeDHkB2it):
  - Monthly: $399/mo → price_xxx
  - Yearly: $5689/yr → price_yyy
```

**One-Time Packages:**
```
Digital Launch Pro (prod_TVS5FcxrQkvq5L): $2999 → price_xxx
Visual Vault (prod_TVS7v3cOTcXY76): $399 → price_xxx
AutomateIQ (prod_TVSAvZFkkSQ1tu): $899 → price_xxx
Local Surge (prod_TVSBLbVY78wqB1): $599 → price_xxx
Commerce Boost (prod_TVSBP43xi9RfXE): $799 → price_xxx
Data Pulse (prod_TVSCwnL5zuQdxy): $399 → price_xxx
```

#### 2. Verify Environment Variables in Vercel
Ensure these are set:
- `STRIPE_SECRET_KEY` (sk_live_xxx or sk_test_xxx)
- `STRIPE_PUBLISHABLE_KEY` (pk_live_xxx or pk_test_xxx)
- `STRIPE_WEBHOOK_SECRET` (whsec_xxx)
- `DATABASE_URL` (Neon connection string)
- `CLERK_SECRET_KEY`
- `CLERK_PUBLISHABLE_KEY`

#### 3. Test Webhook Endpoint
After deploying, test the webhook at:
```
POST https://your-domain.vercel.app/api/stripe/webhook
```

### Suggested Improvements

#### Additions
1. **Customer Portal Integration**: Allow users to manage subscriptions
2. **Invoice/Receipt Emails**: Send confirmation after purchase
3. **Subscription Analytics**: Track MRR, churn, conversions
4. **A/B Testing**: Test different pricing layouts
5. **Promo Code UI**: Show promo code field in checkout

#### Alterations
1. **Consolidate Pricing Data**: The Pricing.tsx page has inline data - should use `pricing.data.ts` exclusively
2. **Unify Checkout Flows**: Make recurring and one-time flows consistent
3. **Add Error Boundaries**: Wrap payment components for better error handling

#### Deletions
1. **Redundant Documentation**: Consolidate overlapping markdown files
2. **Unused Test Snapshots**: Clean up old visual regression snapshots
3. **Dead Code**: Remove unused imports flagged by ESLint

### Performance Recommendations
1. Consider using Lighthouse CI in GitHub Actions for regression tracking
2. Add preconnect hints for Stripe JS
3. Consider service worker for offline caching
4. Implement Critical CSS extraction

---

## Commits Made

1. `feat(stripe): add Stripe product IDs to all pricing plans` (e64c842)
2. `fix(animations): restore hero rotating words and background path animations` (e20a886)

---

*Last Updated: December 4, 2025*
