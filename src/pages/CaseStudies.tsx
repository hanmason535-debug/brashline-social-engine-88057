import { useState } from "react";
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
import { SparklesCore } from "@/components/ui/sparkles";

const CaseStudies = () => {
  const [lang, setLang] = useState<"en" | "es">("en");

  const caseStudies = [
    {
      title: { en: "Café in Winter Park", es: "Café en Winter Park" },
      summary: {
        en: "Four steady posts restored reach and inquiries in 60 days.",
        es: "Cuatro publicaciones constantes restauraron alcance y consultas en 60 días.",
      },
      image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=400&fit=crop",
      metrics: { en: "+120% reach, +45% inquiries", es: "+120% alcance, +45% consultas" },
    },
    {
      title: { en: "Mobile Detailer, Orlando", es: "Detallado Móvil, Orlando" },
      summary: {
        en: "Before-after reels and weekly stories lifted bookings.",
        es: "Reels de antes-después e historias semanales aumentaron reservas.",
      },
      image: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=600&h=400&fit=crop",
      metrics: { en: "+80% bookings", es: "+80% reservas" },
    },
    {
      title: { en: "Home Organizer, Lake Nona", es: "Organizadora, Lake Nona" },
      summary: {
        en: "Template graphics and reviews raised profile views.",
        es: "Gráficos y reseñas aumentaron vistas de perfil.",
      },
      image: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=600&h=400&fit=crop",
      metrics: { en: "+200% profile views", es: "+200% vistas de perfil" },
    },
    {
      title: { en: "Latin Eatery, Kissimmee", es: "Restaurante Latino, Kissimmee" },
      summary: {
        en: "Menu highlights with short captions increased saves.",
        es: "Destacados del menú con textos cortos aumentaron guardados.",
      },
      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop",
      metrics: { en: "+150% saves", es: "+150% guardados" },
    },
    {
      title: { en: "Yoga Studio, Winter Garden", es: "Estudio de Yoga, Winter Garden" },
      summary: {
        en: "Class schedules plus GBP updates improved discovery.",
        es: "Horarios de clases y actualizaciones de GBP mejoraron descubrimiento.",
      },
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=400&fit=crop",
      metrics: { en: "+90% discovery", es: "+90% descubrimiento" },
    },
    {
      title: { en: "Handyman, Altamonte", es: "Manitas, Altamonte" },
      summary: {
        en: "Quick before/after carousels drove quote requests.",
        es: "Carruseles rápidos de antes/después impulsaron solicitudes.",
      },
      image: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=600&h=400&fit=crop",
      metrics: { en: "+110% quote requests", es: "+110% solicitudes" },
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header lang={lang} onLanguageChange={setLang} />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/10 py-20">
          <div className="w-full absolute inset-0 h-full">
            <SparklesCore
              id="casestudies-sparkles"
              background="transparent"
              minSize={0.8}
              maxSize={2}
              colorful={true}
              particleDensity={120}
              className="w-full h-full"
              particleColor="rgba(255, 255, 255, 0.1)"
              speed={0.8}
            />
          </div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6">
              {lang === "en" ? "Our Work" : "Nuestros Casos"}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {lang === "en"
                ? "See how we've helped Florida businesses grow their social media presence."
                : "Mira cómo hemos ayudado a empresas de Florida a crecer su presencia en redes sociales."}
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
                {caseStudies.map((study, index) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                    <Card className="shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1 h-full">
                      <CardContent className="p-0 flex flex-col h-full">
                        <div className="aspect-[3/2] overflow-hidden rounded-t-lg">
                          <img
                            src={study.image}
                            alt={study.title[lang]}
                            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-300"
                          />
                        </div>
                        <div className="p-6 flex flex-col flex-1">
                          <h3 className="text-xl font-heading font-bold mb-3">
                            {study.title[lang]}
                          </h3>
                          <p className="text-muted-foreground text-sm mb-4 flex-1">
                            {study.summary[lang]}
                          </p>
                          <div className="text-xs font-semibold text-accent">
                            {study.metrics[lang]}
                          </div>
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
      <Footer lang={lang} />
    </div>
  );
};

export default CaseStudies;
