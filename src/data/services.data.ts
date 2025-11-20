/**
 * Services Data
 * Central data source for all service offerings
 */
/**
 * File overview: src/data/services.data.ts
 *
 * Static data definitions used to drive UI content and configuration.
 * Behavior:
 * - Encodes copy, links, and structured content separate from presentation logic.
 * Assumptions:
 * - Consumers treat this as read-only and avoid mutating values in place.
 */

import {
  Share2,
  Globe,
  Search,
  Target,
  ShoppingCart,
  Palette,
  Calendar,
  BarChart3,
  MessageCircle,
} from "lucide-react";
import type { Service } from "@/types/service.types";

export const SERVICES_DATA: Service[] = [
  {
    id: "social-media",
    icon: Share2,
    title: {
      en: "Social Media Management",
      es: "Gestión de Redes Sociales",
    },
    description: {
      en: "Consistent, on-brand posting and engagement across Instagram, Facebook, Google, Nextdoor, Yelp, and more.",
      es: "Publicación y engagement constante y de marca en Instagram, Facebook, Google, Nextdoor, Yelp y más.",
    },
    category: "marketing",
  },
  {
    id: "website-design",
    icon: Globe,
    title: {
      en: "Website Design & Development",
      es: "Diseño y Desarrollo Web",
    },
    description: {
      en: "Modern, responsive sites built to convert and reflect your brand.",
      es: "Sitios modernos y responsivos construidos para convertir y reflejar tu marca.",
    },
    category: "development",
  },
  {
    id: "seo",
    icon: Search,
    title: {
      en: "SEO & Local Visibility",
      es: "SEO y Visibilidad Local",
    },
    description: {
      en: "Optimize search rankings and keep your business easily found on Google and maps.",
      es: "Optimiza rankings de búsqueda y mantén tu negocio fácilmente encontrable en Google y mapas.",
    },
    category: "marketing",
  },
  {
    id: "ad-management",
    icon: Target,
    title: {
      en: "Ad Management",
      es: "Gestión de Anuncios",
    },
    description: {
      en: "Targeted campaigns across Meta, Google, Yelp, and more for measurable reach and ROI.",
      es: "Campañas dirigidas en Meta, Google, Yelp y más para alcance y ROI medibles.",
    },
    category: "marketing",
  },
  {
    id: "ecommerce",
    icon: ShoppingCart,
    title: {
      en: "E-Commerce Setup & Management",
      es: "Configuración y Gestión de E-Commerce",
    },
    description: {
      en: "Amazon, Shopify, DoorDash, UberEats, and Groupon store creation and optimization.",
      es: "Creación y optimización de tiendas en Amazon, Shopify, DoorDash, UberEats y Groupon.",
    },
    category: "development",
  },
  {
    id: "branding",
    icon: Palette,
    title: {
      en: "Digital Branding",
      es: "Branding Digital",
    },
    description: {
      en: "Logos, visuals, and a consistent identity that connects across every platform.",
      es: "Logotipos, visuales e identidad consistente que conecta en todas las plataformas.",
    },
    category: "design",
  },
  {
    id: "content-strategy",
    icon: Calendar,
    title: {
      en: "Content Strategy & Scheduling",
      es: "Estrategia y Programación de Contenido",
    },
    description: {
      en: "Organic content planned, created, and posted regularly to keep you visible.",
      es: "Contenido orgánico planificado, creado y publicado regularmente para mantenerte visible.",
    },
    category: "marketing",
  },
  {
    id: "analytics",
    icon: BarChart3,
    title: {
      en: "Analytics & Reporting",
      es: "Análisis e Informes",
    },
    description: {
      en: "Transparent results that show what is working and where to grow.",
      es: "Resultados transparentes que muestran qué funciona y dónde crecer.",
    },
    category: "analytics",
  },
  {
    id: "reputation",
    icon: MessageCircle,
    title: {
      en: "Online Reputation Management",
      es: "Gestión de Reputación Online",
    },
    description: {
      en: "Monitor reviews, respond to feedback, and strengthen your brand public image.",
      es: "Monitorea reseñas, responde a comentarios y fortalece la imagen pública de tu marca.",
    },
    category: "marketing",
  },
];
