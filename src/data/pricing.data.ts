/**
 * File overview: src/data/pricing.data.ts
 *
 * Static data definitions used to drive UI content and configuration.
 * Behavior:
 * - Encodes copy, links, and structured content separate from presentation logic.
 * Assumptions:
 * - Consumers treat this as read-only and avoid mutating values in place.
 */
import { RecurringPlan, OneTimePackage } from "@/types/pricing.types";

// Utility: compute Vite env var key for a plan name
function envPriceKeyFromName(name: string, interval: "monthly" | "yearly") {
  const normalized = name.toUpperCase().replace(/[^A-Z0-9]+/g, "_");
  const suffix = interval === "monthly" ? "MONTHLY" : "YEARLY";
  return `VITE_STRIPE_PRICE_${normalized}_${suffix}`;
}

function envPriceValue(name: string, interval: "monthly" | "yearly") {
  const key = envPriceKeyFromName(name, interval);
  return (import.meta.env as any)[key] as string | undefined; // Vite env variables
}

function envOneTimePriceKeyFromName(name: string) {
  const normalized = name.toUpperCase().replace(/[^A-Z0-9]+/g, "_");
  return `VITE_STRIPE_PRICE_${normalized}_ONE_TIME`;
}

function envOneTimePriceValue(name: string) {
  const key = envOneTimePriceKeyFromName(name);
  return (import.meta.env as any)[key] as string | undefined;
}

export const RECURRING_PLANS: RecurringPlan[] = [
  {
    tier: { en: "BASIC", es: "BÁSICO" },
    name: "Starter Spark",
    price: 99,
    annualPrice: 1106,
    annualDiscount: 7,
    summary: {
      en: "Keep accounts active with low lift.",
      es: "Mantén las cuentas activas con bajo esfuerzo.",
    },
    features: [
      { en: "4 static posts/month", es: "4 publicaciones estáticas/mes" },
      { en: "Facebook & Instagram", es: "Facebook e Instagram" },
      { en: "Basic profile hygiene", es: "Higiene básica de perfil" },
      { en: "Daily inbox scan", es: "Revisión diaria de bandeja" },
      { en: "Monthly mini-report", es: "Mini-informe mensual" },
    ],
    stripeProductId: "prod_TVRrohKG1uB7fa",
    stripePriceIds: {
      monthly: envPriceValue("Starter Spark", "monthly") || "price_1SYQxZBlSadv5HO95adqBVKV",
      yearly: envPriceValue("Starter Spark", "yearly") || "price_starter_yearly_placeholder",
    },
  },
  {
    tier: { en: "STANDARD", es: "ESTÁNDAR" },
    name: "Brand Pulse",
    price: 179,
    annualPrice: 1826,
    annualDiscount: 15,
    featured: true,
    summary: {
      en: "Maintain presence and manage your ecosystem.",
      es: "Mantén la presencia y gestiona tu ecosistema.",
    },
    features: [
      { en: "~15 posts/month", es: "~15 publicaciones/mes" },
      { en: "Full captions + templates", es: "Copys completos + plantillas" },
      { en: "GBP & Yelp maintained", es: "Mantenimiento GBP y Yelp" },
      { en: "Review responses", es: "Respuestas a reseñas" },
      { en: "Light Meta ads oversight", es: "Supervisión ligera anuncios" },
      { en: "Monthly performance report", es: "Informe mensual" },
    ],
    stripeProductId: "prod_TVRrso4JzT9ceT",
    stripePriceIds: {
      monthly: envPriceValue("Brand Pulse", "monthly") || "price_1SYQy8BlSadv5HO9yEVLGlHd",
      yearly: envPriceValue("Brand Pulse", "yearly") || "price_brand_yearly_placeholder",
    },
  },
  {
    tier: { en: "PREMIUM", es: "PREMIUM" },
    name: "Impact Engine",
    price: 499,
    annualPrice: 5390, // 10% discount for yearly
    annualDiscount: 10,
    summary: {
      en: "Growth with measurable ROI.",
      es: "Crecimiento con ROI medible.",
    },
    features: [
      { en: "12–16 posts/month", es: "12–16 publicaciones/mes" },
      { en: "2–4 videos/month", es: "2–4 videos/mes" },
      { en: "Monthly photo session", es: "Sesión de fotos mensual" },
      { en: "SEO blog + full SEO", es: "Blog SEO + SEO completo" },
      { en: "Meta + Google ads", es: "Anuncios Meta y Google" },
      { en: "KPI dashboard + strategy call", es: "Dashboard KPIs + llamada" },
    ],
    stripeProductId: "prod_TVRsONeDHkB2it",
    stripePriceIds: {
      monthly: envPriceValue("Impact Engine", "monthly") || "price_1SYQyYBlSadv5HO9kykoYbvI",
      yearly: envPriceValue("Impact Engine", "yearly") || "price_impact_yearly_placeholder",
    },
  },
];

export const MAIN_PACKAGE: OneTimePackage = {
  name: "Digital Launch Pro",
  price: 2999,
  type: "one-time",
  stripeProductId: "prod_TVS5FcxrQkvq5L",
  stripePriceId: envOneTimePriceValue("Digital Launch Pro") || "price_1SYRBEBlSadv5HO9NAer0awA",
  tagline: {
    en: "Full business setup - for new or rebranding clients",
    es: "Configuración completa del negocio - para clientes nuevos o en proceso de rebranding",
  },
  features: [
    {
      en: "Custom website design & development (6–8 pages)",
      es: "Diseño y desarrollo de sitio web personalizado (6–8 páginas)",
    },
    {
      en: "Logo + complete brand kit (fonts, palette, templates)",
      es: "Logo + kit de marca completo (fuentes, paleta, plantillas)",
    },
    {
      en: "Professional photoshoot + video production",
      es: "Sesión de fotos profesional + producción de video",
    },
    { en: "SEO optimization & Google indexing", es: "Optimización SEO e indexación en Google" },
    {
      en: "GBP & Yelp setup + local directory submissions",
      es: "Configuración de GBP y Yelp + envíos a directorios locales",
    },
    {
      en: "E-commerce setup (Shopify, Amazon, DoorDash, UberEats, Groupon)",
      es: "Configuración de e-commerce (Shopify, Amazon, DoorDash, UberEats, Groupon)",
    },
    {
      en: "Hosting, domain, SSL, analytics setup",
      es: "Configuración de hosting, dominio, SSL, análisis",
    },
    {
      en: "CRM + automation flow (HubSpot/Zoho)",
      es: "CRM + flujo de automatización (HubSpot/Zoho)",
    },
    { en: "30-day post-launch support", es: "Soporte post-lanzamiento de 30 días" },
  ],
  bestFor: {
    en: "new businesses or total brand overhauls",
    es: "negocios nuevos o renovaciones totales de marca",
  },
};

export const ADDON_PACKAGES: OneTimePackage[] = [
  {
    name: "Ad Storm",
    price: 99,
    type: "one-time",
    tagline: {
      en: "Full ad setup across all networks",
      es: "Configuración completa de anuncios en todas las redes",
    },
    features: [
      {
        en: "Meta, Instagram, Google, Yelp, UberEats, DoorDash, Grubhub & Groupon",
        es: "Meta, Instagram, Google, Yelp, UberEats, DoorDash, Grubhub y Groupon",
      },
      {
        en: "Audience targeting, budget structure, and creative setup",
        es: "Segmentación de audiencia, estructura de presupuesto y configuración creativa",
      },
      { en: "Pixel, UTM & conversion tracking", es: "Seguimiento de Pixel, UTM y conversiones" },
      {
        en: "Launch report + ad optimization guide",
        es: "Informe de lanzamiento + guía de optimización de anuncios",
      },
    ],
    bestFor: {
      en: "brands ready for omnichannel paid visibility",
      es: "marcas listas para visibilidad pagada omnicanal",
    },
  },
  {
    name: "Brand Forge",
    price: 99,
    type: "one-time",
    tagline: {
      en: "Logo and brand identity creation",
      es: "Creación de logo e identidad de marca",
    },
    features: [
      { en: "Logo suite + icon variations", es: "Suite de logo + variaciones de iconos" },
      { en: "Color palette & typography guide", es: "Paleta de colores y guía de tipografía" },
      {
        en: "Social post templates + banner set",
        es: "Plantillas de publicaciones sociales + conjunto de banners",
      },
      {
        en: "Digital stationery (email signature, cards)",
        es: "Papelería digital (firma de correo, tarjetas)",
      },
    ],
    bestFor: {
      en: "new or refreshing businesses seeking cohesive design",
      es: "negocios nuevos o en renovación que buscan diseño cohesivo",
    },
  },
  {
    name: "Visual Vault",
    price: 399,
    type: "one-time",
    stripeProductId: "prod_TVS7v3cOTcXY76",
    stripePriceId: envOneTimePriceValue("Visual Vault") || "price_1SYRDIBlSadv5HO9eyQpz5Af",
    tagline: {
      en: "Photography & video creation",
      es: "Creación de fotografía y video",
    },
    features: [
      { en: "Professional photoshoot", es: "Sesión de fotos profesional" },
      {
        en: "20 edited images + 5 short social clips",
        es: "20 imágenes editadas + 5 clips sociales cortos",
      },
      { en: "Branded formatting for posts", es: "Formato de marca para publicaciones" },
      { en: "Commercial usage rights", es: "Derechos de uso comercial" },
    ],
    bestFor: {
      en: "businesses upgrading their creative content",
      es: "negocios mejorando su contenido creativo",
    },
  },
  {
    name: "AutomateIQ",
    price: 899,
    type: "one-time",
    stripeProductId: "prod_TVSAvZFkkSQ1tu",
    stripePriceId: envOneTimePriceValue("AutomateIQ") || "price_1SYRGWBlSadv5HO9gvMfjTD0",
    tagline: {
      en: "CRM + workflow automation",
      es: "CRM + automatización de flujo de trabajo",
    },
    features: [
      {
        en: "CRM setup (HubSpot, Zoho, or custom)",
        es: "Configuración de CRM (HubSpot, Zoho o personalizado)",
      },
      {
        en: "Lead capture, nurture, and follow-up automation",
        es: "Captura de leads, nutrición y automatización de seguimiento",
      },
      { en: "Booking or form integrations", es: "Integraciones de reservas o formularios" },
      { en: "Dashboard connection to website", es: "Conexión de panel al sitio web" },
    ],
    bestFor: {
      en: "service-based businesses scaling efficiency",
      es: "negocios basados en servicios escalando eficiencia",
    },
  },
  {
    name: "Local Surge",
    price: 599,
    type: "one-time",
    stripeProductId: "prod_TVSBLbVY78wqB1",
    stripePriceId: envOneTimePriceValue("Local Surge") || "price_1SYRGuBlSadv5HO9J7xs09kF",
    tagline: {
      en: "Local search & map ranking boost",
      es: "Búsqueda local y mejora de clasificación en mapas",
    },
    features: [
      {
        en: "Google Business Profile optimization",
        es: "Optimización de Perfil de Negocio de Google",
      },
      {
        en: "Yelp, Nextdoor & citation listings (20+)",
        es: "Listados de Yelp, Nextdoor y citas (20+)",
      },
      { en: "Local keyword targeting", es: "Segmentación de palabras clave locales" },
      { en: "Ranking improvement tracking", es: "Seguimiento de mejora de clasificación" },
    ],
    bestFor: {
      en: "physical-location businesses seeking stronger map visibility",
      es: "negocios con ubicación física buscando mayor visibilidad en mapas",
    },
  },
  {
    name: "Commerce Boost",
    price: 799,
    type: "one-time",
    stripeProductId: "prod_TVSBP43xi9RfXE",
    stripePriceId: envOneTimePriceValue("Commerce Boost") || "price_1SYRHKBlSadv5HO92oQpkMnj",
    tagline: {
      en: "E-commerce and delivery integration",
      es: "Integración de e-commerce y entrega",
    },
    features: [
      {
        en: "Store setup on Amazon, Shopify, DoorDash, UberEats, Grubhub, Groupon",
        es: "Configuración de tienda en Amazon, Shopify, DoorDash, UberEats, Grubhub, Groupon",
      },
      {
        en: "Payment, inventory, and shipping setup",
        es: "Configuración de pagos, inventario y envíos",
      },
      { en: "Merchant analytics dashboard", es: "Panel de análisis comercial" },
    ],
    bestFor: {
      en: "restaurants and retailers expanding to online sales",
      es: "restaurantes y minoristas expandiéndose a ventas en línea",
    },
  },
  {
    name: "Data Pulse",
    price: 399,
    type: "one-time",
    stripeProductId: "prod_TVSCwnL5zuQdxy",
    stripePriceId: envOneTimePriceValue("Data Pulse") || "price_1SYRHsBlSadv5HO9KQb1nHR7",
    tagline: {
      en: "Analytics + performance dashboard",
      es: "Análisis + panel de rendimiento",
    },
    features: [
      { en: "GA4, GSC, Meta Pixel, UTM setup", es: "Configuración de GA4, GSC, Meta Pixel, UTM" },
      { en: "Real-time KPI dashboard", es: "Panel de KPI en tiempo real" },
      { en: "Weekly email performance summary", es: "Resumen semanal de rendimiento por correo" },
    ],
    bestFor: {
      en: "clients wanting transparent data tracking",
      es: "clientes que desean seguimiento transparente de datos",
    },
  },
];

// FAQ data for pricing page structured data (JSON-LD)
export const faqs = [
  {
    question: {
      en: "Do your plans require a long-term contract?",
      es: "¿Los planes requieren un contrato a largo plazo?",
    },
    answer: {
      en: "No - our plans are month-to-month with a 30-day cancellation notice. We focus on delivering measurable value so clients stay because they get results.",
      es: "No - nuestros planes son mensuales con 30 días de preaviso para cancelar. Nos enfocamos en ofrecer un valor medible para que los clientes se queden por los resultados.",
    },
  },
  {
    question: {
      en: "Can I switch between plans mid-term?",
      es: "¿Puedo cambiar entre planes a mitad de período?",
    },
    answer: {
      en: "Yes - you can upgrade or downgrade at any time; billing is prorated for upgrades.",
      es: "Sí - puedes actualizar o degradar en cualquier momento; la facturación se prorratea para las mejoras.",
    },
  },
  {
    question: {
      en: "Do you offer custom packages for agencies or franchises?",
      es: "¿Ofrecen paquetes personalizados para agencias o franquicias?",
    },
    answer: {
      en: "Absolutely - we provide custom packages for agencies, franchises, or enterprise clients. Contact our sales team using the contact form to discuss specific requirements.",
      es: "Absolutamente - ofrecemos paquetes personalizados para agencias, franquicias o clientes empresariales. Contacta a nuestro equipo de ventas mediante el formulario de contacto para discutir requisitos específicos.",
    },
  },
];
