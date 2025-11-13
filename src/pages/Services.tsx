import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/SEO/SEOHead";
import { Card, CardContent } from "@/components/ui/card";
import { Share2, Globe, Search, Target, ShoppingCart, Palette, Calendar, BarChart3, MessageCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { getPageSEO } from "@/utils/seo";

const Services = () => {
  const { lang } = useLanguage();
  const { elementRef, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const pageSEO = getPageSEO("services");

  const services = [
    {
      icon: Share2,
      title: { en: "Social Media Management", es: "Gestión de Redes Sociales" },
      description: {
        en: "Consistent, on-brand posting and engagement across Instagram, Facebook, Google, Nextdoor, Yelp, and more.",
        es: "Publicación y engagement constante y de marca en Instagram, Facebook, Google, Nextdoor, Yelp y más.",
      },
    },
    {
      icon: Globe,
      title: { en: "Website Design & Development", es: "Diseño y Desarrollo Web" },
      description: {
        en: "Modern, responsive sites built to convert and reflect your brand.",
        es: "Sitios modernos y responsivos construidos para convertir y reflejar tu marca.",
      },
    },
    {
      icon: Search,
      title: { en: "SEO & Local Visibility", es: "SEO y Visibilidad Local" },
      description: {
        en: "Optimize search rankings and keep your business easily found on Google and maps.",
        es: "Optimiza rankings de búsqueda y mantén tu negocio fácilmente encontrable en Google y mapas.",
      },
    },
    {
      icon: Target,
      title: { en: "Ad Management", es: "Gestión de Anuncios" },
      description: {
        en: "Targeted campaigns across Meta, Google, Yelp, and more for measurable reach and ROI.",
        es: "Campañas dirigidas en Meta, Google, Yelp y más para alcance y ROI medibles.",
      },
    },
    {
      icon: ShoppingCart,
      title: { en: "E-Commerce Setup & Management", es: "Configuración y Gestión de E-Commerce" },
      description: {
        en: "Amazon, Shopify, DoorDash, UberEats, and Groupon store creation and optimization.",
        es: "Creación y optimización de tiendas en Amazon, Shopify, DoorDash, UberEats y Groupon.",
      },
    },
    {
      icon: Palette,
      title: { en: "Digital Branding", es: "Branding Digital" },
      description: {
        en: "Logos, visuals, and a consistent identity that connects across every platform.",
        es: "Logotipos, visuales e identidad consistente que conecta en todas las plataformas.",
      },
    },
    {
      icon: Calendar,
      title: { en: "Content Strategy & Scheduling", es: "Estrategia y Programación de Contenido" },
      description: {
        en: "Organic content planned, created, and posted regularly to keep you visible.",
        es: "Contenido orgánico planificado, creado y publicado regularmente para mantenerte visible.",
      },
    },
    {
      icon: BarChart3,
      title: { en: "Analytics & Reporting", es: "Análisis e Informes" },
      description: {
        en: "Transparent results that show what's working and where to grow.",
        es: "Resultados transparentes que muestran qué funciona y dónde crecer.",
      },
    },
    {
      icon: MessageCircle,
      title: { en: "Online Reputation Management", es: "Gestión de Reputación Online" },
      description: {
        en: "Monitor reviews, respond to feedback, and strengthen your brand's public image.",
        es: "Monitorea reseñas, responde a comentarios y fortalece la imagen pública de tu marca.",
      },
    },
  ];

  return (
    <>
      <SEOHead pageSEO={pageSEO} lang={lang} />
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          {/* Services Grid */}
          <section ref={elementRef as React.RefObject<HTMLElement>} className="py-16 md:py-24 bg-background">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
                  {lang === "en" ? "Our Services" : "Nuestros Servicios"}
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  {lang === "en"
                    ? "Comprehensive social media and digital marketing services for Florida businesses"
                    : "Servicios integrales de redes sociales y marketing digital para negocios de Florida"}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => {
                const Icon = service.icon;
                return (
                  <Card 
                    key={index} 
                    className={`shadow-soft hover:shadow-medium transition-all duration-700 hover:-translate-y-1 ${
                      isVisible
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-10'
                    }`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <CardContent className="p-8">
                      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-muted mb-6">
                        <Icon className="h-7 w-7 text-foreground" />
                      </div>
                      <h3 className="text-xl font-heading font-semibold mb-4">
                        {service.title[lang]}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {service.description[lang]}
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

export default Services;
