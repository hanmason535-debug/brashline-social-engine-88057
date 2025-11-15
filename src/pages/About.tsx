/**
 * File overview: src/pages/About.tsx
 *
 * React component `About` rendering a focused piece of UI.
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
import { Card, CardContent } from "@/components/ui/card";
import { Meteors } from "@/components/ui/meteors";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAbout } from "@/hooks/useAbout";
import { getPageSEO } from "@/utils/seo";

const About = () => {
  const { lang } = useLanguage();
  const { valueCards, content } = useAbout(lang);
  const pageSEO = getPageSEO("about");

  return (
    <>
      <MetaManager pageSEO={pageSEO} lang={lang} />
      <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-muted py-20">
          <div className="w-full absolute inset-0 h-full">
            <Meteors number={30} />
          </div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6">
              {content.hero.title}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {content.hero.subtitle}
            </p>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mt-4">
              {content.hero.description}
            </p>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="prose prose-lg mx-auto mb-12">
              <h2 className="text-3xl font-heading font-bold mb-6 text-foreground">
                {content.story.title}
              </h2>
              {content.story.paragraphs.map((paragraph, index) => (
                <p 
                  key={index} 
                  className={`text-muted-foreground leading-relaxed mb-4 ${
                    index === content.story.paragraphs.length - 1 ? 'font-semibold' : ''
                  }`}
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {valueCards.map((card, index) => {
                const Icon = card.icon;
                return (
                  <Card key={index} className="shadow-soft">
                    <CardContent className="p-6 text-center">
                      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-muted mb-4">
                        <Icon className="h-7 w-7 text-foreground" />
                      </div>
                      <h3 className="font-heading font-semibold mb-2 text-foreground">
                        {card.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {card.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
    </>
  );
};

export default About;
