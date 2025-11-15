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
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import SEOHead from "@/components/SEO/SEOHead";
import StructuredData from "@/components/SEO/StructuredData";
import { useLanguage } from "@/contexts/LanguageContext";
import { getPageSEO } from "@/utils/seo";

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
    <>
      <SEOHead pageSEO={pageSEO} lang={lang} />
      <StructuredData />
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
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
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
