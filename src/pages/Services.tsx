/**
 * File overview: src/pages/Services.tsx
 *
 * React component `Services` rendering a focused piece of UI.
 * Behavior:
 * - Receives props from parents and may read from hooks or context.
 * - Renders presentational markup and wires callbacks for user interaction.
 * Data flow:
 * - Follows a one-way data flow: parents own data, this component focuses on display.
 * Performance:
 * - Avoid expensive work during render and prefer memoized helpers for heavy subtrees.
 */
import { RootLayout } from "@/components/layout/RootLayout";
import SEOHead from "@/components/SEO/SEOHead";
import { ServiceCard } from "@/components/features/ServiceCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useServices } from "@/hooks/useServices";
import { getPageSEO } from "@/utils/seo";
import { SECTION_PADDING_Y, CONTAINER_PADDING_X, SECTION_GAP } from "@/config/design-tokens";

const Services = () => {
  const { lang } = useLanguage();
  const { elementRef, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const pageSEO = getPageSEO("services");
  const services = useServices(lang);

  return (
    <RootLayout>
      <SEOHead pageSEO={pageSEO} lang={lang} />
      {/* Services Grid */}
      <section
        ref={elementRef as React.RefObject<HTMLElement>}
        className={`${SECTION_PADDING_Y} bg-background`}
      >
        <div className={`container mx-auto ${CONTAINER_PADDING_X}`}>
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              {lang === "en"
                ? "Social Media Services for Florida Businesses"
                : "Servicios de Redes Sociales para Negocios de Florida"}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {lang === "en"
                ? "Instagram management, content creation, Google Business Profile optimization, and more. Helping Orlando restaurants, salons, and local businesses grow online."
                : "Gestión de Instagram, creación de contenido, optimización de Google Business Profile y más. Ayudando a restaurantes, salones y negocios locales de Orlando a crecer en línea."}
            </p>
          </div>
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${SECTION_GAP}`}>
            {services.map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} isVisible={isVisible} />
            ))}
          </div>
        </div>
      </section>
    </RootLayout>
  );
};

export default Services;
