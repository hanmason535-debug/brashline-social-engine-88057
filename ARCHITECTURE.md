# Brashline Social Engine - Architecture Documentation

## Overview

The Brashline Social Engine is a high-performance, bilingual (EN/ES) marketing website built with React, TypeScript, and modern web technologies. This document outlines the architectural decisions, patterns, and improvements implemented in Phase 3 optimization.

## Table of Contents

- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Core Architectural Patterns](#core-architectural-patterns)
- [Data Architecture](#data-architecture)
- [Performance Optimizations](#performance-optimizations)
- [Testing Strategy](#testing-strategy)
- [Accessibility](#accessibility)

---

## Technology Stack

### Core Technologies
- **React 18.3.1** - UI library with concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Animations and transitions

### Key Libraries
- **React Router** - Client-side routing
- **Embla Carousel** - Touch-friendly carousels
- **Lucide React** - Icon system
- **Vitest** - Unit testing framework
- **@testing-library/react** - Component testing utilities

---

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── home/           # Homepage-specific components
│   ├── layout/         # Layout components (Header, Footer)
│   ├── SEO/            # SEO utilities
│   ├── ui/             # shadcn/ui components
│   └── work/           # Case studies components
├── contexts/           # React Context providers
│   └── LanguageContext.tsx
├── data/               # Static data modules (Phase 3.1)
│   ├── about.data.ts
│   ├── blog.data.ts
│   ├── pricing.data.ts
│   └── services.data.ts
├── hooks/              # Custom React hooks
│   ├── useAbout.ts
│   ├── useBlog.ts
│   ├── useCountUp.tsx
│   ├── use-mobile.tsx
│   ├── useParallax.tsx
│   ├── usePricing.ts
│   ├── useScrollAnimation.tsx
│   └── useServices.ts
├── lib/                # Utility libraries
│   ├── sitemap-generator.ts
│   └── utils.ts
├── pages/              # Route-level page components
│   ├── About.tsx
│   ├── Blog.tsx
│   ├── CaseStudies.tsx
│   ├── Contact.tsx
│   ├── Index.tsx
│   ├── NotFound.tsx
│   ├── Pricing.tsx
│   ├── Services.tsx
│   └── [legal pages]
├── utils/              # Helper utilities
│   └── seo.ts
├── App.tsx             # Root application component
└── main.tsx            # Application entry point
```

---

## Core Architectural Patterns

### 1. Data Extraction Pattern (Phase 3.1)

**Problem:** Large page components with embedded data made code hard to maintain and test.

**Solution:** Extract static data into dedicated modules with localization support.

```typescript
// Before: Data embedded in component
const Services = () => {
  const services = [
    { title: { en: "...", es: "..." }, ... },
    // ... 50+ lines of data
  ];
  return <div>...</div>;
};

// After: Data extracted to module
// src/data/services.data.ts
export const servicesData = {
  services: [
    { titleKey: "social_media_mgmt", ... },
  ],
  translations: { ... }
};

// Component becomes clean
const Services = () => {
  const { services } = useServices(lang);
  return <div>...</div>;
};
```

**Benefits:**
- ✅ Single source of truth for data
- ✅ Easier to test (mock data separately)
- ✅ Improved maintainability
- ✅ Better separation of concerns

### 2. Custom Hooks Pattern

**Purpose:** Encapsulate data logic, memoization, and localization in reusable hooks.

#### Data Hooks (Phase 3.1)
```typescript
// useServices.ts
export const useServices = (lang: 'en' | 'es'): ServiceResult => {
  return useMemo(() => {
    const services = servicesData.services.map(service => ({
      title: service.title[lang],
      description: service.description[lang],
      // ... other localized fields
    }));
    
    return { services, categories };
  }, [lang]);
};
```

#### Animation Hooks
```typescript
// useScrollAnimation.tsx - IntersectionObserver wrapper
export const useScrollAnimation = (options = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(/* ... */);
    // ... setup logic
    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce]);
  
  return { elementRef, isVisible };
};

// useParallax.tsx - Scroll parallax effect
export const useParallax = ({ speed = 0.5, direction = 'up' }) => {
  const [offset, setOffset] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const multiplier = direction === 'up' ? -1 : 1;
      setOffset(scrolled * speed * multiplier);
    };
    // ... scroll listener
  }, [speed, direction]);
  
  return offset;
};
```

### 3. Component Memoization Pattern (Phase 3.1)

**When to Memoize:**
- ✅ Components with complex calculations
- ✅ Components receiving stable props
- ✅ Frequently re-rendered components
- ❌ Simple presentational components
- ❌ Components with frequently changing props

```typescript
// Memoized components
export const Header = memo(() => { /* ... */ });
export const PricingPreview = memo(({ lang }: Props) => { /* ... */ });

// Set display name for debugging
Header.displayName = 'Header';
PricingPreview.displayName = 'PricingPreview';
```

### 4. Callback Optimization Pattern

```typescript
// useCallback for stable function references
const openLightbox = useCallback((type, data) => {
  setLightboxData({ type, data });
  setLightboxOpen(true);
}, []); // No dependencies = stable reference

// Pass to child components without causing re-renders
<WebsiteProjectCard onOpenLightbox={() => openLightbox("website", project)} />
```

---

## Data Architecture

### Localization System

**Two-tier translation approach:**

1. **Inline translations** - Simple, component-specific text
```typescript
const text = lang === "en" ? "Services" : "Servicios";
```

2. **Data module translations** - Complex, reusable content
```typescript
// data/services.data.ts
export const servicesData = {
  services: [
    {
      titleKey: "social_media_mgmt",
      title: {
        en: "Social Media Management",
        es: "Gestión de Redes Sociales"
      },
      // ...
    }
  ]
};
```

### Data Flow Diagram

```
┌─────────────────┐
│  Data Modules   │
│  (static data)  │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  Custom Hooks   │
│  (localization) │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│   Components    │
│   (rendering)   │
└─────────────────┘
```

---

## Performance Optimizations

### Phase 3.1 Improvements

1. **Component Memoization**
   - 6 components memoized: `Header`, `Footer`, `Hero`, `ValueProps`, `PricingPreview`, `StatsSection`
   - Prevents unnecessary re-renders on language/theme changes

2. **Custom Hook Memoization**
   - All data hooks use `useMemo` to cache computed results
   - Recalculate only when `lang` changes

3. **Callback Stabilization**
   - 2 callbacks optimized with `useCallback`
   - Stable function references passed to child components

4. **Data Extraction**
   - Reduced component size by 30-50%
   - Faster initial parse and hydration

### Bundle Analysis (Phase 3.3)

```
Optimized chunk sizes:
- carousel.js:           24.64 kB (gzipped: 9.81 kB)
- index.js:             187.40 kB (gzipped: 58.38 kB)
- react-vendor.js:      162.87 kB (gzipped: 53.28 kB)
- animation-vendor.js:  117.05 kB (gzipped: 38.66 kB)
```

**Code Splitting Strategy:**
- Vendor chunks separated (React, animation libraries)
- Route-based code splitting via React Router
- UI components bundled in separate vendor chunk

---

## Testing Strategy

### Coverage Goals (Phase 3.2)

- **Target:** 70%+ statement coverage ✅ **Achieved: 81.15%**
- **Test Count:** 105 tests across 14 test files
- **Pass Rate:** 100% (105/105 passing)

### Test Architecture

```
src/
├── hooks/
│   ├── useServices.ts
│   ├── useServices.test.ts      ← Hook tests
│   ├── usePricing.ts
│   ├── usePricing.test.ts       ← Hook tests
│   └── ...
├── components/
│   ├── ui/button.tsx
│   ├── ui/button.test.tsx       ← Component tests
│   └── ...
└── pages/
    ├── Index.tsx
    └── Index.test.tsx             ← Page tests
```

### Testing Patterns

**1. Hook Testing**
```typescript
import { renderHook } from '@testing-library/react';
import { useServices } from './useServices';

it('should return localized services', () => {
  const { result } = renderHook(() => useServices('en'));
  
  expect(result.current.services).toHaveLength(9);
  expect(result.current.services[0].title).toBe('Social Media Management');
});
```

**2. Component Testing**
```typescript
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

it('should render header with navigation', () => {
  render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>
  );
  
  expect(screen.getByRole('navigation')).toBeInTheDocument();
});
```

**3. Snapshot Testing**
```typescript
it('should match snapshot', () => {
  const { container } = render(<PricingCard {...props} />);
  expect(container).toMatchSnapshot();
});
```

---

## Accessibility

### WCAG 2.1 AA Compliance

#### Phase 3.3 Enhancements

**1. Keyboard Navigation**
- ✅ Skip to content link (visible on focus)
- ✅ Escape key closes mobile menu
- ✅ Focus trap in mobile menu
- ✅ Focus returns to trigger button on close

```typescript
// Header.tsx - Keyboard navigation
useEffect(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && mobileMenuOpen) {
      setMobileMenuOpen(false);
      menuButtonRef.current?.focus(); // Return focus
    }
  };
  
  if (mobileMenuOpen) {
    document.addEventListener('keydown', handleEscape);
    // Auto-focus first link
    setTimeout(() => {
      mobileMenuRef.current?.querySelector('a')?.focus();
    }, 100);
  }
  
  return () => {
    document.removeEventListener('keydown', handleEscape);
  };
}, [mobileMenuOpen]);
```

**2. ARIA Attributes**
```typescript
<Button
  aria-expanded={mobileMenuOpen}
  aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
>
  {/* ... */}
</Button>

<div
  role="dialog"
  aria-modal="true"
  aria-label="Mobile navigation"
>
  {/* ... */}
</div>
```

**3. Semantic HTML**
- Proper heading hierarchy (h1 → h2 → h3)
- `<nav>` for navigation regions
- `<main>` for main content
- `<header>` and `<footer>` landmarks

**4. Focus Management**
- Visible focus indicators (ring styles)
- Logical tab order
- Body scroll lock when modals open
- No keyboard traps

---

## UX Enhancements (Phase 3.3)

### Carousel Improvements

**1. Enhanced Navigation Buttons**
```typescript
// Before: Small, hidden on mobile
<CarouselPrevious className="hidden md:flex h-8 w-8" />

// After: Larger, always visible, better feedback
<CarouselPrevious className="h-12 w-12 shadow-lg hover:scale-110" />
```

**2. Progress Dots**
```typescript
export const CarouselDots = () => {
  const { api } = useCarousel();
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  return (
    <div className="flex justify-center gap-2 mt-4">
      {scrollSnaps.map((_, index) => (
        <button
          className={cn(
            "h-2 rounded-full transition-all",
            index === selectedIndex ? "w-8 bg-primary" : "w-2 bg-muted"
          )}
          onClick={() => api?.scrollTo(index)}
        />
      ))}
    </div>
  );
};
```

**3. Swipe Indicator (Mobile)**
- Auto-shows on mount
- Fades after 3 seconds
- Hidden on desktop (`md:hidden`)

### Spacing Standards

**Consistent vertical rhythm:**
- Hero sections: `py-20`
- Content sections: `py-16 md:py-24`
- Sub-sections: `py-12`
- Containers: `px-4`

---

## SEO Architecture

### Meta Tags System

```typescript
// utils/seo.ts
export const getPageSEO = (pageKey: string) => {
  return seoConfig[pageKey] || seoConfig.home;
};

// Used in pages
<SEOHead pageSEO={getPageSEO("services")} lang={lang} />
```

### Sitemap Generation

```javascript
// scripts/generate-sitemap.js
const routes = [
  '/',
  '/services',
  '/pricing',
  // ... all routes
];

// Generates sitemap.xml at build time
```

### robots.txt

```
User-agent: *
Allow: /
Sitemap: https://brashline.com/sitemap.xml
```

---

## Future Improvements

### Potential Optimizations

1. **React Server Components** (when available)
   - Server-side rendering for better SEO
   - Reduced bundle size

2. **Image Optimization**
   - WebP format with fallbacks
   - Responsive images with srcset
   - Lazy loading improvements

3. **Code Splitting**
   - Route-level lazy loading (already implemented)
   - Component-level lazy loading for heavy components

4. **Internationalization**
   - i18n library integration (currently custom)
   - More languages support
   - Date/number formatting

5. **State Management**
   - Consider Zustand/Jotai for complex state
   - Currently uses Context API (sufficient)

---

## Metrics & Goals

### Quality Score Progress

| Metric | Before Phase 3 | After Phase 3 | Target |
|--------|---------------|---------------|---------|
| Test Coverage | ~40% | **81.15%** | 70%+ |
| Test Count | 44 | **105** | 80+ |
| Accessibility | Basic | **WCAG AA** | WCAG AA |
| Performance | Good | **Optimized** | Excellent |
| Code Quality | 7.9/10 | **~8.5/10** | 8.5-9.0/10 |

### Phase 3 Achievements

- ✅ **Phase 3.1:** Foundation improvements (architecture, data extraction, memoization)
- ✅ **Phase 3.2:** Testing expansion (61 new tests, 81%+ coverage)
- ✅ **Phase 3.3:** UX polish (carousels, accessibility, spacing)
- ⏳ **Phase 3.4:** Documentation (this file + COMPONENTS.md, TESTING.md, PERFORMANCE.md)
- ⏳ **Phase 3.5:** Final verification

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines and code standards.

## Additional Documentation

- [COMPONENTS.md](./COMPONENTS.md) - Component API documentation
- [TESTING.md](./TESTING.md) - Testing guidelines and patterns
- [PERFORMANCE.md](./PERFORMANCE.md) - Performance optimization guide

---

**Last Updated:** November 14, 2025  
**Version:** Phase 3.4  
**Maintainers:** Brashline Development Team
