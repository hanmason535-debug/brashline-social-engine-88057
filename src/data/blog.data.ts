/**
 * File overview: src/data/blog.data.ts
 *
 * Static data definitions used to drive UI content and configuration.
 * Behavior:
 * - Encodes copy, links, and structured content separate from presentation logic.
 * Assumptions:
 * - Consumers treat this as read-only and avoid mutating values in place.
 */
import { BlogPost } from "@/types/blog.types";
import smbSocialImg from "@/assets/images/blog/smb-social.png";
import reviewsStarsImg from "@/assets/images/blog/reviews-stars.png";
import instagramCaptionsImg from "@/assets/images/blog/instagram-captions.png";
import localSeoImg from "@/assets/images/blog/local-seo.png";
import lightAdsImg from "@/assets/images/blog/light-ads.png";
import reportingOwnersImg from "@/assets/images/blog/reporting-owners.png";

export const BLOG_POSTS: BlogPost[] = [
  {
    title: {
      en: "Florida SMB Social: The Minimum That Works",
      es: "Redes para Pymes de Florida: Lo Mínimo que Funciona",
    },
    summary: {
      en: "A two-post rhythm and one story per week keep you visible without burnout.",
      es: "Dos publicaciones y una historia por semana te mantienen visible sin agotamiento.",
    },
    image: smbSocialImg,
    date: "2024-01-15",
  },
  {
    title: {
      en: "How to Turn Reviews into Posts",
      es: "Cómo Convertir Reseñas en Publicaciones",
    },
    summary: {
      en: "Turn real feedback into monthly content without sounding salesy.",
      es: "Convierte comentarios reales en contenido mensual sin sonar promocional.",
    },
    image: reviewsStarsImg,
    date: "2024-01-10",
  },
  {
    title: {
      en: "Instagram Captions That Don't Waste Time",
      es: "Captions de Instagram que No Pierden Tiempo",
    },
    summary: {
      en: "Three caption patterns for local service brands.",
      es: "Tres patrones de caption para marcas de servicios locales.",
    },
    image: instagramCaptionsImg,
    date: "2024-01-05",
  },
  {
    title: {
      en: "Local SEO Basics for Orlando",
      es: "Básicos de SEO Local para Orlando",
    },
    summary: {
      en: "GBP hygiene, weekly posts, and citations that actually matter.",
      es: "Higiene de GBP, publicaciones semanales y citaciones que importan.",
    },
    image: localSeoImg,
    date: "2023-12-28",
  },
  {
    title: {
      en: "When to Add Light Ads",
      es: "Cuándo Agregar Anuncios Ligeros",
    },
    summary: {
      en: "A small, targeted boost that supports organic posts.",
      es: "Un impulso pequeño y dirigido que apoya publicaciones orgánicas.",
    },
    image: lightAdsImg,
    date: "2023-12-20",
  },
  {
    title: {
      en: "Reporting That Busy Owners Read",
      es: "Reportes que los Dueños Ocupados Leen",
    },
    summary: {
      en: "One page with reach, followers, and your two most effective posts.",
      es: "Una página con alcance, seguidores y tus dos publicaciones más efectivas.",
    },
    image: reportingOwnersImg,
    date: "2023-12-15",
  },
];
