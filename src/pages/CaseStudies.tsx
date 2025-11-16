/**
 * File overview: src/pages/CaseStudies.tsx
 *
 * React component `CaseStudies` rendering a focused piece of UI.
 * Behavior:
 * - Receives props from parents and may read from hooks or context.
 * - Renders presentational markup and wires callbacks for user interaction.
 * Data flow:
 * - Follows a one-way data flow: parents own data, this component focuses on display.
 * Performance:
 * - Avoid expensive work during render and prefer memoized helpers for heavy subtrees.
 */
import { useState, useCallback } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/SEO/SEOHead";
import { Meteors } from "@/components/ui/meteors";
import { useLanguage } from "@/contexts/LanguageContext";
import { WebsiteProjectCard } from "@/components/work/WebsiteProjectCard";
import { SocialPostCard } from "@/components/work/SocialPostCard";
import { WorkFilters } from "@/components/work/WorkFilters";
import { StatsBar } from "@/components/work/StatsBar";
import { Lightbox } from "@/components/work/Lightbox";
import { useParallax } from "@/hooks/useParallax";
import { getPageSEO } from "@/utils/seo";
import { WebsiteData, SocialData } from "@/types/work.types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselDots,
  CarouselSwipeIndicator,
} from "@/components/ui/carousel";

type FilterType = "all" | "websites" | "social" | "branding";

const CaseStudies = () => {
  const { lang } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxData, setLightboxData] = useState<{ type: "website" | "social"; data: WebsiteData | SocialData; index: number; allItems: (WebsiteData | SocialData)[] } | null>(null);
  const pageSEO = getPageSEO("case-studies");

  const heroParallax = useParallax({ speed: 0.3, direction: "down" });
  const statsParallax = useParallax({ speed: 0.2, direction: "up" });

  const openLightbox = useCallback((type: "website" | "social", data: WebsiteData | SocialData, index: number, allItems: (WebsiteData | SocialData)[]) => {
    setLightboxData({ type, data, index, allItems });
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    setTimeout(() => setLightboxData(null), 300);
  }, []);

  const navigateLightbox = useCallback((direction: "prev" | "next") => {
    if (!lightboxData) return;
    
    const { allItems, index, type } = lightboxData;
    const newIndex = direction === "next" 
      ? (index + 1) % allItems.length 
      : (index - 1 + allItems.length) % allItems.length;
    
    setLightboxData({
      type,
      data: allItems[newIndex],
      index: newIndex,
      allItems
    });
  }, [lightboxData]);

  // Website Projects Data
  const websiteProjects: WebsiteData[] = [
    {
      title: { en: "Nav Techno Solutions", es: "Nav Techno Solutions" },
      description: {
        en: "Modern tech solutions website with sleek design and interactive features",
        es: "Sitio web de soluciones tecnológicas modernas con diseño elegante y funciones interactivas",
      },
      url: "https://navtechno.in/",
      thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
      techStack: ["React", "TypeScript", "Tailwind CSS"],
      category: { en: "Technology", es: "Tecnología" },
    },
    {
      title: { en: "Western Hydro Movers", es: "Western Hydro Movers" },
      description: {
        en: "Professional moving company website with booking system and service showcase",
        es: "Sitio web de empresa de mudanzas profesional con sistema de reservas y exhibición de servicios",
      },
      url: "https://www.westernhydromovers.com/",
      thumbnail: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=600&fit=crop",
      techStack: ["WordPress", "WooCommerce", "Custom CSS"],
      category: { en: "Services", es: "Servicios" },
    },
    {
      title: { en: "Café Cito Santa Fe", es: "Café Cito Santa Fe" },
      description: {
        en: "Cozy coffee shop website with online ordering and menu showcase",
        es: "Sitio web de cafetería acogedor con pedidos en línea y exhibición de menú",
      },
      url: "https://www.cafecitosantafe.com/",
      thumbnail: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=600&fit=crop",
      techStack: ["Shopify", "Liquid", "Custom Theme"],
      category: { en: "Food & Beverage", es: "Comida y Bebida" },
    },
    {
      title: { en: "Running Explained", es: "Running Explained" },
      description: {
        en: "Fitness and running blog with training programs and community features",
        es: "Blog de fitness y running con programas de entrenamiento y funciones comunitarias",
      },
      url: "https://www.runningexplained.com/",
      thumbnail: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop",
      techStack: ["WordPress", "Elementor", "WP Forms"],
      category: { en: "Fitness", es: "Fitness" },
    },
    {
      title: { en: "OOB Portland Restaurant", es: "Restaurante OOB Portland" },
      description: {
        en: "Modern restaurant website with interactive menu and reservation system",
        es: "Sitio web de restaurante moderno con menú interactivo y sistema de reservas",
      },
      url: "https://oobpdx.com/",
      thumbnail: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop",
      techStack: ["React", "Node.js", "OpenTable API"],
      category: { en: "Restaurant", es: "Restaurante" },
    },
    {
      title: { en: "Thompson Legal Services", es: "Servicios Legales Thompson" },
      description: {
        en: "Professional law firm website with case studies and client portal",
        es: "Sitio web de bufete de abogados profesional con estudios de casos y portal de clientes",
      },
      url: "https://www.thomplegal.com/",
      thumbnail: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=600&fit=crop",
      techStack: ["WordPress", "Custom CMS", "SSL Security"],
      category: { en: "Professional Services", es: "Servicios Profesionales" },
    },
  ];

  // Social Media Posts Data
  const socialPosts: SocialData[] = [
    {
      platform: "instagram" as const,
      type: "single" as const,
      image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=600&fit=crop",
      caption: {
        en: "☕️ Grand opening celebration! Come taste our signature latte art. #CafeLife #GrandOpening",
        es: "☕️ ¡Celebración de gran apertura! Ven a probar nuestro arte latte característico. #VidaDeCafé #GranApertura",
      },
      engagement: { likes: 847, comments: 23, saves: 156 },
      timestamp: "2d ago",
    },
    {
      platform: "instagram" as const,
      type: "carousel" as const,
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=600&fit=crop",
      caption: {
        en: "🔥 Client transformation in just 8 weeks! Swipe to see the journey. #FitnessGoals #Transformation",
        es: "🔥 ¡Transformación del cliente en solo 8 semanas! Desliza para ver el viaje. #ObjetivosDeEstadoFísico #Transformación",
      },
      engagement: { likes: 1234, comments: 45, saves: 892 },
      timestamp: "3d ago",
    },
    {
      platform: "facebook" as const,
      type: "video" as const,
      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=600&fit=crop",
      caption: {
        en: "🍴 Chef's special of the week! Watch how we prepare our signature dish. #ChefSpecial #Foodie",
        es: "🍴 ¡Especial del chef de la semana! Mira cómo preparamos nuestro plato característico. #EspecialDelChef #Foodie",
      },
      engagement: { views: 2345, likes: 156, comments: 34, shares: 12 },
      timestamp: "5d ago",
    },
    {
      platform: "instagram" as const,
      type: "single" as const,
      image: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=600&h=600&fit=crop",
      caption: {
        en: "✨ 5 tips for organizing your home workspace. Save this for later! #HomeOrganization #ProductivityTips",
        es: "✨ 5 consejos para organizar tu espacio de trabajo en casa. ¡Guarda esto para después! #OrganizaciónDelHogar #ConsejosDeLaNación",
      },
      engagement: { likes: 634, saves: 892, comments: 18 },
      timestamp: "1w ago",
    },
    {
      platform: "instagram" as const,
      type: "before-after" as const,
      image: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=600&h=600&fit=crop",
      caption: {
        en: "🚗 Before & After ceramic coating! Book your detailing appointment today. #CarDetailing #BeforeAfter",
        es: "🚗 ¡Antes y después del recubrimiento cerámico! Reserva tu cita de detallado hoy. #DetalladoDeAutos #AntesDespués",
      },
      engagement: { likes: 1567, comments: 67, shares: 23 },
      timestamp: "1w ago",
    },
    {
      platform: "linkedin" as const,
      type: "single" as const,
      image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&h=600&fit=crop",
      caption: {
        en: "💼 Success in business requires training, discipline & hard work. #BusinessTips #Motivation",
        es: "💼 El éxito en los negocios requiere entrenamiento, disciplina y trabajo duro. #ConsejosDeNegocios #Motivación",
      },
      engagement: { likes: 423, comments: 12 },
      timestamp: "2w ago",
    },
    {
      platform: "instagram" as const,
      type: "carousel" as const,
      image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&h=600&fit=crop",
      caption: {
        en: "🏋️ Weekly workout routine for beginners. Swipe through all exercises! #WorkoutRoutine #Fitness",
        es: "🏋️ Rutina de ejercicios semanal para principiantes. ¡Desliza por todos los ejercicios! #RutinaDeEjercicio #Fitness",
      },
      engagement: { likes: 978, comments: 56, saves: 1234 },
      timestamp: "2w ago",
    },
    {
      platform: "facebook" as const,
      type: "single" as const,
      image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&h=600&fit=crop",
      caption: {
        en: "🎉 Customer appreciation week! Special discounts all week long. #CustomerAppreciation #Sale",
        es: "🎉 ¡Semana de apreciación al cliente! Descuentos especiales toda la semana. #ApreciaciónAlCliente #Venta",
      },
      engagement: { likes: 567, comments: 89, shares: 45 },
      timestamp: "2w ago",
    },
    {
      platform: "instagram" as const,
      type: "video" as const,
      image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&h=600&fit=crop",
      caption: {
        en: "☕️ Behind the scenes: How we roast our signature coffee blend. #CoffeeRoasting #BehindTheScenes",
        es: "☕️ Detrás de escena: Cómo tostamos nuestra mezcla de café característica. #TostadoDeCafé #DetrásDe escena",
      },
      engagement: { views: 3456, likes: 892, comments: 67 },
      timestamp: "3w ago",
    },
    {
      platform: "instagram" as const,
      type: "single" as const,
      image: "https://images.unsplash.com/photo-1574169208507-84376144848b?w=600&h=600&fit=crop",
      caption: {
        en: "🌿 New plant-based menu items available now! Try our signature bowls. #PlantBased #HealthyEating",
        es: "🌿 ¡Nuevos elementos de menú a base de plantas disponibles ahora! Prueba nuestros tazones característicos. #BaseDeVegetales #AlimentaciónSaludable",
      },
      engagement: { likes: 1123, comments: 45, saves: 678 },
      timestamp: "3w ago",
    },
    {
      platform: "linkedin" as const,
      type: "single" as const,
      image: "https://images.unsplash.com/photo-1552581234-26160f608093?w=600&h=600&fit=crop",
      caption: {
        en: "📊 Data-driven decision making: The key to business growth in 2024. #BusinessStrategy #DataAnalytics",
        es: "📊 Toma de decisiones basada en datos: La clave para el crecimiento empresarial en 2024. #EstrategiaEmpresarial #AnálisisDeDatos",
      },
      engagement: { likes: 567, comments: 23 },
      timestamp: "4w ago",
    },
    {
      platform: "facebook" as const,
      type: "carousel" as const,
      image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=600&h=600&fit=crop",
      caption: {
        en: "🎯 Team building event highlights! Swipe to see all the fun moments. #TeamBuilding #CompanyCulture",
        es: "🎯 ¡Destacados del evento de construcción de equipo! Desliza para ver todos los momentos divertidos. #ConstrucciónDeEquipo #CulturaEmpresarial",
      },
      engagement: { likes: 789, comments: 34, shares: 56 },
      timestamp: "4w ago",
    },
  ];

  // Chunk websites into pages of 6
  const websitesPerPage = 6;
  const websitePages = [];
  for (let i = 0; i < websiteProjects.length; i += websitesPerPage) {
    websitePages.push(websiteProjects.slice(i, i + websitesPerPage));
  }

  const filteredData = () => {
    if (activeFilter === "all") return { websites: websitePages, social: socialPosts };
    if (activeFilter === "websites") return { websites: websitePages, social: [] };
    if (activeFilter === "social") return { websites: [], social: socialPosts };
    return { websites: [], social: [] };
  };

  const { websites, social } = filteredData();

  return (
    <>
      <SEOHead pageSEO={pageSEO} lang={lang} />
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
        {/* Hero Section with Parallax */}
        <section className="relative overflow-hidden bg-muted py-20">
          <div 
            className="w-full absolute inset-0 h-full"
            style={{ 
              transform: `translateY(${heroParallax}px)`,
              willChange: 'transform'
            }}
          >
            <Meteors number={30} />
          </div>
          <div 
            className="container mx-auto px-4 text-center relative z-10"
            style={{ 
              transform: `translateY(${heroParallax * 0.5}px)`,
              willChange: 'transform'
            }}
          >
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6">
              {lang === "en" ? "Our Work" : "Nuestro Trabajo"}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {lang === "en"
                ? "Showcasing our best projects in web design, development, and social media marketing."
                : "Mostrando nuestros mejores proyectos en diseño web, desarrollo y marketing en redes sociales."}
            </p>
          </div>
        </section>

        {/* Stats Bar with Parallax */}
        <section className="py-8 bg-background">
          <div 
            className="container mx-auto px-4"
            style={{ 
              transform: `translateY(${statsParallax}px)`,
              willChange: 'transform'
            }}
          >
            <StatsBar lang={lang} />
          </div>
        </section>

        {/* Filters */}
        <section className="py-12 bg-background">
          <div className="container mx-auto px-4">
            <WorkFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} lang={lang} />
          </div>
        </section>

        {/* Website Projects Section */}
        {websites.length > 0 && (
          <section className="pb-16 bg-background">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4 text-center">
                {lang === "en" ? "Website Projects" : "Proyectos de Sitios Web"}
              </h2>
              <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
                {lang === "en"
                  ? "Explore our portfolio of beautiful, functional websites built for diverse businesses."
                  : "Explora nuestro portafolio de sitios web hermosos y funcionales construidos para negocios diversos."}
              </p>

              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full max-w-7xl mx-auto"
              >
                <CarouselContent>
                  {websites.map((page, pageIndex) => (
                    <CarouselItem key={pageIndex}>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {page.map((project, index) => {
                          const globalIndex = pageIndex * websitesPerPage + index;
                          return (
                            <WebsiteProjectCard
                              key={index}
                              project={project}
                              lang={lang}
                              index={index}
                              onOpenLightbox={() => openLightbox("website", project, globalIndex, websiteProjects)}
                            />
                          );
                        })}
                      </div>
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
        )}

        {/* Social Media Section */}
        {social.length > 0 && (
          <section className="py-16 bg-muted">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4 text-center">
                {lang === "en" ? "Social Media Posts" : "Publicaciones en Redes Sociales"}
              </h2>
              <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
                {lang === "en"
                  ? "Real posts from real businesses. See how we help brands grow their online presence."
                  : "Publicaciones reales de negocios reales. Mira cómo ayudamos a las marcas a crecer su presencia en línea."}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
                {social.map((post, index) => (
                  <SocialPostCard 
                    key={index} 
                    post={post} 
                    lang={lang} 
                    index={index}
                    onOpenLightbox={() => openLightbox("social", post, index, socialPosts)}
                  />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />

      {/* Lightbox */}
      {lightboxData && (
        <Lightbox
          isOpen={lightboxOpen}
          onClose={closeLightbox}
          type={lightboxData.type}
          data={lightboxData.data}
          lang={lang}
          allItems={lightboxData.allItems}
          currentIndex={lightboxData.index}
          onNavigate={navigateLightbox}
        />
      )}
    </div>
    </>
  );
};

export default CaseStudies;
