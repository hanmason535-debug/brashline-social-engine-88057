# Component Documentation

Comprehensive documentation for all major components in the Brashline Social Engine.

## Table of Contents

- [Layout Components](#layout-components)
- [Home Components](#home-components)
- [UI Components](#ui-components)
- [Custom Hooks](#custom-hooks)
- [Accessibility Patterns](#accessibility-patterns)

---

## Layout Components

### Header

**Location:** `src/components/layout/Header.tsx`  
**Memoized:** ✅ Yes  

Sticky header with navigation, language switcher, theme toggle, and responsive mobile menu.

#### Props
```typescript
// No props - uses LanguageContext internally
```

#### Features
- ✅ Sticky positioning with backdrop blur
- ✅ Desktop horizontal navigation
- ✅ Mobile hamburger menu with animations
- ✅ Language switcher (EN/ES)
- ✅ Theme toggle (light/dark)
- ✅ WhatsApp CTA button
- ✅ Skip to content link (a11y)
- ✅ Keyboard navigation (Escape to close)
- ✅ Focus trap in mobile menu
- ✅ Body scroll lock when menu open

#### Usage
```tsx
import Header from "@/components/layout/Header";

<Header />
```

#### Accessibility
- **ARIA:** `aria-expanded`, `aria-label`, `role="dialog"`, `aria-modal="true"`
- **Keyboard:** Escape closes menu, auto-focus first link, focus returns to trigger
- **Skip Link:** Visible on focus for screen readers
- **Semantic HTML:** `<nav>`, `<header>` landmarks

#### State Management
```typescript
const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
const menuButtonRef = useRef<HTMLButtonElement>(null);
const mobileMenuRef = useRef<HTMLDivElement>(null);

// Auto-close on route change
useEffect(() => {
  setMobileMenuOpen(false);
}, [location.pathname]);

// Keyboard handling
useEffect(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && mobileMenuOpen) {
      setMobileMenuOpen(false);
      menuButtonRef.current?.focus();
    }
  };
  // ...
}, [mobileMenuOpen]);
```

---

### Footer

**Location:** `src/components/layout/Footer.tsx`  
**Memoized:** ✅ Yes

Footer with navigation links, social media, and copyright information.

#### Props
```typescript
// No props - uses LanguageContext internally
```

#### Features
- ✅ Multi-column layout (responsive)
- ✅ Quick links navigation
- ✅ Social media links
- ✅ Copyright with current year
- ✅ Legal links (Privacy, Terms, Cookies)

#### Usage
```tsx
import Footer from "@/components/layout/Footer";

<Footer />
```

---

## Home Components

### Hero

**Location:** `src/components/home/Hero.tsx`  
**Memoized:** ✅ Yes

Animated hero section with rotating titles, CTA buttons, and background effects.

#### Props
```typescript
interface HeroProps {
  lang: 'en' | 'es';
}
```

#### Features
- ✅ Animated rotating titles (6 options)
- ✅ Framer Motion animations
- ✅ Sparkles background effect
- ✅ Dual CTA buttons (primary + secondary)
- ✅ WhatsApp integration
- ✅ Responsive text sizing
- ✅ Smooth title transitions

#### Usage
```tsx
import Hero from "@/components/home/Hero";

<Hero lang={lang} />
```

#### Animation Configuration
```typescript
const titles = [
  { en: "Bold.", es: "Audaz." },
  { en: "Seen.", es: "Visible." },
  { en: "Trusted.", es: "Confiable." },
  { en: "Growing.", es: "Creciendo." },
  { en: "Known.", es: "Conocido." },
  { en: "Winning.", es: "Ganando." },
];

// Rotates every 2 seconds
useEffect(() => {
  const interval = setInterval(() => {
    setTitleNumber((prev) => (prev + 1) % titles.length);
  }, 2000);
  return () => clearInterval(interval);
}, []);
```

---

### ValueProps

**Location:** `src/components/home/ValueProps.tsx`  
**Memoized:** ✅ Yes

Three-column value proposition section with icons and descriptions.

#### Props
```typescript
interface ValuePropsProps {
  lang: 'en' | 'es';
}
```

#### Features
- ✅ Scroll-triggered animations
- ✅ Icon + title + description cards
- ✅ Responsive grid layout
- ✅ Hover effects
- ✅ IntersectionObserver integration

#### Usage
```tsx
import ValueProps from "@/components/home/ValueProps";

<ValueProps lang={lang} />
```

---

### PricingPreview

**Location:** `src/components/home/PricingPreview.tsx`  
**Memoized:** ✅ Yes

Pricing preview with three tiers, monthly/annual toggle, and feature comparison.

#### Props
```typescript
interface PricingPreviewProps {
  lang: 'en' | 'es';
}
```

#### Features
- ✅ Monthly/annual billing toggle
- ✅ Featured plan highlighting (Brand Pulse)
- ✅ BorderBeam animated borders
- ✅ Feature checklist with icons
- ✅ CTA buttons per plan
- ✅ Hover animations
- ✅ Discount badges

#### Usage
```tsx
import PricingPreview from "@/components/home/PricingPreview";

<PricingPreview lang={lang} />
```

#### State
```typescript
const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly');

const currentPrice = billing === "monthly" 
  ? plan.monthlyPrice 
  : plan.annualPrice;
```

---

### StatsSection

**Location:** `src/components/home/StatsSection.tsx`  
**Memoized:** ✅ Yes

Animated stats counter with parallax effect.

#### Props
```typescript
interface StatsSectionProps {
  lang: 'en' | 'es';
}
```

#### Features
- ✅ Count-up animations
- ✅ Parallax scroll effect
- ✅ Four stat cards
- ✅ Icon integration
- ✅ Responsive grid

#### Usage
```tsx
import StatsSection from "@/components/home/StatsSection";

<StatsSection lang={lang} />
```

---

## UI Components

### Carousel

**Location:** `src/components/ui/carousel.tsx`  
**Phase 3.3 Enhanced:** ✅ Yes

Touch-friendly carousel with Embla Carousel, enhanced navigation, progress dots, and mobile swipe indicator.

#### Components
```typescript
- Carousel          // Main container
- CarouselContent   // Scrollable content wrapper
- CarouselItem      // Individual slides
- CarouselPrevious  // Previous button (enhanced)
- CarouselNext      // Next button (enhanced)
- CarouselDots      // Progress indicator (new in Phase 3.3)
- CarouselSwipeIndicator // Mobile hint (new in Phase 3.3)
```

#### Props

**Carousel**
```typescript
interface CarouselProps {
  opts?: CarouselOptions;     // Embla options
  plugins?: CarouselPlugin;   // Embla plugins
  orientation?: "horizontal" | "vertical";
  setApi?: (api: CarouselApi) => void;
}
```

**CarouselOptions (common)**
```typescript
opts={{
  align: "start" | "center" | "end",
  loop: boolean,
  dragFree: boolean,
  slidesToScroll: number,
}}
```

#### Usage Example
```tsx
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselDots,
  CarouselSwipeIndicator,
} from "@/components/ui/carousel";

<Carousel opts={{ align: "start", loop: true }}>
  <CarouselContent>
    {items.map((item, index) => (
      <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
        <Card>{/* content */}</Card>
      </CarouselItem>
    ))}
  </CarouselContent>
  
  {/* Enhanced navigation */}
  <CarouselPrevious />
  <CarouselNext />
  
  {/* New in Phase 3.3 */}
  <CarouselDots className="mt-8" />
  <CarouselSwipeIndicator />
</Carousel>
```

#### Phase 3.3 Enhancements

**1. Bigger Navigation Buttons**
```typescript
// Before: h-8 w-8
// After:  h-12 w-12 with better positioning and shadows
className="h-12 w-12 rounded-full shadow-lg hover:scale-110 transition-all"
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
            index === selectedIndex 
              ? "w-8 bg-primary"       // Active: wider, colored
              : "w-2 bg-muted-foreground/30" // Inactive: smaller, muted
          )}
          onClick={() => api?.scrollTo(index)}
        />
      ))}
    </div>
  );
};
```

**3. Swipe Indicator**
```typescript
export const CarouselSwipeIndicator = () => {
  const [showIndicator, setShowIndicator] = useState(true);

  // Auto-hide after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowIndicator(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!showIndicator) return null;

  return (
    <div className="absolute bottom-4 md:hidden">
      <div className="flex items-center gap-2 bg-background/90 px-4 py-2 rounded-full">
        <ArrowLeft className="h-4 w-4 animate-pulse" />
        <span className="text-sm">Swipe</span>
        <ArrowRight className="h-4 w-4 animate-pulse" />
      </div>
    </div>
  );
};
```

#### Keyboard Navigation
- **Left Arrow:** Previous slide
- **Right Arrow:** Next slide
- **Disabled state:** Buttons disabled when at start/end (if not looping)

---

### Button

**Location:** `src/components/ui/button.tsx`

shadcn/ui button component with variants and sizes.

#### Props
```typescript
interface ButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean; // Renders as child component (Slot pattern)
}
```

#### Usage
```tsx
import { Button } from "@/components/ui/button";

<Button variant="default" size="lg">
  Click Me
</Button>

// As link (Slot pattern)
<Button asChild>
  <Link to="/pricing">View Pricing</Link>
</Button>
```

---

### Card

**Location:** `src/components/ui/card.tsx`

Container component with consistent styling.

#### Components
```typescript
- Card          // Main container
- CardHeader    // Header section
- CardContent   // Body content
- CardFooter    // Footer section
```

#### Usage
```tsx
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";

<Card>
  <CardHeader>
    <h3>Title</h3>
  </CardHeader>
  <CardContent>
    <p>Content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

---

### FlipButton

**Location:** `src/components/ui/flip-button.tsx`

Animated button with 3D flip effect on hover.

#### Props
```typescript
interface FlipButtonProps {
  frontText: string;
  backText: string;
  from?: 'top' | 'bottom' | 'left' | 'right';
  href?: string;
  target?: '_blank' | '_self';
  onClick?: () => void;
  className?: string;
}
```

#### Usage
```tsx
import FlipButton from "@/components/ui/flip-button";

<FlipButton
  frontText="Book Strategic Call"
  backText="📞 Calling…"
  from="top"
  href="https://wa.me/19294468440"
  target="_blank"
/>
```

#### Animation
- Rotates on hover using Framer Motion
- Configurable rotation direction
- Smooth 600ms transition with cubic-bezier easing

---

### ThemeSwitch

**Location:** `src/components/ui/theme-switch.tsx`

Toggle between light and dark themes.

#### Props
```typescript
interface ThemeSwitchProps {
  className?: string;
}
```

#### Usage
```tsx
import ThemeSwitch from "@/components/ui/theme-switch";

<ThemeSwitch className="scale-75" />
```

---

### BorderBeam

**Location:** `src/components/ui/border-beam.tsx`

Animated gradient border effect for highlighting featured elements.

#### Props
```typescript
interface BorderBeamProps {
  size?: number;        // Size of the beam
  duration?: number;    // Animation duration in seconds
  delay?: number;       // Animation delay
  borderWidth?: number; // Width of the border
  colorFrom?: string;   // Start color (CSS color)
  colorTo?: string;     // End color (CSS color)
}
```

#### Usage
```tsx
import { BorderBeam } from "@/components/ui/border-beam";

<Card className="relative overflow-hidden">
  <BorderBeam 
    duration={12} 
    size={300}
    colorFrom="hsl(var(--primary))" 
    colorTo="hsl(var(--primary-glow))" 
  />
  {/* Card content */}
</Card>
```

---

### Meteors

**Location:** `src/components/ui/meteors.tsx`

Animated meteor shower background effect.

#### Props
```typescript
interface MeteorsProps {
  number?: number; // Number of meteors (default: 20)
}
```

#### Usage
```tsx
import { Meteors } from "@/components/ui/meteors";

<section className="relative">
  <div className="absolute inset-0">
    <Meteors number={30} />
  </div>
  {/* Section content */}
</section>
```

---

## Custom Hooks

### Data Hooks (Phase 3.1)

All data hooks follow the same pattern: accept `lang` parameter, return memoized localized data.

#### useServices

**Location:** `src/hooks/useServices.ts`

```typescript
export const useServices = (lang: 'en' | 'es'): ServiceResult => {
  return useMemo(() => ({
    services: [...], // Localized services array
    categories: [...], // Unique categories
  }), [lang]);
};

// Usage
const { services, categories } = useServices(lang);
```

#### usePricing

**Location:** `src/hooks/usePricing.ts`

```typescript
export const usePricing = (lang: 'en' | 'es'): PricingResult => {
  return useMemo(() => ({
    recurringPlans: [...],  // 3 recurring plans
    mainPackage: {...},     // Digital Launch Pro
    addonPackages: [...],   // 7 addon packages
  }), [lang]);
};

// Usage
const { recurringPlans, mainPackage, addonPackages } = usePricing(lang);
```

#### useAbout

**Location:** `src/hooks/useAbout.ts`

```typescript
export const useAbout = (lang: 'en' | 'es'): AboutResult => {
  return useMemo(() => ({
    valueCards: [...],   // 3 value proposition cards
    heroContent: {...},  // Hero section content
    storyContent: {...}, // About story content
  }), [lang]);
};

// Usage
const { valueCards, heroContent, storyContent } = useAbout(lang);
```

#### useBlog

**Location:** `src/hooks/useBlog.ts`

```typescript
export const useBlog = (lang: 'en' | 'es'): BlogResult => {
  return useMemo(() => ({
    blogPosts: [...], // 6 blog posts with localized content
  }), [lang]);
};

// Usage
const { blogPosts } = useBlog(lang);
```

---

### Animation Hooks

#### useScrollAnimation

**Location:** `src/hooks/useScrollAnimation.tsx`

IntersectionObserver wrapper for scroll-triggered animations.

```typescript
interface UseScrollAnimationOptions {
  threshold?: number;     // Percentage of element visible (0-1)
  rootMargin?: string;    // Margin around viewport
  triggerOnce?: boolean;  // Trigger only once (default: true)
}

export const useScrollAnimation = (options?: UseScrollAnimationOptions) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLElement>(null);
  
  // ... IntersectionObserver setup
  
  return { elementRef, isVisible };
};

// Usage
const { elementRef, isVisible } = useScrollAnimation({ threshold: 0.2 });

<section 
  ref={elementRef} 
  className={`transition-all ${isVisible ? 'opacity-100' : 'opacity-0'}`}
>
  {/* Content */}
</section>
```

#### useParallax

**Location:** `src/hooks/useParallax.tsx`

Scroll parallax effect for depth and motion.

```typescript
interface UseParallaxOptions {
  speed?: number;              // Parallax speed (0-1, default: 0.5)
  direction?: 'up' | 'down';   // Scroll direction (default: 'up')
}

export const useParallax = (options?: UseParallaxOptions) => {
  const [offset, setOffset] = useState(0);
  
  // ... scroll listener
  
  return offset; // Pixel offset value
};

// Usage
const parallax = useParallax({ speed: 0.3, direction: 'down' });

<div style={{ transform: `translateY(${parallax}px)` }}>
  {/* Parallax content */}
</div>
```

#### useCountUp

**Location:** `src/hooks/useCountUp.tsx`

Animated number counter.

```typescript
export const useCountUp = (end: number, duration: number = 2000) => {
  const [count, setCount] = useState(0);
  
  // ... animation logic
  
  return count;
};

// Usage
const count = useCountUp(100, 2000);
<span>{count}</span>
```

#### use-mobile

**Location:** `src/hooks/use-mobile.tsx`

Responsive breakpoint detection.

```typescript
export const useMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  // Listens to window resize, checks if width < 768px
  
  return isMobile;
};

// Usage
const isMobile = useMobile();

{isMobile ? <MobileView /> : <DesktopView />}
```

---

## Accessibility Patterns

### Skip to Content Link

Every page includes a skip link for keyboard users:

```tsx
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:left-0 focus:top-0 focus:z-50 focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2"
>
  Skip to main content
</a>

<main id="main-content">
  {/* Page content */}
</main>
```

### Focus Trap Pattern

Mobile menu implements focus trap:

```typescript
useEffect(() => {
  if (mobileMenuOpen) {
    // Auto-focus first interactive element
    setTimeout(() => {
      const firstLink = mobileMenuRef.current?.querySelector('a');
      firstLink?.focus();
    }, 100);
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
  
  return () => {
    document.body.style.overflow = '';
  };
}, [mobileMenuOpen]);
```

### ARIA Live Regions

For dynamic content updates:

```tsx
<div 
  role="status" 
  aria-live="polite" 
  aria-atomic="true"
>
  {loadingMessage}
</div>
```

### Keyboard Navigation

All interactive elements support keyboard:

```tsx
<button
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }}
>
  Action
</button>
```

---

## Testing Components

See [TESTING.md](./TESTING.md) for comprehensive testing documentation.

### Quick Example

```typescript
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from './Header';

describe('Header', () => {
  it('should render navigation links', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    
    expect(screen.getByText('Services')).toBeInTheDocument();
    expect(screen.getByText('Pricing')).toBeInTheDocument();
  });
});
```

---

## Component Checklist

When creating new components:

- [ ] **TypeScript:** Define props interface
- [ ] **Memoization:** Consider `memo()` for expensive components
- [ ] **Accessibility:** Add ARIA labels, keyboard support
- [ ] **Responsive:** Test on mobile, tablet, desktop
- [ ] **Tests:** Write unit tests (aim for 80%+ coverage)
- [ ] **Documentation:** Update this file with usage examples
- [ ] **Styles:** Use Tailwind utilities, follow spacing standards
- [ ] **Performance:** Use `useMemo`, `useCallback` where appropriate

---

**Last Updated:** November 14, 2025  
**Version:** Phase 3.4  
**Maintainers:** Brashline Development Team
