/**
 * File overview: src/pages/Index.tsx
 *
 * React component `Index` rendering a focused piece of UI.
 * Behavior:
 * - Receives props from parents and may read from hooks or context.
 * - Renders presentational markup and wires callbacks for user interaction.
 * Data flow:
 * - Follows a one-way data flow: parents own data, this component focuses on display.
 * Performance:
 * - Avoid expensive work during render and prefer memoized helpers for heavy subtrees.
 */
import { Suspense, lazy } from "react";
import { RootLayout } from "@/components/layout/RootLayout";
import Hero from "@/components/home/Hero";
import SEOHead from "@/components/SEO/SEOHead";
import StructuredData from "@/components/SEO/StructuredData";
import { useLanguage } from "@/contexts/LanguageContext";
import { getPageSEO } from "@/utils/seo";
import { ContactFormDialog } from "@/components/forms/ContactFormDialog";

// Lazy load below-the-fold components for better FCP/LCP
const ValueProps = lazy(() => import("@/components/home/ValueProps"));
const StatsSection = lazy(() => import("@/components/home/StatsSection"));
const PricingPreview = lazy(() => import("@/components/home/PricingPreview"));

// Lightweight loading fallback
const SectionLoader = () => (
  <div className="py-20 flex justify-center">
    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const Index = () => {
  const { lang } = useLanguage();
  const pageSEO = getPageSEO("home");

  return (
    <RootLayout>
      <SEOHead pageSEO={pageSEO} lang={lang} />
      <StructuredData />
      <Hero lang={lang} />
      <Suspense fallback={<SectionLoader />}>
        <ValueProps lang={lang} />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <StatsSection lang={lang} />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <PricingPreview lang={lang} />
      </Suspense>

      {/* CTA Section with Contact Form Dialog */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            {lang === "en" ? "Ready to Get Started?" : "¿Listo para Comenzar?"}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            {lang === "en"
              ? "Let's discuss how we can help grow your social media presence."
              : "Discutamos cómo podemos ayudarte a hacer crecer tu presencia en redes sociales."}
          </p>
          <ContactFormDialog lang={lang} />
        </div>
      </section>
    </RootLayout>
  );
};

export default Index;
