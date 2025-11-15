/**
 * Application Constants
 * Centralized location for magic strings and configuration values
 */
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

export const SHADOW_CLASSES = {
  NONE: '',
  SM: 'shadow-sm',
  DEFAULT: 'shadow-soft',
  MD: 'shadow-medium',
  LG: 'shadow-lg',
  XL: 'shadow-xl',
} as const;
