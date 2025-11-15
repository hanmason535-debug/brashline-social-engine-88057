import React from 'react';
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import 'vitest-matchmedia-mock';

// Test setup: centralizes global mocks and DOM helpers so individual test files stay focused on behavior.
// Responsibilities: extend Jest DOM matchers, normalize browser APIs (matchMedia, IntersectionObserver), and stub animation/SEO layers.
// Performance: keeps tests deterministic and avoids real animations or network-bound features.
expect.extend(matchers);

// Provide a default matchMedia implementation so viewport-dependent hooks can run without extra per-test wiring.
if (!window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // Deprecated
      removeListener: vi.fn(), // Deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

// Minimal IntersectionObserver shim to support in-view hooks without exercising browser layout logic.
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
} as unknown as typeof IntersectionObserver;

// Provide a default language context so components under test can assume a valid `lang` without rendering the real provider.
vi.mock('@/contexts/LanguageContext', () => ({
  useLanguage: () => ({
    lang: 'en',
    setLang: vi.fn(),
  }),
  LanguageProvider: ({ children }: { children: React.ReactNode }) => children,
}));

interface MotionProps {
  children?: React.ReactNode;
  [key: string]: unknown;
}

// Disable framer-motion animations in tests while preserving component structure for layout queries.
vi.mock('framer-motion', () => ({
  ...vi.importActual('framer-motion'),
  motion: {
    div: ({ children, ...props }: MotionProps) => React.createElement('div', props, children),
    span: ({ children, ...props }: MotionProps) => React.createElement('span', props, children),
    path: (props: MotionProps) => React.createElement('path', props),
    button: ({ children, ...props }: MotionProps) => React.createElement('button', props, children),
    a: ({ children, ...props }: MotionProps) => React.createElement('a', props, children),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
}));

// Replace the heavy BackgroundPaths animation layer with a cheap test double.
vi.mock('@/components/ui/background-paths', () => ({
  default: () => React.createElement('div', { 'data-testid': 'background-paths-mock' }),
}));

// Mock SEO components so tests do not depend on react-helmet-async behavior.
vi.mock('@/components/SEO/SEOHead', () => ({
  default: () => null,
}));

vi.mock('@/components/SEO/StructuredData', () => ({
  default: () => null,
}));

// Strip Vercel analytics integrations from tests to keep the environment side-effect free.
vi.mock('@vercel/analytics/react', () => ({
  Analytics: () => null,
}));

vi.mock('@vercel/speed-insights/react', () => ({
  SpeedInsights: () => null,
}));

// Run a DOM cleanup after each test to avoid cross-test leakage.
afterEach(() => {
  cleanup();
});

// JSDOM doesn't implement PointerEvent, which some UI libraries like Radix rely on.
if (!global.PointerEvent) {
  class PointerEvent extends MouseEvent {
    constructor(type: string, params: PointerEventInit) {
      super(type, params);
    }
  }
  global.PointerEvent = PointerEvent as unknown as typeof global.PointerEvent;
}

// Mock hasPointerCapture and releasePointerCapture, which are part of the Pointer Events API.
if (!window.HTMLElement.prototype.hasPointerCapture) {
  window.HTMLElement.prototype.hasPointerCapture = vi.fn();
}
if (!window.HTMLElement.prototype.releasePointerCapture) {
  window.HTMLElement.prototype.releasePointerCapture = vi.fn();
}
