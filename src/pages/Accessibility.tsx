/**
 * File overview: src/pages/Accessibility.tsx
 *
 * React component `Accessibility` rendering a focused piece of UI.
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

const Accessibility = () => {
  const { lang } = useLanguage();
  const pageSEO = getPageSEO("accessibility");

  return (
    <>
      <MetaManager pageSEO={pageSEO} lang={lang} />
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-4">Accessibility Statement</h1>
          <p>
            We are committed to making our website accessible to everyone. If you have any questions or suggestions regarding the accessibility of this site, please contact us.
          </p>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Accessibility;
