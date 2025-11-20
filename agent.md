# Agent Guide for Brashline Social Engine

> **Last Updated:** November 20, 2025  
> **Project:** Brashline Social Media Marketing Website  
> **Tech Stack:** React 18 + TypeScript 5.8 + Vite 6 + Tailwind CSS 3.4

---

## 🎯 Project Overview

**Brashline Social Engine** is a production-grade marketing website for a Florida-based social media management agency. The project emphasizes **type safety**, **performance**, **accessibility**, and **bilingual support** (English/Spanish).

### Core Mission
- **Professional**: Production-ready code with 170+ passing tests
- **Performant**: 58KB gzipped bundle, 95+ Lighthouse score
- **Accessible**: WCAG 2.1 AA compliant with automated testing
- **Bilingual**: Full English/Spanish support via context API
- **SEO-Optimized**: Dynamic meta tags, sitemap, structured data

### Key Metrics
- **Tests:** 170 passing (Vitest + Testing Library + jest-axe)
- **Bundle Size:** 186 KB raw → 58 KB gzipped
- **TypeScript:** Strict mode enabled, zero `any` types
- **ESLint:** Zero errors
- **Code Quality:** 7.5/10 (up from 5.5/10)

---

## 🏗️ Architecture

### Tech Stack
```
Frontend:       React 18.3.1 (functional components, hooks, memo)
Language:       TypeScript 5.8.3 (strict mode, no implicit any)
Build Tool:     Vite 6.1.7 (SWC for React transforms)
Styling:        Tailwind CSS 3.4.17 + CSS variables for theming
UI Components:  shadcn/ui (Radix UI primitives)
Animations:     Framer Motion 12.23.24
Routing:        React Router 6.30.1 (v7 future flags enabled)
State:          Context API (Language, Theme) + TanStack Query
Testing:        Vitest 4.0.8 + Testing Library + jest-axe
Analytics:      GA4 (G-D614DSBGX5) + GTM (GTM-MCDBXPNS)
Deployment:     Vercel (with Analytics + Speed Insights)
```

### Project Structure
```
d:\Brashline\brashline-social-engine-88057\
├── src/
│   ├── components/
│   │   ├── home/           # Homepage sections (Hero, ValueProps, PricingPreview)
│   │   ├── layout/         # Header, Footer, RootLayout wrapper
│   │   ├── SEO/            # SEO components (ReviewSchema, SEOHead)
│   │   ├── ui/             # shadcn/ui components (50+ components)
│   │   ├── work/           # Portfolio/case studies components
│   │   └── forms/          # Contact forms with validation
│   ├── contexts/           # React contexts (LanguageContext.tsx)
│   ├── data/               # Static data files (services, pricing, blog, etc.)
│   ├── hooks/              # Custom React hooks (15+ hooks)
│   ├── lib/                # Utilities (analytics, constants, utils, sitemap)
│   ├── pages/              # Route pages (Index, About, Services, Contact, etc.)
│   ├── tests/              # Test setup and utilities
│   └── utils/              # Helper functions (sanitizer, SEO utils)
├── public/                 # Static assets (images, robots.txt)
├── scripts/                # Build scripts (sitemap generator, prerender)
├── index.html              # Root HTML (GA4 + GTM integration)
├── vite.config.ts          # Vite configuration
├── tailwind.config.ts      # Tailwind + design tokens
├── tsconfig.json           # TypeScript strict configuration
└── package.json            # Dependencies and scripts
```

---

## 📋 Critical Conventions

### 1. TypeScript Strict Mode
**Configuration:** `tsconfig.json`
```json
{
  "noImplicitAny": true,
  "strictNullChecks": true,
  "noUnusedLocals": true,
  "noUnusedParameters": true,
  "skipLibCheck": true
}
```

**Rules:**
- ❌ **NEVER** use `any` type - use proper types or `unknown`
- ✅ Always define interfaces for props and state
- ✅ Use type guards for conditional logic
- ✅ Leverage `as const` for literal types
- ✅ Import types with `import type { ... }`

**Example:**
```typescript
// ❌ Bad
function processData(data: any) { ... }

// ✅ Good
interface DataItem {
  id: string;
  value: number;
}
function processData(data: DataItem[]): void { ... }
```

---

### 2. File Headers (Mandatory)
**Every TypeScript file MUST have a JSDoc comment header:**

```typescript
/**
 * File overview: [file path relative to src/]
 *
 * [Classification: Component | Hook | Utility | Data | Context | Page]
 * Behavior:
 * - [Brief description of primary responsibility]
 * - [Key side effects or state management]
 * Assumptions:
 * - [Important invariants or preconditions]
 * Performance:
 * - [Notable optimizations or considerations]
 */
```

**Examples:**

**Component:**
```typescript
/**
 * File overview: src/components/home/Hero.tsx
 *
 * React component `Hero` rendering a focused piece of UI.
 * Behavior:
 * - Receives props from parents and may read from hooks or context.
 * - Renders presentational markup and wires callbacks for user interaction.
 * Data flow:
 * - Follows a one-way data flow: parents own data, this component focuses on display.
 * Performance:
 * - Avoid expensive work during render and prefer memoized helpers for heavy subtrees.
 */
```

**Hook:**
```typescript
/**
 * File overview: src/hooks/useScrollAnimation.tsx
 *
 * Custom React hook for scroll-based animations.
 * Behavior:
 * - Tracks scroll position using IntersectionObserver
 * - Returns animation state for Framer Motion
 * Assumptions:
 * - Component using this hook is mounted in the DOM
 * Performance:
 * - Uses passive event listeners and requestAnimationFrame
 */
```

**Utility:**
```typescript
/**
 * File overview: src/lib/constants.ts
 *
 * Library / utility helpers shared across the app.
 * Behavior:
 * - Provides pure or side-effect-aware functions with clear, reusable contracts.
 * Assumptions:
 * - Callers respect input contracts and handle error cases where documented.
 * Performance:
 * - Keep helpers small and composable to avoid hidden complexity in call sites.
 */
```

---

### 3. Component Patterns

#### A. React.memo for Pure Components
```typescript
import { memo } from "react";

interface HeroProps {
  lang: "en" | "es";
}

const Hero = memo(({ lang }: HeroProps) => {
  // Component logic
  return <section>...</section>;
});

Hero.displayName = 'Hero';
export default Hero;
```

#### B. Hooks Before JSX
```typescript
const Component = () => {
  // 1. Hooks first
  const { lang } = useLanguage();
  const [state, setState] = useState(false);
  
  // 2. Memoization
  const items = useMemo(() => computeItems(lang), [lang]);
  
  // 3. Effects
  useEffect(() => { ... }, []);
  
  // 4. Render
  return <div>...</div>;
};
```

#### C. Props Interface First
```typescript
// Define props interface before component
interface CardProps {
  title: string;
  description?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

const Card = ({ title, description, onClick, children }: CardProps) => {
  // Implementation
};
```

---

### 4. Constants and Data Management

#### Central Constants File: `src/lib/constants.ts`
```typescript
export const STORAGE_KEYS = {
  LANGUAGE: 'brashline-language',
  THEME: 'brashline-theme',
} as const;

export const SUPPORTED_LANGUAGES = ['en', 'es'] as const;
export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

export const CONTACT_INFO = {
  PHONE: '+1-929-446-8440',
  WHATSAPP: 'https://wa.me/19294468440',
  EMAIL: 'Brashline@gmail.com',
} as const;

export const SOCIAL_LINKS = {
  FACEBOOK: 'https://www.facebook.com/profile.php?id=61583138566921',
  INSTAGRAM: 'https://www.instagram.com/brashlineofficial/',
  TWITTER: 'https://x.com/brashlinex?s=11',
  LINKEDIN: 'https://www.linkedin.com/company/brashline',
} as const;
```

**Rules:**
- ❌ **NO** magic strings in components
- ✅ Define constants in `src/lib/constants.ts`
- ✅ Use `as const` for type-safe object literals
- ✅ Extract repeated values into named constants

---

### 5. Internationalization (i18n)

#### Language Context Pattern
```typescript
import { useLanguage } from "@/contexts/LanguageContext";

const Component = () => {
  const { lang, setLang } = useLanguage();
  
  return (
    <div>
      <h1>{lang === "en" ? "Title" : "Título"}</h1>
      <button onClick={() => setLang("es")}>Switch Language</button>
    </div>
  );
};
```

#### Data Files with i18n
```typescript
export const SERVICES_DATA: Service[] = [
  {
    id: 'social-media',
    icon: Share2,
    title: {
      en: 'Social Media Management',
      es: 'Gestión de Redes Sociales',
    },
    description: {
      en: 'Consistent, on-brand posting...',
      es: 'Publicación y engagement constante...',
    },
  },
];
```

---

### 6. Styling with Tailwind

#### Design System Variables
Located in `src/index.css`:
```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --primary-light: 214 100% 50%;
  --primary-glow: 214 100% 70%;
  /* ...more tokens */
}
```

#### Utility Classes Pattern
```typescript
// ✅ Good: Semantic, responsive, themeable
<div className="container mx-auto px-4 py-24 md:py-32">
  <h1 className="text-4xl md:text-6xl font-heading font-bold text-foreground">
    Title
  </h1>
</div>

// ❌ Bad: Hardcoded colors, no responsiveness
<div style={{ padding: '96px 16px', color: '#1a1a1a' }}>
  <h1 style={{ fontSize: '48px', fontWeight: 'bold' }}>
    Title
  </h1>
</div>
```

#### Custom Animations (Tailwind Config)
```typescript
// tailwind.config.ts
keyframes: {
  "fade-in": {
    "0%": { opacity: "0", transform: "translateY(10px)" },
    "100%": { opacity: "1", transform: "translateY(0)" },
  },
  "border-beam": {
    "0%": { "offset-distance": "0%" },
    "100%": { "offset-distance": "100%" },
  },
},
animation: {
  "fade-in": "fade-in 0.6s ease-out",
  "border-beam": "border-beam calc(var(--duration)*1s) infinite linear",
}
```

---

### 7. Animation Guidelines

#### Framer Motion Patterns
```typescript
import { motion } from "framer-motion";

// Spring-based animation (preferred for Hero)
<motion.span
  initial={{ opacity: 0, y: -100 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{
    type: "spring",
    stiffness: 50,
  }}
>
  {text}
</motion.span>

// Duration-based animation
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.6, ease: "easeOut" }}
>
  {children}
</motion.div>
```

**Performance:**
- ✅ Use `transform` and `opacity` (GPU-accelerated)
- ✅ Add `style={{ contain: 'layout' }}` for layout containment
- ✅ Prefer spring animations for organic feel
- ❌ Avoid animating `width`, `height`, `top`, `left` (layout thrash)

---

### 8. Testing Standards

#### Test File Structure
```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Component from './Component';

describe('Component', () => {
  it('renders with required props', () => {
    render(<Component lang="en" />);
    expect(screen.getByRole('heading')).toBeInTheDocument();
  });
  
  it('handles user interaction', async () => {
    const handleClick = vi.fn();
    render(<Component onClick={handleClick} />);
    
    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledOnce();
  });
});
```

#### Accessibility Testing
```typescript
import { axe } from 'vitest-axe';

it('has no accessibility violations', async () => {
  const { container } = render(<Component />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

#### Test Mocks (setup.ts)
- ✅ Framer Motion mocked to plain DOM elements
- ✅ LanguageContext mocked to return `{ lang: 'en', setLang: vi.fn() }`
- ✅ BackgroundPaths mocked to test double
- ✅ SEO components mocked to null
- ✅ IntersectionObserver, ResizeObserver, matchMedia shimmed

---

### 9. Analytics Integration

#### GA4 Event Tracking
```typescript
import { analytics } from "@/lib/analytics";

// Track CTA click
analytics.trackCTA('Book Call', 'Hero Section');

// Track form submission
analytics.trackContactFormSubmit('Website Design');

// Track navigation
analytics.trackNavigation('/services', '/contact');
```

#### Available Analytics Methods
```typescript
export const analytics = {
  init: () => void,                          // Initialize GA4 + capture UTM
  trackCTA: (label, location) => void,       // CTA interactions
  trackContactFormStart: () => void,         // Form engagement
  trackContactFormSubmit: (service?) => void,
  trackContactFormError: (error) => void,
  trackLightboxOpen: (type, id) => void,     // Lightbox interactions
  trackLightboxClose: (type) => void,
  trackNavigation: (from, to) => void,       // Page navigation
  trackPricingView: (plan) => void,          // Pricing interactions
  trackPricingCTA: (plan, price) => void,
  trackLanguageSwitch: (from, to) => void,   // Settings changes
  trackThemeSwitch: (theme) => void,
};
```

**Analytics IDs:**
- **GA4:** `G-D614DSBGX5`
- **GTM:** `GTM-MCDBXPNS`

---

### 10. Error Handling

#### LocalStorage Wrapper Pattern
```typescript
// ❌ Bad: Direct localStorage access
const theme = localStorage.getItem('theme');

// ✅ Good: Try-catch wrapper
const getStoredTheme = (): string | null => {
  try {
    return localStorage.getItem(STORAGE_KEYS.THEME);
  } catch (error) {
    console.error('Failed to access localStorage:', error);
    return null;
  }
};
```

#### Console Logs
```typescript
// Development-only logs
if (import.meta.env.DEV) {
  console.log('Debug info:', data);
}

// Production error logs (essential only)
try {
  // risky operation
} catch (error) {
  console.error('Critical error:', error);
}
```

---

### 11. Performance Optimization

#### Code Splitting (Vite Config)
```typescript
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'react-vendor': ['react', 'react-dom', 'react-router-dom'],
        'ui-vendor': ['@radix-ui/react-accordion', '@radix-ui/react-dialog'],
        'animation-vendor': ['framer-motion', '@tsparticles/react'],
      },
    },
  },
  chunkSizeWarningLimit: 1000,
  minify: 'esbuild',
}
```

#### Lazy Loading Routes
```typescript
import { lazy, Suspense } from 'react';

const About = lazy(() => import('./pages/About'));

<Suspense fallback={<Loading />}>
  <About />
</Suspense>
```

#### Image Optimization
```typescript
// Use WebP with PNG fallback
<picture>
  <source type="image/webp" srcSet="/images/logo.webp" />
  <img src="/logo.png" alt="Logo" loading="lazy" />
</picture>
```

---

### 12. Git Workflow

#### Branch Strategy
- **`main`** - Production branch (protected)
- **`backup/pre-main-sync-YYYYMMDD`** - Backup branches before major merges
- **Feature branches** - Named descriptively (`feat/hero-animation`, `fix/gtm-security`)

#### Commit Message Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

**Example:**
```
feat(hero): sync Hero with backup branch and fix index.html security issues

- Revert Hero to backup/pre-main-sync-20251119 structure
  - Use spring animation (stiffness: 50) instead of cubic-bezier
  - Vertical flex-col layout with 'Be' above rotating words
  
- Fix index.html security and optimization issues
  - Replace GTM placeholder ID (GTM-XXXXXXX) with real ID (GTM-MCDBXPNS)
  - Retain GA4 tracking (G-D614DSBGX5) for analytics

Security audit completed: no hardcoded API keys or secrets found
```

---

## 🔐 Security Best Practices

### 1. No Hardcoded Secrets
```typescript
// ❌ Bad
const API_KEY = 'sk_live_123456789';

// ✅ Good
const API_KEY = import.meta.env.VITE_API_KEY;
```

### 2. Environment Variables
```env
# .env.example (safe to commit)
VITE_SITE_URL=https://brashline.com
VITE_ENABLE_ANALYTICS=false

# .env.local (gitignored)
VITE_API_KEY=actual_secret_key
```

### 3. Content Security Policy
Production CSP in `vercel.json`:
```json
{
  "headers": [
    {
      "key": "Content-Security-Policy",
      "value": "default-src 'self'; script-src 'self' https://www.googletagmanager.com; ..."
    }
  ]
}
```

### 4. Input Sanitization
```typescript
import DOMPurify from 'dompurify';

const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(input, { 
    ALLOWED_TAGS: [], 
    ALLOWED_ATTR: [] 
  });
};
```

---

## 📦 Build and Deployment

### Build Scripts
```bash
# Development build
npm run build:dev

# Production build (includes sitemap generation + prerendering)
npm run build
# Runs: generate-sitemap.js → vite build → prerender.js

# Preview production build
npm run preview
```

### Build Output
```
dist/
├── index.html                    # Main entry point
├── assets/
│   ├── index-[hash].js          # Main bundle (186 KB → 58 KB gzipped)
│   ├── react-vendor-[hash].js   # React chunks (163 KB → 53 KB gzipped)
│   ├── animation-vendor-[hash].js # Framer Motion (117 KB → 39 KB gzipped)
│   └── ui-vendor-[hash].js      # Radix UI (44 KB → 16 KB gzipped)
├── sitemap.xml                   # Auto-generated sitemap
└── robots.txt                    # Search engine directives
```

### Vercel Deployment
1. Push to `main` branch
2. Vercel auto-deploys via GitHub integration
3. Environment variables configured in Vercel dashboard
4. Analytics automatically enabled via `@vercel/analytics`

---

## 🐛 Common Pitfalls and Solutions

### 1. Hero Animation Issues
**Problem:** Rotating words layout broken or out of position

**Solution:** Hero should use **vertical flex-col layout** with **spring animation**:
```typescript
<div className="flex flex-col items-center">
  <div>{lang === "en" ? "Be" : "Siempre"}</div>
  <span
    className="relative flex w-full justify-center overflow-hidden text-center"
    style={{ contain: 'layout' }}
  >
    {titles.map((title, index) => (
      <motion.span
        key={index}
        className="absolute font-bold"
        initial={{ opacity: 0, y: -100 }}
        transition={{ type: "spring", stiffness: 50 }}
        animate={
          titleNumber === index
            ? { y: 0, opacity: 1 }
            : { y: titleNumber > index ? -150 : 150, opacity: 0 }
        }
      >
        {title}
      </motion.span>
    ))}
  </span>
</div>
```

**Reference Branch:** `backup/pre-main-sync-20251119`

---

### 2. Test Failures
**Problem:** Tests fail with "gtag not available" or "motion() is deprecated"

**Solution:** These are warnings, not errors. Tests mock Framer Motion and GA4:
- Motion warnings are expected (using deprecated API intentionally for test stability)
- GA4 warnings are from mock environment (production uses real gtag)

**Check:** Run `npm run test -- --run` to see if tests pass despite warnings.

---

### 3. TypeScript Errors
**Problem:** `'any' type is not allowed` or `Property does not exist`

**Solution:**
```typescript
// ❌ Bad
const data: any = fetchData();

// ✅ Good - Define proper type
interface FetchResult {
  id: string;
  items: Item[];
}
const data: FetchResult = fetchData();

// ✅ Good - Use type guard
function isError(value: unknown): value is Error {
  return value instanceof Error;
}
```

---

### 4. Accessibility Violations
**Problem:** Axe test failures for missing labels, low contrast, or heading order

**Common Fixes:**
```typescript
// ❌ Bad: Button without accessible name
<button onClick={handleClick}>
  <Icon />
</button>

// ✅ Good: aria-label provided
<button onClick={handleClick} aria-label="Open menu">
  <Icon />
</button>

// ❌ Bad: Nested interactive elements
<button>
  <a href="/contact">Contact</a>
</button>

// ✅ Good: Single interactive element
<a href="/contact" role="button">
  Contact
</a>
```

---

### 5. Bundle Size Issues
**Problem:** Chunk size exceeds warning limit (1000 KB)

**Solution:** Check manual chunks configuration in `vite.config.ts`:
```typescript
manualChunks: {
  'react-vendor': ['react', 'react-dom', 'react-router-dom'],
  'ui-vendor': ['@radix-ui/react-accordion', ...],
  'animation-vendor': ['framer-motion', ...],
}
```

**Analyze:** Use `npm run build` and check console for chunk sizes.

---

## 🔧 Development Workflow

### Starting Development
```bash
# 1. Install dependencies
npm install

# 2. Configure Python environment (if needed)
# Handled automatically by VS Code

# 3. Start dev server
npm run dev
# Opens on http://localhost:8080

# 4. Run tests in watch mode
npm test
```

### Making Changes
1. **Create feature branch** from `main`
2. **Make changes** following conventions above
3. **Run tests:** `npm test -- --run`
4. **Run linter:** `npm run lint`
5. **Format code:** `npm run format`
6. **Commit** with descriptive message
7. **Push** and create PR

### Before Committing
```bash
# Run full test suite
npm run test -- --run

# Check for linting errors
npm run lint

# Format code
npm run format

# Check TypeScript types
npx tsc --noEmit
```

---

## 📚 Key Files Reference

### Critical Configuration Files
| File | Purpose | Notes |
|------|---------|-------|
| `vite.config.ts` | Build configuration | Manual chunks, CSP headers, test setup |
| `tailwind.config.ts` | Design system | Colors, animations, typography |
| `tsconfig.json` | TypeScript strict mode | No implicit any, strict null checks |
| `eslint.config.js` | Linting rules | React hooks, TypeScript rules |
| `index.html` | Root HTML | GA4 + GTM integration, fonts |
| `.env.example` | Environment template | VITE_SITE_URL, VITE_ENABLE_ANALYTICS |

### Core Library Files
| File | Exports | Purpose |
|------|---------|---------|
| `src/lib/constants.ts` | STORAGE_KEYS, CONTACT_INFO, SOCIAL_LINKS | Centralized constants |
| `src/lib/analytics.ts` | `analytics` object | GA4 event tracking |
| `src/lib/utils.ts` | `cn()` | Class name merging utility |
| `src/lib/sitemap-generator.ts` | APP_ROUTES | Route configuration for sitemap |

### Context Files
| File | Provider | Hook |
|------|----------|------|
| `src/contexts/LanguageContext.tsx` | `<LanguageProvider>` | `useLanguage()` |

### Data Files
| File | Data | Type |
|------|------|------|
| `src/data/services.data.ts` | SERVICES_DATA | Service[] |
| `src/data/pricing.data.ts` | PRICING_DATA | PricingPlan[] |
| `src/data/blog.data.ts` | BLOG_DATA | BlogPost[] |
| `src/data/about.data.ts` | ABOUT_DATA | AboutSection[] |

---

## 🎨 Design Tokens

### Colors (CSS Variables)
```css
/* Primary Brand */
--primary: 222.2 47.4% 11.2%;           /* Dark blue */
--primary-light: 214 100% 50%;          /* Bright blue */
--primary-glow: 214 100% 70%;           /* Light blue glow */

/* Semantic */
--background: 0 0% 100%;                /* White (light mode) */
--foreground: 222.2 84% 4.9%;           /* Near-black text */
--muted: 210 40% 96.1%;                 /* Light gray */
--accent: 210 40% 96.1%;                /* Accent color */

/* Dark Mode (via .dark class) */
--background: 222.2 84% 4.9%;           /* Dark navy */
--foreground: 210 40% 98%;              /* Near-white text */
```

### Typography
```typescript
fontFamily: {
  heading: ['Inter', 'system-ui', 'sans-serif'],
  body: ['Inter', 'system-ui', 'sans-serif'],
}
```

### Spacing Scale (Tailwind)
```
Base unit: 4px (0.25rem)
Spacing: 1 (4px), 2 (8px), 4 (16px), 6 (24px), 8 (32px), 12 (48px), 16 (64px), 24 (96px)
```

---

## 🚀 Performance Targets

| Metric | Target | Current |
|--------|--------|---------|
| First Contentful Paint (FCP) | < 1.5s | ✅ ~1.2s |
| Time to Interactive (TTI) | < 3.0s | ✅ ~2.8s |
| Largest Contentful Paint (LCP) | < 2.5s | ✅ ~2.1s |
| Cumulative Layout Shift (CLS) | < 0.1 | ✅ ~0.05 |
| Total Bundle Size (gzipped) | < 100 KB | ✅ 58 KB |
| Lighthouse Score (Mobile) | > 90 | ✅ 95+ |
| Lighthouse Score (Desktop) | > 95 | ✅ 98+ |

---

## 📞 Contact and Resources

### Project Links
- **Production:** https://brashline.com
- **Repository:** https://github.com/hanmason535-debug/brashline-social-engine-88057
- **Lovable Dashboard:** https://lovable.dev/projects/26de7508-dafd-44d3-93ea-7f75689b02bf

### Documentation
- **React:** https://react.dev/
- **TypeScript:** https://www.typescriptlang.org/docs/
- **Vite:** https://vitejs.dev/
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Framer Motion:** https://www.framer.com/motion/
- **Radix UI:** https://www.radix-ui.com/
- **React Router:** https://reactrouter.com/
- **Vitest:** https://vitest.dev/

### Team Contacts
- **Business Email:** Brashline@gmail.com
- **WhatsApp:** +1-929-446-8440
- **Phone:** +1-929-446-8440

---

## 🔄 Version History

| Date | Version | Changes | Commit |
|------|---------|---------|--------|
| 2025-11-20 | 1.3.0 | Hero sync with backup branch, GTM security fix | 758fa41 |
| 2025-11-19 | 1.2.0 | Animation improvements (BorderBeam, Meteors) | 7f56d73 |
| 2025-11-18 | 1.1.0 | TypeScript strict mode, constants extraction | - |
| 2025-11-17 | 1.0.0 | Initial production release | - |

---

## ✅ Pre-Commit Checklist

Before pushing code, verify:

- [ ] All tests pass (`npm run test -- --run`)
- [ ] No linting errors (`npm run lint`)
- [ ] Code formatted (`npm run format`)
- [ ] TypeScript compiles (`npx tsc --noEmit`)
- [ ] No `any` types introduced
- [ ] File headers present on new files
- [ ] Constants extracted (no magic strings)
- [ ] Accessibility tested (manual or automated)
- [ ] i18n support added (if user-facing)
- [ ] Analytics events added (if new interactions)
- [ ] Bundle size acceptable (check build output)

---

## 🤖 Agent Instructions Summary

When working on this codebase:

1. **Read File Headers:** Every file has a JSDoc comment explaining its purpose
2. **Follow TypeScript Strict:** No `any` types, always define interfaces
3. **Use Central Constants:** Import from `@/lib/constants.ts`, never hardcode
4. **Test Everything:** Write tests for new features, run full suite before commit
5. **Accessibility First:** Use semantic HTML, ARIA labels, test with axe
6. **Bilingual Support:** All user-facing text needs EN/ES via `useLanguage()`
7. **Performance Matters:** Optimize animations, lazy load routes, check bundle size
8. **Security Always:** No secrets in code, sanitize inputs, use CSP
9. **Git Hygiene:** Descriptive commits, feature branches, meaningful PR descriptions
10. **Ask Before Refactoring:** Major architectural changes need discussion

---

**Last Updated:** November 20, 2025  
**Maintainer:** Brashline Development Team  
**License:** Proprietary

---

*This document is a living guide. Update it when patterns change or new conventions emerge.*
