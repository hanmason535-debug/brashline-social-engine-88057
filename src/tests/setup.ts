import React from 'react';
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import 'vitest-matchmedia-mock';

// Extends Vitest's expect method with methods from react-testing-library
expect.extend(matchers);

// Mock the useLanguage context to provide a default value
vi.mock('@/contexts/LanguageContext', () => ({
  useLanguage: () => ({
    lang: 'en',
    setLang: vi.fn(),
  }),
  LanguageProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock framer-motion to disable animations in tests
vi.mock('framer-motion', () => ({
  ...vi.importActual('framer-motion'),
  motion: {
    div: ({ children, ...props }: any) => React.createElement('div', props, children),
    span: ({ children, ...props }: any) => React.createElement('span', props, children),
    path: (props: any) => React.createElement('path', props),
    button: ({ children, ...props }: any) => React.createElement('button', props, children),
    a: ({ children, ...props }: any) => React.createElement('a', props, children),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock the BackgroundPaths component
vi.mock('@/components/ui/background-paths', () => ({
  default: () => React.createElement('div', { 'data-testid': 'background-paths-mock' }),
}));

// Mock SEO components to avoid helmet-async issues in tests
vi.mock('@/components/SEO/SEOHead', () => ({
  default: () => null,
}));

vi.mock('@/components/SEO/StructuredData', () => ({
  default: () => null,
}));

// Mock Vercel Analytics and Speed Insights
vi.mock('@vercel/analytics/react', () => ({
  Analytics: () => null,
}));

vi.mock('@vercel/speed-insights/react', () => ({
  SpeedInsights: () => null,
}));

// Runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});
