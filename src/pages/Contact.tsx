/**
 * File overview: src/pages/Contact.tsx
 *
 * React component `Contact` rendering a focused piece of UI.
 * Behavior:
 * - Receives props from parents and may read from hooks or context.
 * - Renders presentational markup and wires callbacks for user interaction.
 * Data flow:
 * - Follows a one-way data flow: parents own data, this component focuses on display.
 * Performance:
 * - Avoid expensive work during render and prefer memoized helpers for heavy subtrees.
 */
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MetaManager from "@/components/SEO/MetaManager";
import { useLanguage } from "@/contexts/LanguageContext";
import { getPageSEO } from "@/utils/seo";
import { ContactForm } from "@/components/forms/ContactForm";

const Contact = () => {
  const { lang } = useLanguage();
  const pageSEO = getPageSEO("contact");

  return (
    <>
      <MetaManager pageSEO={pageSEO} lang={lang} />
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-8 text-center">
            {lang === "en" ? "Contact Us" : "Contáctenos"}
          </h1>
          <div className="max-w-xl mx-auto">
            <ContactForm lang={lang} />
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Contact;
