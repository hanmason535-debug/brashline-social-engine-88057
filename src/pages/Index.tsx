import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import ValueProps from "@/components/home/ValueProps";
import PricingPreview from "@/components/home/PricingPreview";
import StatsSection from "@/components/home/StatsSection";
import SEOHead from "@/components/SEO/SEOHead";
import StructuredData from "@/components/SEO/StructuredData";
import { useLanguage } from "@/contexts/LanguageContext";
import { getPageSEO } from "@/utils/seo";

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
          <ValueProps lang={lang} />
          <StatsSection lang={lang} />
          <PricingPreview lang={lang} />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
