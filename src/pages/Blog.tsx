/**
 * File overview: src/pages/Blog.tsx
 *
 * React component `Blog` rendering a focused piece of UI.
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
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselDots,
  CarouselSwipeIndicator,
} from "@/components/ui/carousel";
import { Meteors } from "@/components/ui/meteors";
import { useLanguage } from "@/contexts/LanguageContext";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useBlog } from "@/hooks/useBlog";
import { getPageSEO } from "@/utils/seo";

const Blog = () => {
  const { lang } = useLanguage();
  const { elementRef, isVisible } = useScrollAnimation({ threshold: 0.2 });
  const { blogPosts } = useBlog(lang);
  const pageSEO = getPageSEO("blog");

  return (
    <RootLayout>
      <SEOHead pageSEO={pageSEO} lang={lang} />
      <section className="relative overflow-hidden bg-muted py-20">
        <div className="w-full absolute inset-0 h-full">
          <Meteors number={30} />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6">
            {lang === "en" ? "Blog" : "Blog"}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {lang === "en"
              ? "Tips, insights, and updates from the Brashline team."
              : "Consejos, insights y actualizaciones del equipo de Brashline."}
          </p>
        </div>
      </section>

      <section ref={elementRef as React.RefObject<HTMLElement>} className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <Carousel
            opts={{
              align: "start",
              loop: true,
              dragFree: true,
            }}
            className={`w-full transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {blogPosts.map((post, index) => (
                <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                  <Card className="shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1 h-full">
                    <CardContent className="p-0 flex flex-col h-full">
                      <div className="aspect-[3/2] overflow-hidden rounded-t-lg">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-300"
                          loading="lazy"
                        />
                      </div>
                      <div className="p-6 flex flex-col flex-1">
                        <div className="text-xs text-muted-foreground mb-2">
                          {new Date(post.date).toLocaleDateString(lang === "en" ? "en-US" : "es-ES", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </div>
                        <h3 className="text-xl font-heading font-bold mb-3">
                          {post.title}
                        </h3>
                        <p className="text-muted-foreground text-sm flex-1">
                          {post.summary}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
            <CarouselDots className="mt-8" />
            <CarouselSwipeIndicator />
          </Carousel>
        </div>
      </section>
    </RootLayout>
  );
};

export default Blog;
