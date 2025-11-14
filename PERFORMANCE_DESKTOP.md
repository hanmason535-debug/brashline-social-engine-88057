# Desktop Performance Optimization Plan

**Branch:** `performance/desktop-res-90`  
**Target:** Desktop RES > 90 (currently 57)  
**Mobile RES:** Maintain ≥ 95 (currently 98)

---

## Current Desktop Metrics (Vercel Speed Insights - Last 24h)

| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| **RES** | 57 | > 90 | ❌ Needs Improvement |
| **FCP** | 3.05s | < 1.8s | ❌ Too Slow |
| **LCP** | 3.05s | < 1.8s | ❌ Too Slow |
| **INP** | 1,216ms | < 200ms | ❌ Critical Issue |
| **CLS** | 0.01 | < 0.1 | ✅ Good |
| **FID** | 2ms | < 100ms | ✅ Good |
| **TTFB** | 1.64s | < 0.8s | ⚠️ Needs Work |

---

## Diagnosis: Desktop-Specific Bottlenecks

### 1. **Critical: INP = 1,216ms** (Desktop interactions are SLOW)
**Root Causes:**
- `useParallax` hook fires on EVERY scroll event without throttling
- Multiple scroll listeners across components (Hero, CaseStudies stats bar)
- Heavy re-renders triggered by scroll interactions
- Carousel interactions with multiple state updates
- No debouncing on filter changes (CaseStudies page)

**Components Affected:**
- `src/pages/CaseStudies.tsx` - Parallax on hero + stats bar
- `src/hooks/useParallax.tsx` - No throttling/debouncing
- `src/components/ui/carousel.tsx` - Multiple state updates on interaction
- `src/pages/Index.tsx` - All sections use scroll-based hooks

### 2. **High FCP/LCP = 3.05s** (Desktop first paint is slow)
**Root Causes:**
- Heavy `BackgroundPaths` SVG animation (36 animated paths) in Hero
- Framer Motion animations block initial render
- Desktop loads ALL components synchronously on Index page
- Large hero section with complex animations renders immediately
- No desktop-specific lazy loading for below-fold content

**Components Affected:**
- `src/components/ui/background-paths.tsx` - 36 SVG paths with complex animations
- `src/components/home/Hero.tsx` - Heavy animation + BackgroundPaths
- `src/pages/Index.tsx` - All 4 major sections render immediately

### 3. **TTFB = 1.64s** (Server response is slow)
**Root Causes:**
- No static pre-rendering for landing page
- All context providers load synchronously
- No service worker caching

### 4. **Desktop vs Mobile Behavior**
**Desktop-Only Issues:**
- Larger viewport = more visible content = more initial renders
- Desktop CSS has more complex layouts (larger grids, shadows, filters)
- Desktop carousels show more items simultaneously
- Parallax effects only noticeable/meaningful on desktop
- Hover animations add interaction overhead

---

## Implementation Plan

### Phase 1: **CRITICAL - Fix INP** (Target: < 200ms)

#### A. Throttle Parallax Hook
- Add throttling to `useParallax` (60fps max = 16ms intervals)
- Use `requestAnimationFrame` for smooth updates
- Disable parallax on mobile entirely (not needed)

#### B. Optimize Scroll Listeners
- Consolidate scroll listeners into single handler
- Use passive event listeners
- Add will-change CSS hints for parallax elements

#### C. Debounce Interactive Updates
- Add debouncing to filter changes (CaseStudies)
- Optimize carousel state updates
- Memoize expensive callback handlers

---

### Phase 2: **Fix FCP/LCP** (Target: < 1.8s)

#### A. Simplify Hero for Desktop
- **Option 1:** Lazy-load BackgroundPaths (defer until after FCP)
- **Option 2:** Reduce BackgroundPaths complexity (36 → 12 paths for desktop)
- **Option 3:** Use static image background for initial render, swap to animated after load
- Remove non-critical animations from initial render

#### B. Code-Split Above-Fold
- Defer StatsSection (below fold)
- Defer PricingPreview (below fold)
- Load ValueProps lazily on Index page

#### C. Optimize Images
- Ensure all hero images use proper responsive attributes
- Add `fetchpriority="high"` to LCP image
- Use WebP with fallbacks

---

### Phase 3: **Reduce TTFB** (Target: < 0.8s)

#### A. Static Pre-rendering
- Configure Vercel to pre-render Index page
- Add ISR (Incremental Static Regeneration) if possible

#### B. Optimize Context Loading
- Split AppProviders to load only critical contexts initially
- Defer non-critical contexts (theme, language) after FCP

---

### Phase 4: **Desktop-Specific Optimizations**

#### A. Conditional Rendering
- Detect desktop viewport
- Disable mobile-specific optimizations on desktop
- Enable desktop-specific optimizations:
  - Larger images with better compression
  - Simplified animations for desktop
  - Reduced re-render frequency

#### B. CSS Performance
- Audit complex CSS (shadows, filters, gradients)
- Use `contain: layout paint` for isolated components
- Add `will-change` hints sparingly

---

## Changes Planned

### Files to Modify:

1. **`src/hooks/useParallax.tsx`** - Add throttling with RAF
2. **`src/hooks/useScrollAnimation.tsx`** - Optimize observer
3. **`src/components/ui/background-paths.tsx`** - Reduce complexity or lazy-load
4. **`src/components/home/Hero.tsx`** - Defer heavy animations
5. **`src/pages/Index.tsx`** - Add lazy loading for below-fold sections
6. **`src/pages/CaseStudies.tsx`** - Debounce filters, optimize parallax
7. **`src/components/ui/carousel.tsx`** - Optimize state updates
8. **`vite.config.ts`** - Add additional optimizations

### Files to Create:

1. **`src/hooks/useThrottle.ts`** - Reusable throttle hook
2. **`src/hooks/useMediaQuery.ts`** - Desktop/mobile detection
3. **`src/utils/performance.ts`** - Performance utilities

---

## Mobile Performance Preservation

### Guardrails:
- All changes wrapped in desktop-specific conditions
- Mobile optimizations remain untouched
- Test on mobile viewport after each change
- Monitor mobile RES stays ≥ 95

### Mobile-Specific Code to Preserve:
- Mobile carousel optimizations
- Mobile-first responsive images
- Touch-optimized interactions
- Mobile scroll performance

---

## Success Metrics

### Desktop Targets (After Implementation):
- ✅ RES: > 90 (from 57)
- ✅ FCP: < 1.8s (from 3.05s)
- ✅ LCP: < 1.8s (from 3.05s)
- ✅ INP: < 200ms (from 1,216ms)
- ✅ TTFB: < 0.8s (from 1.64s)

### Mobile Targets (Must Maintain):
- ✅ RES: ≥ 95 (currently 98)

---

## Implementation Order

1. ✅ Create branch `performance/desktop-res-90`
2. ✅ Document current state and plan (this file)
3. ✅ **Phase 1: Fix INP** (throttle parallax, optimize interactions)
   - ✅ Created `useThrottle.ts` hook for reusable throttling
   - ✅ Created `useMediaQuery.ts` hook for desktop/mobile detection  
   - ✅ Optimized `useParallax.tsx` with RAF throttling + passive listeners
   - ✅ Disabled parallax on mobile (not needed, saves performance)
   - ✅ Reduced BackgroundPaths SVG complexity (36 → 18 paths on desktop)
   - ✅ Added `will-change: transform` hints to parallax elements
   - ✅ Added CSS containment (`contain: layout style paint`) to Hero background
   - ✅ Lazy-loaded below-fold sections on Index page (ValueProps, StatsSection, PricingPreview)
   - ✅ All 99 tests passing
   - ✅ Production build successful
4. 🔄 Phase 2: Fix FCP/LCP (additional optimizations if needed)
5. ⏸️ Phase 3: Reduce TTFB (pre-rendering, context optimization)
6. ⏸️ Phase 4: Desktop-specific optimizations
7. ⏸️ Test and verify
8. ⏸️ Update documentation with results

---

## Phase 1 Results (Completed)

### Visual Regression Fix (Post-Deployment)

**Issue Identified:** Background appeared shifted/misaligned on initial page load on the performance branch compared to main.

**Root Cause:** The `useMediaQuery` hook was initializing with `useState(false)`, causing a **hydration mismatch and visual flash**:

1. Initial render: `useIsDesktop()` returns `false` (hardcoded initial state)
2. `BackgroundPaths` renders with 36 paths (mobile count)
3. `useEffect` runs after mount, detects desktop viewport
4. `useIsDesktop()` updates to `true`
5. `BackgroundPaths` re-renders with 18 paths (desktop count)

This transition from 36 → 18 paths after the first render caused a **visual flash/shift**.

**Fix Applied:**
- Updated `useMediaQuery.ts` to use intelligent initial value
- Uses `useState(() => getInitialMatches(query))` instead of `useState(false)`
- On client: Checks `window.matchMedia(query).matches` immediately
- On SSR: Defaults to desktop (most common viewport)
- **Result:** No hydration mismatch, no re-render, no visual flash

**Performance Impact:** Zero regression. All performance optimizations preserved:
- ✅ RAF throttling active
- ✅ Path reduction working (18 paths on desktop from first render)
- ✅ Lazy loading functional
- ✅ Desktop-only parallax active

---

### Changes Made:

**New Files:**
- `src/hooks/useThrottle.ts` - Reusable throttle utility hook
- `src/hooks/useMediaQuery.ts` - Desktop/mobile detection hooks (with proper SSR handling)

**Modified Files:**
- `src/hooks/useParallax.tsx` - Added RAF throttling, passive listeners, desktop-only mode
- `src/components/ui/background-paths.tsx` - Reduced path count on desktop (36 → 18)
- `src/hooks/useMediaQuery.ts` - **Fixed hydration mismatch** (visual regression fix)
- `src/pages/Index.tsx` - Lazy-loaded below-fold sections
- `src/pages/CaseStudies.tsx` - Added will-change hints to parallax transforms
- `src/tests/setup.ts` - Fixed matchMedia mock for tests
- `src/hooks/useParallax.test.tsx` - Updated tests for RAF timing

### Performance Improvements:

**INP Optimizations:**
- ✅ Scroll listeners now use `requestAnimationFrame` (60fps throttling)
- ✅ Passive event listeners reduce main thread blocking
- ✅ Parallax disabled on mobile (unnecessary overhead eliminated)
- ✅ Will-change hints enable GPU acceleration for transforms

**FCP/LCP Optimizations:**
- ✅ 50% reduction in SVG paths on desktop (36 → 18) 
- ✅ Below-fold content lazy-loaded (ValueProps, StatsSection, PricingPreview)
- ✅ CSS containment isolates background rendering
- ✅ Smaller initial bundle due to code splitting

### Test Results:
- ✅ 13/13 test files passing
- ✅ 99/99 tests passing (100%)
- ✅ No regressions

### Build Results:
- ✅ Build time: 25.38s
- ✅ Main bundle: 53.50 KB gzipped (down from 58.37 KB - 8.3% reduction)
- ✅ Total gzipped: ~170 KB (down from ~173 KB)

### Expected Impact:
- **INP:** Should improve from 1,216ms to < 400ms (67% improvement target)
- **FCP/LCP:** Should improve from 3.05s to < 2.5s (18% improvement minimum)
- **Mobile:** Should maintain RES ≥ 95 (parallax now disabled on mobile)

---

## Next Steps

### If Desktop RES reaches 80-85 (good progress but not 90+):
Continue to Phase 2 - Additional FCP/LCP optimizations

### If Desktop RES reaches 90+ (target met):
- Monitor Vercel Analytics for 24-48 hours
- Document final results
- Merge to main

---

## Notes

- **Priority:** INP > FCP/LCP > TTFB
- **Approach:** Surgical changes, not rewrites
- **Testing:** Lighthouse + Vercel Analytics after each phase
- **Rollback:** Each phase can be reverted independently

---

**Status:** 🔄 In Progress  
**Last Updated:** November 14, 2025  
**Next Step:** Implement Phase 1 - Fix INP
