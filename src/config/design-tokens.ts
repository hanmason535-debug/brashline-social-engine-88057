/**
 * Design Tokens
 * Centralized design system values for consistent UI
 */

export const SPACING = {
  xs: 'p-2',      // 8px
  sm: 'p-4',      // 16px
  md: 'p-6',      // 24px
  lg: 'p-8',      // 32px
  xl: 'p-12',     // 48px
  '2xl': 'p-16',  // 64px
} as const;

export const SPACING_Y = {
  xs: 'py-2',
  sm: 'py-4',
  md: 'py-6',
  lg: 'py-8',
  xl: 'py-12',
  '2xl': 'py-16',
  '3xl': 'py-20',
  '4xl': 'py-24',
} as const;

export const SPACING_X = {
  xs: 'px-2',
  sm: 'px-4',
  md: 'px-6',
  lg: 'px-8',
  xl: 'px-12',
  '2xl': 'px-16',
} as const;

export const GAP = {
  xs: 'gap-2',
  sm: 'gap-4',
  md: 'gap-6',
  lg: 'gap-8',
  xl: 'gap-12',
  '2xl': 'gap-16',
} as const;

// Common component spacing patterns
export const CARD_PADDING = SPACING.lg;
export const SECTION_PADDING_Y = 'py-16 md:py-24';
export const CONTAINER_PADDING_X = 'px-4 md:px-6 lg:px-8';
export const SECTION_GAP = GAP.lg;

// Transition durations
export const DURATION = {
  fast: '150ms',
  normal: '300ms',
  slow: '500ms',
  slower: '700ms',
} as const;

// Animation easing
export const EASING = {
  default: 'cubic-bezier(0.4, 0, 0.2, 1)',
  in: 'cubic-bezier(0.4, 0, 1, 1)',
  out: 'cubic-bezier(0, 0, 0.2, 1)',
  inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

// Border radius
export const RADIUS = {
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  full: 'rounded-full',
} as const;

// Shadows (from constants.ts)
export const SHADOW = {
  soft: 'shadow-soft',
  medium: 'shadow-medium',
  strong: 'shadow-strong',
} as const;

// Typography scale
export const TEXT_SIZE = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
  '4xl': 'text-4xl',
  '5xl': 'text-5xl',
} as const;

// Common transition classes
export const TRANSITION = {
  all: 'transition-all',
  colors: 'transition-colors',
  transform: 'transition-transform',
  opacity: 'transition-opacity',
} as const;

// Z-index layers
export const Z_INDEX = {
  dropdown: 'z-50',
  sticky: 'z-40',
  fixed: 'z-30',
  overlay: 'z-20',
  base: 'z-10',
} as const;
