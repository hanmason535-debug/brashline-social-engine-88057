import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import ValueProps from "@/components/home/ValueProps";
import PricingPreview from "@/components/home/PricingPreview";

const Index = () => {
  const [lang, setLang] = useState<"en" | "es">("en");

  return (
    <div className="min-h-screen flex flex-col">
      <Header lang={lang} onLanguageChange={setLang} />
      <main className="flex-1">
        <Hero lang={lang} />
        <ValueProps lang={lang} />
        <PricingPreview lang={lang} />
      </main>
      <Footer lang={lang} />
    </div>
  );
};

export default Index;
