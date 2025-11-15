/**
 * File overview: src/pages/Terms.tsx
 *
 * React component `Terms` rendering a focused piece of UI.
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

const Terms = () => {
  const { lang } = useLanguage();
  const pageSEO = getPageSEO("terms");

  return (
    <>
      <MetaManager pageSEO={pageSEO} lang={lang} />
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
          <p>
            By using our website, you agree to comply with and be bound by the following terms and conditions of use.
          </p>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Terms;
