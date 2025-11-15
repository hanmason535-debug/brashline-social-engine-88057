/**
 * File overview: src/pages/Cookies.tsx
 *
 * React component `Cookies` rendering a focused piece of UI.
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
import { useLanguage } from "@/contexts/LanguageContext";
import { getPageSEO } from "@/utils/seo";

const Cookies = () => {
  const { lang } = useLanguage();
  const pageSEO = getPageSEO("cookies");

  return (
    <RootLayout>
      <SEOHead pageSEO={pageSEO} lang={lang} />
      <div className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-heading font-bold mb-8 text-foreground">
            {lang === "en" ? "Cookies Policy" : "Política de Cookies"}
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <div className="space-y-8">
              <section>
                <div className="space-y-6 text-muted-foreground">
                  <div>
                    <h3 className="text-xl font-heading font-semibold mb-3 text-foreground">1. What Are Cookies</h3>
                    <p className="leading-relaxed">
                      Cookies are small text files stored on your device when you visit a website. They help us understand how visitors use our site and improve performance, security, and personalization.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-heading font-semibold mb-3 text-foreground">2. How Brashline Uses Cookies</h3>
                    <p className="leading-relaxed mb-3">
                      Brashline uses cookies to:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Improve site performance and navigation</li>
                      <li>Track anonymous analytics data (e.g., pages visited, time on site)</li>
                      <li>Remember your preferences and login session (where applicable)</li>
                      <li>Enhance security and prevent spam or abuse</li>
                    </ul>
                    <p className="leading-relaxed mt-3">
                      We use tools such as Google Analytics, Meta Pixel, and similar technologies to measure performance and optimize campaigns. These may set their own cookies according to their privacy policies.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-heading font-semibold mb-3 text-foreground">3. Your Choices</h3>
                    <p className="leading-relaxed">
                      You can manage or disable cookies in your browser settings. However, some features of the website may not function properly if cookies are turned off.
                    </p>
                    <p className="leading-relaxed mt-3">
                      By continuing to use our website, you consent to our use of cookies as described in this policy.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-heading font-semibold mb-3 text-foreground">4. Third-Party Cookies</h3>
                    <p className="leading-relaxed">
                      Some cookies are set by external services (e.g., analytics or embedded content). Brashline has no control over these third-party cookies, but we ensure they are used only for legitimate business and analytics purposes.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </RootLayout>
  );
};

export default Cookies;
