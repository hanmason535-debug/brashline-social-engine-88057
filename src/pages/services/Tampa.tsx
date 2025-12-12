/**
 * Tampa Location Page
 * SEO-optimized landing page for Tampa market expansion
 */

import { RootLayout } from "@/components/layout/RootLayout";
import SEOHead from "@/components/SEO/SEOHead";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
    Share2,
    Globe,
    Search,
    Target,
    ShoppingCart,
    MessageCircle,
    ArrowRight,
    MapPin,
    Phone,
    Mail,
} from "lucide-react";
import { SEO_CONFIG } from "@/utils/seo";

const TAMPA_SERVICES = [
    {
        icon: Share2,
        title: { en: "Social Media Management", es: "Gestión de Redes Sociales" },
        description: {
            en: "Consistent posting on Instagram, Facebook, and Google for Tampa businesses",
            es: "Publicaciones consistentes en Instagram, Facebook y Google para negocios de Tampa",
        },
    },
    {
        icon: Globe,
        title: { en: "Website Design", es: "Diseño Web" },
        description: {
            en: "Modern, mobile-friendly websites for Tampa restaurants and retailers",
            es: "Sitios web modernos y móviles para restaurantes y minoristas de Tampa",
        },
    },
    {
        icon: Search,
        title: { en: "Local SEO", es: "SEO Local" },
        description: {
            en: "Rank higher in Google Maps for Tampa Bay area searches",
            es: "Posiciónate más alto en Google Maps para búsquedas del área de Tampa Bay",
        },
    },
    {
        icon: Target,
        title: { en: "Google & Meta Ads", es: "Anuncios de Google y Meta" },
        description: {
            en: "Targeted advertising to reach Tampa customers",
            es: "Publicidad dirigida para llegar a clientes de Tampa",
        },
    },
    {
        icon: ShoppingCart,
        title: { en: "E-Commerce Setup", es: "Configuración de E-Commerce" },
        description: {
            en: "DoorDash, UberEats, and Shopify integration for Tampa restaurants",
            es: "Integración de DoorDash, UberEats y Shopify para restaurantes de Tampa",
        },
    },
    {
        icon: MessageCircle,
        title: { en: "Reputation Management", es: "Gestión de Reputación" },
        description: {
            en: "Monitor and respond to Yelp and Google reviews in Tampa",
            es: "Monitorea y responde a reseñas de Yelp y Google en Tampa",
        },
    },
];

const TampaPage = () => {
    const { lang } = useLanguage();

    const pageSEO = {
        title: "Social Media Management Tampa | Brashline Florida",
        description:
            "Tampa social media agency for small business. Instagram management, Google Business Profile optimization, and content creation for Tampa Bay restaurants, salons, and local businesses.",
        keywords:
            "social media management Tampa, Tampa social media agency, Instagram management Tampa FL, Google Business Profile Tampa, social media for restaurants Tampa, local business marketing Tampa Bay",
        canonical: `${SEO_CONFIG.siteUrl}/services/tampa`,
    };

    // LocalBusiness schema for Tampa
    const tampaSchema = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: "Brashline - Tampa",
        description: pageSEO.description,
        url: pageSEO.canonical,
        telephone: SEO_CONFIG.business.phone,
        email: SEO_CONFIG.business.email,
        areaServed: {
            "@type": "City",
            name: "Tampa",
            containedInPlace: {
                "@type": "State",
                name: "Florida",
            },
        },
        serviceType: "Social Media Management",
        priceRange: SEO_CONFIG.business.priceRange,
    };

    return (
        <RootLayout>
            <SEOHead pageSEO={pageSEO} lang={lang} />

            {/* Schema markup */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(tampaSchema) }}
            />

            {/* Hero */}
            <section className="py-20 md:py-28 bg-gradient-to-b from-muted/50 to-background">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                            <MapPin className="w-3 h-3 mr-1" />
                            {lang === "en" ? "Serving Tampa Bay" : "Sirviendo Tampa Bay"}
                        </Badge>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6">
                            {lang === "en"
                                ? "Social Media Management for Tampa Businesses"
                                : "Gestión de Redes Sociales para Negocios de Tampa"}
                        </h1>
                        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                            {lang === "en"
                                ? "Affordable social media packages for Tampa restaurants, salons, and local businesses. No contracts, real results."
                                : "Paquetes de redes sociales asequibles para restaurantes, salones y negocios locales de Tampa. Sin contratos, resultados reales."}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" asChild>
                                <Link to="/pricing">
                                    {lang === "en" ? "View Pricing" : "Ver Precios"}
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                            <Button size="lg" variant="outline" asChild>
                                <Link to="/contact">
                                    {lang === "en" ? "Contact Us" : "Contáctanos"}
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services for Tampa */}
            <section className="py-20 bg-background">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                            {lang === "en"
                                ? "Social Media Services in Tampa"
                                : "Servicios de Redes Sociales en Tampa"}
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            {lang === "en"
                                ? "Everything your Tampa business needs to grow online"
                                : "Todo lo que tu negocio de Tampa necesita para crecer en línea"}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {TAMPA_SERVICES.map((service, index) => (
                            <Card key={index} className="hover:shadow-lg transition-shadow">
                                <CardContent className="p-6">
                                    <service.icon className="h-10 w-10 text-primary mb-4" />
                                    <h3 className="text-xl font-semibold mb-2">
                                        {service.title[lang]}
                                    </h3>
                                    <p className="text-muted-foreground">
                                        {service.description[lang]}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Tampa Businesses Choose Us */}
            <section className="py-20 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-heading font-bold mb-8">
                            {lang === "en"
                                ? "Why Tampa Businesses Choose Brashline"
                                : "Por Qué los Negocios de Tampa Eligen Brashline"}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div>
                                <div className="text-4xl font-bold text-primary mb-2">$0</div>
                                <p className="text-muted-foreground">
                                    {lang === "en" ? "Setup fees" : "Tarifas de configuración"}
                                </p>
                            </div>
                            <div>
                                <div className="text-4xl font-bold text-primary mb-2">0</div>
                                <p className="text-muted-foreground">
                                    {lang === "en" ? "Long-term contracts" : "Contratos a largo plazo"}
                                </p>
                            </div>
                            <div>
                                <div className="text-4xl font-bold text-primary mb-2">100%</div>
                                <p className="text-muted-foreground">
                                    {lang === "en" ? "Transparent pricing" : "Precios transparentes"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact CTA */}
            <section className="py-20 bg-primary text-primary-foreground">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                        {lang === "en"
                            ? "Ready to Grow Your Tampa Business?"
                            : "¿Listo para Hacer Crecer tu Negocio de Tampa?"}
                    </h2>
                    <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
                        {lang === "en"
                            ? "Get a free consultation and see how we can help your Tampa business thrive online."
                            : "Obtén una consulta gratuita y descubre cómo podemos ayudar a tu negocio de Tampa a prosperar en línea."}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <a
                            href={`tel:${SEO_CONFIG.business.phone}`}
                            className="flex items-center gap-2 text-lg"
                        >
                            <Phone className="h-5 w-5" />
                            {SEO_CONFIG.business.phone}
                        </a>
                        <span className="hidden sm:inline opacity-50">|</span>
                        <a
                            href={`mailto:${SEO_CONFIG.business.email}`}
                            className="flex items-center gap-2 text-lg"
                        >
                            <Mail className="h-5 w-5" />
                            {SEO_CONFIG.business.email}
                        </a>
                    </div>
                </div>
            </section>
        </RootLayout>
    );
};

export default TampaPage;
