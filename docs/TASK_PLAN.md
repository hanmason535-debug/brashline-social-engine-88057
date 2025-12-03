# Comprehensive Task Plan - Brashline Social Engine

## Overview
This document outlines the complete task plan for fixing animations, implementing Stripe checkout, and optimizing the website.

---

## 🎯 Priority 1: Stripe Checkout Integration

### Current State
- ✅ Product IDs mapped to pricing data
- ✅ Checkout session API exists (`api/stripe/create-checkout-session.ts`)
- ✅ Stripe context with `createCheckoutSession` function
- ⚠️ Price IDs are placeholders (need real Stripe price IDs)
- ⚠️ Need to connect checkout flow end-to-end

### Tasks
| # | Task | Status | Priority |
|---|------|--------|----------|
| 1.1 | Create prices in Stripe for each product (monthly/yearly) | Pending | High |
| 1.2 | Update `pricing.data.ts` with real price IDs | Pending | High |
| 1.3 | Verify checkout flow redirects to Stripe | Pending | High |
| 1.4 | Test success/cancel URL handling | Pending | Medium |
| 1.5 | Implement one-time payment checkout for add-on packages | Pending | High |

### Required Information from You
- **Price IDs** for each product (monthly and yearly intervals)
  - Format: `price_xxx` from Stripe Dashboard

---

## 🎨 Priority 2: Fix Broken Animations

### Current Issues
1. **Hero Rotating Words**: Uses `AnimatePresence` but animation may not be triggering properly
2. **Background Paths**: Animation exists but may be too subtle or not rendering
3. **Meteor Effect**: CSS animation exists but visibility may be affected

### Animation Comparison (Backup vs Main)

| Component | Backup Branch | Main Branch | Issue |
|-----------|---------------|-------------|-------|
| Hero.tsx | Simple motion.span with spring animation | AnimatePresence with variants | Animation logic changed |
| background-paths.tsx | 28-36 paths, pathOffset [0,1,0] | 16-20 paths, pathOffset [0,0.5,0] | Reduced paths, less dramatic animation |
| meteors.tsx | Identical | Identical | CSS animation dependency |

### Tasks
| # | Task | Status | Priority |
|---|------|--------|----------|
| 2.1 | Restore Hero rotating words animation from backup | Pending | High |
| 2.2 | Restore background-paths full animation range | Pending | High |
| 2.3 | Verify meteor animation CSS keyframes exist | Pending | Medium |
| 2.4 | Add prefers-reduced-motion fallbacks | Pending | Low |

---

## ⚡ Priority 3: Performance Optimization

### Benchmark Tasks
| # | Task | Status | Priority |
|---|------|--------|----------|
| 3.1 | Run Lighthouse benchmark | Pending | High |
| 3.2 | Analyze Core Web Vitals | Pending | High |
| 3.3 | Optimize images (WebP, responsive sizes) | Pending | Medium |
| 3.4 | Lazy load below-fold components | Pending | Medium |
| 3.5 | Bundle size analysis and optimization | Pending | Medium |

---

## 🔧 Priority 4: Code Quality & Enhancements

### Suggested Improvements
| # | Task | Rationale | Priority |
|---|------|-----------|----------|
| 4.1 | Add error boundaries for payment components | Prevent crashes during checkout | High |
| 4.2 | Implement toast notifications for checkout feedback | Better UX | Medium |
| 4.3 | Add loading states with skeleton components | Visual feedback | Medium |
| 4.4 | Implement retry logic for failed API calls | Resilience | Medium |
| 4.5 | Add analytics events for checkout funnel | Track conversions | Low |

---

## 📋 Next Steps Guide

### Immediate Actions Required From You
1. **Get Stripe Price IDs**
   - Go to Stripe Dashboard → Products
   - For each product, note the `price_xxx` IDs for monthly and yearly prices
   - Provide them in format:
     ```
     Starter Spark: monthly=price_xxx, yearly=price_yyy
     Brand Pulse: monthly=price_xxx, yearly=price_yyy
     ...etc
     ```

2. **Verify Environment Variables**
   Ensure these are set in Vercel:
   - `STRIPE_SECRET_KEY`
   - `STRIPE_PUBLISHABLE_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `DATABASE_URL`
   - `CLERK_SECRET_KEY`

### Suggested Deletions
- Remove duplicate/redundant documentation files if consolidation makes sense
- Clean up unused components after migration audit

### Suggested Additions
- Add Stripe webhook endpoint testing guide
- Add customer portal integration for subscription management
- Add invoice/receipt email templates

### Suggested Alterations
- Consolidate pricing data (Pricing.tsx has inline data, should use `pricing.data.ts`)
- Unify checkout flows between recurring and one-time purchases

---

## Execution Order

```
Phase 1: Animations (Now)
├── Fix Hero rotating words
├── Restore background paths
└── Verify meteor animations

Phase 2: Stripe Checkout (Waiting on price IDs)
├── Update price IDs
├── Test checkout flow
└── Add one-time payment support

Phase 3: Performance (After functionality confirmed)
├── Run benchmarks
├── Apply optimizations
└── Verify improvements

Phase 4: Polish (Final)
├── Add error handling
├── Add loading states
└── Final commit
```

---

*Generated: December 4, 2025*
