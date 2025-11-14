/**
 * Navigation Configuration
 * Central source of truth for all navigation items
 */

import type { LocalizedContent } from '@/types/service.types';

export interface NavigationItem {
  id: string;
  href: string;
  label: LocalizedContent;
}

export const NAVIGATION_CONFIG = {
  main: [
    { id: 'home', href: '/', label: { en: 'Home', es: 'Inicio' } },
    { id: 'services', href: '/services', label: { en: 'Services', es: 'Servicios' } },
    { id: 'pricing', href: '/pricing', label: { en: 'Pricing', es: 'Precios' } },
    { id: 'work', href: '/case-studies', label: { en: 'Work', es: 'Casos' } },
    { id: 'about', href: '/about', label: { en: 'About', es: 'Nosotros' } },
    { id: 'blog', href: '/blog', label: { en: 'Blog', es: 'Blog' } },
  ],
  
  cta: [
    { id: 'contact', href: '/contact', label: { en: 'Contact Us', es: 'Contáctanos' } },
  ],
  
  footer: {
    company: [
      { id: 'about', href: '/about', label: { en: 'About', es: 'Nosotros' } },
      { id: 'case-studies', href: '/case-studies', label: { en: 'Case Studies', es: 'Casos de Éxito' } },
      { id: 'blog', href: '/blog', label: { en: 'Blog', es: 'Blog' } },
      { id: 'contact', href: '/contact', label: { en: 'Contact', es: 'Contacto' } },
    ],
    
    services: [
      { id: 'services', href: '/services', label: { en: 'Services', es: 'Servicios' } },
      { id: 'pricing', href: '/pricing', label: { en: 'Pricing', es: 'Precios' } },
    ],
    
    legal: [
      { id: 'privacy', href: '/privacy', label: { en: 'Privacy Policy', es: 'Política de Privacidad' } },
      { id: 'terms', href: '/terms', label: { en: 'Terms of Service', es: 'Términos de Servicio' } },
      { id: 'cookies', href: '/cookies', label: { en: 'Cookie Policy', es: 'Política de Cookies' } },
      { id: 'accessibility', href: '/accessibility', label: { en: 'Accessibility', es: 'Accesibilidad' } },
    ],
  },
} as const;

export type NavigationSection = keyof typeof NAVIGATION_CONFIG;
