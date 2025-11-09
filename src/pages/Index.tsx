import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import ValueProps from "@/components/home/ValueProps";
import PricingPreview from "@/components/home/PricingPreview";
import { useLanguage } from "@/contexts/LanguageContext";

const Index = () => {
  const { lang } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero lang={lang} />
        <ValueProps lang={lang} />
        <PricingPreview lang={lang} />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
