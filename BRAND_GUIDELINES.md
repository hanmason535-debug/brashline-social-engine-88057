# Brashline Brand Guidelines

> Design system documentation for consistent, high-quality UI across all Brashline products.

---

## 1. Color Palette

### Primary Colors

| Name | Hex | HSL | Usage |
|------|-----|-----|-------|
| **Dark** | `#0f0f0f` | `0 0% 6%` | Primary text, dark backgrounds |
| **Light** | `#fafafa` | `0 0% 98%` | Light backgrounds, text on dark |
| **Muted** | `#8b8991` | `260 3% 55%` | Secondary text, subtle elements |

### Brand Accent Colors

| Name | Hex | HSL | Usage |
|------|-----|-----|-------|
| **Primary (Violet)** | `#7c3aed` | `263 70% 58%` | CTAs, primary actions, highlights |
| **Secondary (Blue)** | `#3b82f6` | `217 91% 60%` | Links, info states, secondary actions |
| **Tertiary (Emerald)** | `#10b981` | `160 84% 39%` | Success states, positive feedback |

### Status Colors

| State | Hex | Usage |
|-------|-----|-------|
| Success | `#10b981` | Confirmations, completed actions |
| Warning | `#f59e0b` | Caution alerts, pending states |
| Error | `#ef4444` | Error states, destructive actions |
| Info | `#3b82f6` | Information, neutral alerts |

### Gradient Palette

```css
/* Primary gradient - for hero sections, CTAs */
--gradient-primary: linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%);

/* Accent gradient - for highlights, cards */
--gradient-accent: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);

/* Subtle gradient - for backgrounds */
--gradient-subtle: linear-gradient(180deg, rgba(124, 58, 237, 0.05) 0%, transparent 100%);

/* Mesh gradient - for modern backgrounds */
--gradient-mesh: radial-gradient(at 40% 20%, hsla(263, 70%, 58%, 0.2) 0px, transparent 50%),
                 radial-gradient(at 80% 0%, hsla(217, 91%, 60%, 0.15) 0px, transparent 50%),
                 radial-gradient(at 0% 50%, hsla(160, 84%, 39%, 0.1) 0px, transparent 50%);
```

---

## 2. Typography

### Font Stack

| Use Case | Font | Fallbacks |
|----------|------|-----------|
| **Headings** | Inter | system-ui, sans-serif |
| **Body** | Inter | system-ui, sans-serif |
| **Mono** | JetBrains Mono | Consolas, monospace |

### Type Scale

| Element | Size | Weight | Line Height | Letter Spacing |
|---------|------|--------|-------------|----------------|
| **H1** | 4rem (64px) | 800 | 1.1 | -0.02em |
| **H2** | 2.5rem (40px) | 700 | 1.2 | -0.01em |
| **H3** | 1.5rem (24px) | 600 | 1.3 | 0 |
| **H4** | 1.25rem (20px) | 600 | 1.4 | 0 |
| **Body** | 1rem (16px) | 400 | 1.6 | 0 |
| **Small** | 0.875rem (14px) | 400 | 1.5 | 0.01em |
| **Micro** | 0.75rem (12px) | 500 | 1.4 | 0.02em |

### Heading Examples

```html
<h1 class="text-4xl md:text-6xl lg:text-7xl font-heading font-bold">
  Hero Headline
</h1>

<h2 class="text-3xl md:text-4xl font-heading font-bold">
  Section Title
</h2>

<h3 class="text-xl font-heading font-semibold">
  Card Title
</h3>
```

---

## 3. Spacing System

### Base Unit: 4px

| Token | Value | Usage |
|-------|-------|-------|
| `--space-1` | 0.25rem (4px) | Tight spacing, icon gaps |
| `--space-2` | 0.5rem (8px) | Default gap, button padding |
| `--space-3` | 0.75rem (12px) | Card padding, form gaps |
| `--space-4` | 1rem (16px) | Section padding |
| `--space-6` | 1.5rem (24px) | Component margins |
| `--space-8` | 2rem (32px) | Section margins |
| `--space-12` | 3rem (48px) | Large gaps |
| `--space-16` | 4rem (64px) | Page sections |
| `--space-24` | 6rem (96px) | Hero sections |

---

## 4. Effects & Depth

### Shadows

| Level | Value | Usage |
|-------|-------|-------|
| **sm** | `0 1px 2px rgba(0, 0, 0, 0.05)` | Subtle elevation |
| **md** | `0 4px 6px rgba(0, 0, 0, 0.1)` | Cards, dropdowns |
| **lg** | `0 10px 15px rgba(0, 0, 0, 0.15)` | Modals, popovers |
| **xl** | `0 20px 25px rgba(0, 0, 0, 0.2)` | Hero elements |
| **glow** | `0 0 40px rgba(124, 58, 237, 0.3)` | CTA highlights |

### Glassmorphism

```css
.glass {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.glass-dark {
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.05);
}
```

### Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `rounded-sm` | 0.25rem | Buttons, badges |
| `rounded-md` | 0.375rem | Inputs, small cards |
| `rounded-lg` | 0.5rem | Cards, modals |
| `rounded-xl` | 0.75rem | Large cards, hero sections |
| `rounded-2xl` | 1rem | Feature cards |
| `rounded-full` | 9999px | Avatars, pills |

---

## 5. Animation Guidelines

### Timing

| Type | Duration | Easing |
|------|----------|--------|
| **Micro** | 150ms | ease-out |
| **Fast** | 200ms | ease-out |
| **Normal** | 300ms | ease-in-out |
| **Slow** | 500ms | ease-in-out |
| **Entrance** | 500ms | cubic-bezier(0.16, 1, 0.3, 1) |

### Recommended Animations

```tsx
// Fade in with slide up
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
};

// Scale in
const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.3 }
};

// Stagger children
const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};
```

---

## 6. Component Patterns

### Buttons

```tsx
// Primary CTA
<Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
  Get Started
</Button>

// Secondary
<Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
  Learn More
</Button>

// Ghost
<Button variant="ghost" className="hover:bg-muted">
  Cancel
</Button>
```

### Cards

```tsx
<Card className="bg-card border-border shadow-md hover:shadow-lg transition-shadow">
  <CardHeader>
    <CardTitle className="text-xl font-heading font-semibold">
      Card Title
    </CardTitle>
  </CardHeader>
  <CardContent>
    <p className="text-muted-foreground">Card content...</p>
  </CardContent>
</Card>
```

### Glass Cards

```tsx
<div className="glass rounded-xl p-6">
  <h3 className="text-lg font-semibold">Glassy Card</h3>
  <p className="text-muted-foreground">Content with depth...</p>
</div>
```

---

## 7. Responsive Breakpoints

| Breakpoint | Width | Usage |
|------------|-------|-------|
| `sm` | 640px | Mobile landscape |
| `md` | 768px | Tablet portrait |
| `lg` | 1024px | Tablet landscape / Small desktop |
| `xl` | 1280px | Desktop |
| `2xl` | 1536px | Large desktop |

---

## 8. Accessibility

### Color Contrast

- All text must meet WCAG 2.1 AA standards
- Normal text: minimum 4.5:1 contrast ratio
- Large text (18px+): minimum 3:1 contrast ratio
- Interactive elements: clear focus states

### Focus States

```css
:focus-visible {
  outline: 2px solid hsl(var(--primary));
  outline-offset: 2px;
}
```

### Motion

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 9. Dark Mode Considerations

| Element | Light Mode | Dark Mode |
|---------|------------|-----------|
| Background | `#fafafa` | `#0f0f0f` |
| Card | `#ffffff` | `#1a1a1a` |
| Border | `#e5e5e5` | `#2a2a2a` |
| Muted Text | `#6b7280` | `#9ca3af` |

---

## Quick Reference

```css
/* Copy-paste brand tokens */
:root {
  --brand-dark: #0f0f0f;
  --brand-light: #fafafa;
  --brand-primary: #7c3aed;
  --brand-secondary: #3b82f6;
  --brand-tertiary: #10b981;
  
  --font-heading: 'Inter', system-ui, sans-serif;
  --font-body: 'Inter', system-ui, sans-serif;
  
  --shadow-glow: 0 0 40px rgba(124, 58, 237, 0.3);
}
```
