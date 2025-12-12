/**
 * File overview: src/data/about.data.ts
 *
 * Static data definitions used to drive UI content and configuration.
 * Behavior:
 * - Encodes copy, links, and structured content separate from presentation logic.
 * Assumptions:
 * - Consumers treat this as read-only and avoid mutating values in place.
 */
import { Target, Users, Award } from "lucide-react";
import { ValueCard } from "@/types/about.types";

export const VALUE_CARDS: ValueCard[] = [
  {
    icon: Target,
    title: { en: "Simplify Digital", es: "Simplificar lo Digital" },
    description: {
      en: "Make online growth easy to understand and manage.",
      es: "Hacer que el crecimiento en línea sea fácil de entender y gestionar.",
    },
  },
  {
    icon: Users,
    title: { en: "Create Value", es: "Crear Valor" },
    description: {
      en: "Deliver real impact, not vanity metrics.",
      es: "Entregar impacto real, no métricas de vanidad.",
    },
  },
  {
    icon: Award,
    title: { en: "Build Trust", es: "Construir Confianza" },
    description: {
      en: "Earn confidence through honesty and results.",
      es: "Ganar confianza a través de honestidad y resultados.",
    },
  },
];

export const ABOUT_CONTENT = {
  hero: {
    title: { en: "About Brashline", es: "Acerca de Brashline" },
    subtitle: {
      en: "Digital made simple. Growth made real.",
      es: "Lo digital simplificado. Crecimiento real.",
    },
    description: {
      en: "Brashline helps businesses stay visible online with affordable plans, consistent content, and measurable results - no jargon, no fluff, just progress that lasts.",
      es: "Brashline ayuda a las empresas a mantenerse visibles en línea con planes asequibles, contenido consistente y resultados medibles, sin jerga, sin relleno, solo progreso que dura.",
    },
  },
  story: {
    title: { en: "Our Story", es: "Nuestra Historia" },
    paragraphs: [
      {
        en: "Brashline started as a simple idea between a few friends rooted in technology and design. Each had spent years helping local businesses build websites, manage social media, and solve digital problems that bigger agencies ignored. What they discovered was clear - small business owners weren't lacking ambition; they were being priced out of the digital world.",
        es: "Brashline comenzó como una idea simple entre algunos amigos arraigados en tecnología y diseño. Cada uno había pasado años ayudando a negocios locales a construir sitios web, gestionar redes sociales y resolver problemas digitales que las agencias más grandes ignoraban. Lo que descubrieron fue claro: los dueños de pequeñas empresas no carecían de ambición; estaban siendo excluidos del mundo digital.",
      },
      {
        en: "Professional agencies charged thousands for what most people really needed: visibility, consistency, and honest results. So they built Brashline - a digital agency designed for real people, not corporate budgets. No confusing retainers or inflated promises, just affordable, reliable, and practical solutions that help businesses look good, stay active, and grow online.",
        es: "Las agencias profesionales cobraban miles por lo que la mayoría de la gente realmente necesitaba: visibilidad, consistencia y resultados honestos. Así que construyeron Brashline, una agencia digital diseñada para personas reales, no para presupuestos corporativos. Sin anticipos confusos ni promesas infladas, solo soluciones asequibles, confiables y prácticas que ayudan a las empresas a verse bien, mantenerse activas y crecer en línea.",
      },
      {
        en: "The team's mission has stayed the same from day one: make technology work for small businesses, not against them. Whether it's creating steady social content, optimizing for search, or building websites that convert, Brashline keeps it simple, transparent, and effective.",
        es: "La misión del equipo ha permanecido igual desde el primer día: hacer que la tecnología funcione para las pequeñas empresas, no en su contra. Ya sea creando contenido social constante, optimizando para búsqueda o construyendo sitios web que conviertan, Brashline lo mantiene simple, transparente y efectivo.",
      },
      {
        en: "Real people. Real support. Real results. That's Brashline.",
        es: "Personas reales. Soporte real. Resultados reales. Eso es Brashline.",
      },
    ],
  },
};
