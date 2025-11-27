/**
 * Animation Variants Library
 * Centralized, optimized Framer Motion animation variants
 * Performance: Only animates transform and opacity for GPU acceleration
 */

import { Variants, Transition } from "framer-motion";

// Check for reduced motion preference
export const shouldReduceMotion = () => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

// Base transition configurations
export const transitions = {
  // Spring physics for natural feel
  spring: {
    type: "spring" as const,
    stiffness: 260,
    damping: 20,
  },
  springBouncy: {
    type: "spring" as const,
    stiffness: 400,
    damping: 17,
  },
  springSmooth: {
    type: "spring" as const,
    stiffness: 100,
    damping: 15,
  },
  // Tween for controlled timing
  fast: {
    type: "tween" as const,
    duration: 0.2,
    ease: "easeOut" as const,
  },
  medium: {
    type: "tween" as const,
    duration: 0.3,
    ease: "easeOut" as const,
  },
  slow: {
    type: "tween" as const,
    duration: 0.5,
    ease: "easeOut" as const,
  },
} satisfies Record<string, Transition>;

// Fade animations (opacity only)
export const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: transitions.medium,
  },
  exit: { 
    opacity: 0,
    transition: transitions.fast,
  },
};

// Slide up with fade (transform + opacity)
export const slideUpVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: transitions.spring,
  },
  exit: { 
    opacity: 0, 
    y: -10,
    transition: transitions.fast,
  },
};

// Scale with fade (transform + opacity)
export const scaleVariants: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.95,
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: transitions.spring,
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    transition: transitions.fast,
  },
};

// Stagger children animations
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.spring,
  },
};

// Modal/Lightbox animations
export const modalVariants: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.9,
    y: 20,
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    y: 10,
    transition: transitions.fast,
  },
};

export const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.2 },
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.15 },
  },
};

// Slide from side (mobile menu)
export const slideFromRightVariants: Variants = {
  hidden: { 
    opacity: 0,
    x: "100%",
  },
  visible: { 
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
  exit: { 
    opacity: 0,
    x: "100%",
    transition: transitions.medium,
  },
};

// Flip button variants
export const flipFrontVariants: Variants = {
  initial: { rotateX: 0 },
  hover: { 
    rotateX: 90,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

export const flipBackVariants: Variants = {
  initial: { rotateX: -90 },
  hover: { 
    rotateX: 0,
    transition: { duration: 0.2, ease: "easeOut" },
  },
};

// Hover scale (for cards, buttons)
export const hoverScaleVariants: Variants = {
  initial: { scale: 1 },
  hover: { 
    scale: 1.05,
    transition: transitions.fast,
  },
  tap: { 
    scale: 0.98,
    transition: transitions.fast,
  },
};

// Layout shift animation (expensive - use sparingly)
export const layoutVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: transitions.spring,
  },
};

/**
 * Get animation props with reduced motion support
 * @param variants - Animation variants to use
 * @param customTransition - Optional custom transition
 * @returns Animation props object for motion components
 */
export const getAnimationProps = (
  variants: Variants,
  customTransition?: Transition
) => {
  if (shouldReduceMotion()) {
    return {
      initial: "visible",
      animate: "visible",
      exit: "visible",
      transition: { duration: 0 },
    };
  }

  return {
    variants,
    initial: "hidden",
    animate: "visible",
    exit: "exit",
    ...(customTransition && { transition: customTransition }),
  };
};

/**
 * Optimized transition for rapid state changes
 * Prevents animation queuing
 */
export const instantTransition: Transition = {
  duration: 0.15,
  ease: "easeOut",
};

/**
 * GPU-accelerated style hints
 * Apply to elements that will animate
 */
export const gpuAcceleration = {
  transform: "translate3d(0, 0, 0)",
  backfaceVisibility: "hidden" as const,
  WebkitBackfaceVisibility: "hidden" as const,
};

/**
 * Performance monitoring helper
 */
export const logAnimationPerformance = (name: string, callback: () => void) => {
  if (import.meta.env.DEV) {
    const start = performance.now();
    callback();
    const end = performance.now();
    const duration = end - start;
    
    if (duration > 16.67) {
      console.warn(
        `Animation "${name}" took ${duration.toFixed(2)}ms (>16.67ms frame budget)`
      );
    }
  } else {
    callback();
  }
};
