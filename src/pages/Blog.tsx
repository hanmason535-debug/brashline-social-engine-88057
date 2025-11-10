import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Meteors } from "@/components/ui/meteors";
import { useLanguage } from "@/contexts/LanguageContext";

const Blog = () => {
  const { lang } = useLanguage();

  const blogPosts = [
    {
      title: {
        en: "Florida SMB Social: The Minimum That Works",
        es: "Redes para Pymes de Florida: Lo Mínimo que Funciona",
      },
      summary: {
        en: "A two-post rhythm and one story per week keep you visible without burnout.",
        es: "Dos publicaciones y una historia por semana te mantienen visible sin agotamiento.",
      },
      image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&h=400&fit=crop",
      date: "2024-01-15",
    },
    {
      title: {
        en: "How to Turn Reviews into Posts",
        es: "Cómo Convertir Reseñas en Publicaciones",
      },
      summary: {
        en: "Turn real feedback into monthly content without sounding salesy.",
        es: "Convierte comentarios reales en contenido mensual sin sonar promocional.",
      },
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&h=400&fit=crop",
      date: "2024-01-10",
    },
    {
      title: {
        en: "Instagram Captions That Don't Waste Time",
        es: "Captions de Instagram que No Pierden Tiempo",
      },
      summary: {
        en: "Three caption patterns for local service brands.",
        es: "Tres patrones de caption para marcas de servicios locales.",
      },
      image: "https://images.unsplash.com/photo-1519337265831-281ec6cc8514?w=600&h=400&fit=crop",
      date: "2024-01-05",
    },
    {
      title: {
        en: "Local SEO Basics for Orlando",
        es: "Básicos de SEO Local para Orlando",
      },
      summary: {
        en: "GBP hygiene, weekly posts, and citations that actually matter.",
        es: "Higiene de GBP, publicaciones semanales y citaciones que importan.",
      },
      image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600&h=400&fit=crop",
      date: "2023-12-28",
    },
    {
      title: {
        en: "When to Add Light Ads",
        es: "Cuándo Agregar Anuncios Ligeros",
      },
      summary: {
        en: "A small, targeted boost that supports organic posts.",
        es: "Un impulso pequeño y dirigido que apoya publicaciones orgánicas.",
      },
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop",
      date: "2023-12-20",
    },
    {
      title: {
        en: "Reporting That Busy Owners Read",
        es: "Reportes que los Dueños Ocupados Leen",
      },
      summary: {
        en: "One page with reach, followers, and your two most effective posts.",
        es: "Una página con alcance, seguidores y tus dos publicaciones más efectivas.",
      },
      image: "https://images.unsplash.com/photo-1523475496153-3d6cc0a69f45?w=600&h=400&fit=crop",
      date: "2023-12-15",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
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

        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 max-w-6xl">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent>
                {blogPosts.map((post, index) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                    <Card className="shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1 h-full">
                      <CardContent className="p-0 flex flex-col h-full">
                        <div className="aspect-[3/2] overflow-hidden rounded-t-lg">
                          <img
                            src={post.image}
                            alt={post.title[lang]}
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
                            {post.title[lang]}
                          </h3>
                          <p className="text-muted-foreground text-sm flex-1">
                            {post.summary[lang]}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex" />
              <CarouselNext className="hidden md:flex" />
            </Carousel>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
