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
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import SEOHead from "@/components/SEO/SEOHead";
import StructuredData from "@/components/SEO/StructuredData";
import { useLanguage } from "@/contexts/LanguageContext";
import { getPageSEO } from "@/utils/seo";
import { ContactFormDialog } from "@/components/forms/ContactFormDialog";

// Lazy load below-the-fold components for better FCP/LCP
const TrustedBy = lazy(() => import("@/components/home/TrustedBy"));
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
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <>
      <SEOHead pageSEO={pageSEO} lang={lang} />
      <StructuredData />
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Hero lang={lang} />
          <Suspense fallback={<SectionLoader />}>
            <TrustedBy />
          </Suspense>
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
          <section ref={ref} className="py-24 bg-muted/50 relative overflow-hidden">
            <div className="absolute inset-0 z-0 opacity-10">
              {/* Add a subtle background pattern or graphic here if available */}
            </div>
            <div className="container mx-auto px-4 text-center relative z-10">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5 }}
                className="text-3xl md:text-4xl font-heading font-bold mb-4"
              >
                {lang === "en" ? "Ready to Get Started?" : "¿Listo para Comenzar?"}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
              >
                {lang === "en"
                  ? "Let's discuss how we can help grow your social media presence."
                  : "Discutamos cómo podemos ayudarte a hacer crecer tu presencia en redes sociales."}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <ContactFormDialog lang={lang} />
              </motion.div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
