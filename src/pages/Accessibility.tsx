import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const Accessibility = () => {
  const [lang, setLang] = useState<"en" | "es">("en");

  return (
    <div className="min-h-screen flex flex-col">
      <Header lang={lang} onLanguageChange={setLang} />
      <main className="flex-1 py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-heading font-bold mb-8 text-foreground">
            {lang === "en" ? "Accessibility Statement" : "Declaración de Accesibilidad"}
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <div className="space-y-8">
              <section>
                
                <div className="space-y-6 text-muted-foreground">
                  <div>
                    <h3 className="text-xl font-heading font-semibold mb-3 text-foreground">1. Our Commitment</h3>
                    <p className="leading-relaxed">
                      Brashline is committed to ensuring digital accessibility for all users, including those with disabilities. We continually improve the user experience of our website to comply with WCAG 2.1 AA standards and applicable accessibility laws.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-heading font-semibold mb-3 text-foreground">2. Efforts Toward Accessibility</h3>
                    <p className="leading-relaxed mb-3">
                      We design and maintain our website to be:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Navigable by keyboard and assistive technologies</li>
                      <li>Readable with appropriate contrast, color balance, and font choices</li>
                      <li>Compatible with screen readers and browser zoom tools</li>
                      <li>Responsive and accessible on mobile and desktop devices</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-heading font-semibold mb-3 text-foreground">3. Ongoing Improvements</h3>
                    <p className="leading-relaxed">
                      Accessibility is an ongoing effort. Brashline reviews its content regularly to identify and correct issues as technologies evolve.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-heading font-semibold mb-3 text-foreground">4. Feedback</h3>
                    <p className="leading-relaxed mb-3">
                      We welcome feedback to help us serve every user better. If you experience difficulty accessing any part of our website or content, please contact us at:
                    </p>
                    <p className="leading-relaxed">
                      Email: <a href="mailto:support@brashline.com" className="text-primary hover:underline">support@brashline.com</a><br />
                      Subject Line: Accessibility Feedback
                    </p>
                    <p className="leading-relaxed mt-3">
                      We will respond promptly to address the issue and provide the requested information in an accessible format.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer lang={lang} />
    </div>
  );
};

export default Accessibility;
