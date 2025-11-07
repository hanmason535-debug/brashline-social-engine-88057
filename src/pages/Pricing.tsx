import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import { SparklesCore } from "@/components/ui/sparkles";
import { BorderBeam } from "@/components/ui/border-beam";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const Pricing = () => {
  const [lang, setLang] = useState<"en" | "es">("en");
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");
  const [showComparison, setShowComparison] = useState(false);

  const recurringPlans = [
    {
      tier: { en: "BASIC", es: "BÁSICO" },
      name: "Starter Spark",
      monthlyPrice: 99,
      annualPrice: 92,
      annualTotal: 1106,
      discount: 7,
      summary: {
        en: "Keep accounts active with low lift.",
        es: "Mantén las cuentas activas con bajo esfuerzo.",
      },
      features: [
        { en: "4 static posts/month", es: "4 publicaciones estáticas/mes", included: true },
        { en: "Facebook & Instagram", es: "Facebook e Instagram", included: true },
        { en: "Basic profile hygiene", es: "Higiene básica de perfil", included: true },
        { en: "Daily inbox scan", es: "Revisión diaria de bandeja", included: true },
        { en: "Monthly mini-report", es: "Mini-informe mensual", included: true },
        { en: "Full captions + templates", es: "Copys completos + plantillas", included: false },
        { en: "GBP & Yelp maintained", es: "Mantenimiento GBP y Yelp", included: false },
        { en: "Review responses", es: "Respuestas a reseñas", included: false },
        { en: "Video content", es: "Contenido de video", included: false },
        { en: "SEO blog + full SEO", es: "Blog SEO + SEO completo", included: false },
      ],
    },
    {
      tier: { en: "STANDARD", es: "ESTÁNDAR" },
      name: "Brand Pulse",
      monthlyPrice: 179,
      annualPrice: 152,
      annualTotal: 1826,
      discount: 15,
      featured: true,
      summary: {
        en: "Maintain presence and manage your ecosystem.",
        es: "Mantén la presencia y gestiona tu ecosistema.",
      },
      features: [
        { en: "~15 posts/month", es: "~15 publicaciones/mes", included: true },
        { en: "Full captions + templates", es: "Copys completos + plantillas", included: true },
        { en: "GBP & Yelp maintained", es: "Mantenimiento GBP y Yelp", included: true },
        { en: "Review responses", es: "Respuestas a reseñas", included: true },
        { en: "Light Meta ads oversight", es: "Supervisión ligera anuncios", included: true },
        { en: "Monthly performance report", es: "Informe mensual", included: true },
        { en: "Video content (2-4/month)", es: "Contenido de video (2-4/mes)", included: false },
        { en: "Monthly photo session", es: "Sesión de fotos mensual", included: false },
        { en: "SEO blog + full SEO", es: "Blog SEO + SEO completo", included: false },
        { en: "KPI dashboard + strategy call", es: "Dashboard KPIs + llamada", included: false },
      ],
    },
    {
      tier: { en: "PREMIUM", es: "PREMIUM" },
      name: "Impact Engine",
      monthlyPrice: 399,
      annualPrice: 359,
      annualTotal: 4308,
      discount: 10,
      summary: {
        en: "Growth with measurable ROI.",
        es: "Crecimiento con ROI medible.",
      },
      features: [
        { en: "12–16 posts/month", es: "12–16 publicaciones/mes", included: true },
        { en: "2–4 videos/month", es: "2–4 videos/mes", included: true },
        { en: "Monthly photo session", es: "Sesión de fotos mensual", included: true },
        { en: "SEO blog + full SEO", es: "Blog SEO + SEO completo", included: true },
        { en: "Meta + Google ads", es: "Anuncios Meta y Google", included: true },
        { en: "KPI dashboard + strategy call", es: "Dashboard KPIs + llamada", included: true },
        { en: "Full captions + templates", es: "Copys completos + plantillas", included: true },
        { en: "GBP & Yelp maintained", es: "Mantenimiento GBP y Yelp", included: true },
        { en: "Review responses", es: "Respuestas a reseñas", included: true },
        { en: "Performance reporting", es: "Informes de rendimiento", included: true },
      ],
    },
  ];

  const mainPackage = {
    name: "Digital Launch Pro",
    price: 2999,
    type: "one-time",
    tagline: {
      en: "Full business setup — for new or rebranding clients",
      es: "Configuración completa del negocio — para clientes nuevos o en proceso de rebranding",
    },
    features: [
      { en: "Custom website design & development (6–8 pages)", es: "Diseño y desarrollo de sitio web personalizado (6–8 páginas)" },
      { en: "Logo + complete brand kit (fonts, palette, templates)", es: "Logo + kit de marca completo (fuentes, paleta, plantillas)" },
      { en: "Professional photoshoot + video production", es: "Sesión de fotos profesional + producción de video" },
      { en: "SEO optimization & Google indexing", es: "Optimización SEO e indexación en Google" },
      { en: "GBP & Yelp setup + local directory submissions", es: "Configuración de GBP y Yelp + envíos a directorios locales" },
      { en: "E-commerce setup (Shopify, Amazon, DoorDash, UberEats, Groupon)", es: "Configuración de e-commerce (Shopify, Amazon, DoorDash, UberEats, Groupon)" },
      { en: "Hosting, domain, SSL, analytics setup", es: "Configuración de hosting, dominio, SSL, análisis" },
      { en: "CRM + automation flow (HubSpot/Zoho)", es: "CRM + flujo de automatización (HubSpot/Zoho)" },
      { en: "30-day post-launch support", es: "Soporte post-lanzamiento de 30 días" },
    ],
    bestFor: {
      en: "new businesses or total brand overhauls",
      es: "negocios nuevos o renovaciones totales de marca",
    },
  };

  const addOnPackages = [
    {
      name: "Ad Storm",
      price: 99,
      type: "one-time",
      tagline: {
        en: "Full ad setup across all networks",
        es: "Configuración completa de anuncios en todas las redes",
      },
      features: [
        { en: "Meta, Instagram, Google, Yelp, UberEats, DoorDash, Grubhub & Groupon", es: "Meta, Instagram, Google, Yelp, UberEats, DoorDash, Grubhub y Groupon" },
        { en: "Audience targeting, budget structure, and creative setup", es: "Segmentación de audiencia, estructura de presupuesto y configuración creativa" },
        { en: "Pixel, UTM & conversion tracking", es: "Seguimiento de Pixel, UTM y conversiones" },
        { en: "Launch report + ad optimization guide", es: "Informe de lanzamiento + guía de optimización de anuncios" },
      ],
      bestFor: {
        en: "brands ready for omnichannel paid visibility",
        es: "marcas listas para visibilidad pagada omnicanal",
      },
    },
    {
      name: "Brand Forge",
      price: 99,
      type: "one-time",
      tagline: {
        en: "Logo and brand identity creation",
        es: "Creación de logo e identidad de marca",
      },
      features: [
        { en: "Logo suite + icon variations", es: "Suite de logo + variaciones de iconos" },
        { en: "Color palette & typography guide", es: "Paleta de colores y guía de tipografía" },
        { en: "Social post templates + banner set", es: "Plantillas de publicaciones sociales + conjunto de banners" },
        { en: "Digital stationery (email signature, cards)", es: "Papelería digital (firma de correo, tarjetas)" },
      ],
      bestFor: {
        en: "new or refreshing businesses seeking cohesive design",
        es: "negocios nuevos o en renovación que buscan diseño cohesivo",
      },
    },
    {
      name: "Visual Vault",
      price: 399,
      type: "one-time",
      tagline: {
        en: "Photography & video creation",
        es: "Creación de fotografía y video",
      },
      features: [
        { en: "Professional photoshoot", es: "Sesión de fotos profesional" },
        { en: "20 edited images + 5 short social clips", es: "20 imágenes editadas + 5 clips sociales cortos" },
        { en: "Branded formatting for posts", es: "Formato de marca para publicaciones" },
        { en: "Commercial usage rights", es: "Derechos de uso comercial" },
      ],
      bestFor: {
        en: "businesses upgrading their creative content",
        es: "negocios mejorando su contenido creativo",
      },
    },
    {
      name: "AutomateIQ",
      price: 899,
      type: "one-time",
      tagline: {
        en: "CRM + workflow automation",
        es: "CRM + automatización de flujo de trabajo",
      },
      features: [
        { en: "CRM setup (HubSpot, Zoho, or custom)", es: "Configuración de CRM (HubSpot, Zoho o personalizado)" },
        { en: "Lead capture, nurture, and follow-up automation", es: "Captura de leads, nutrición y automatización de seguimiento" },
        { en: "Booking or form integrations", es: "Integraciones de reservas o formularios" },
        { en: "Dashboard connection to website", es: "Conexión de panel al sitio web" },
      ],
      bestFor: {
        en: "service-based businesses scaling efficiency",
        es: "negocios basados en servicios escalando eficiencia",
      },
    },
    {
      name: "Local Surge",
      price: 599,
      type: "one-time",
      tagline: {
        en: "Local search & map ranking boost",
        es: "Búsqueda local y mejora de clasificación en mapas",
      },
      features: [
        { en: "Google Business Profile optimization", es: "Optimización de Perfil de Negocio de Google" },
        { en: "Yelp, Nextdoor & citation listings (20+)", es: "Listados de Yelp, Nextdoor y citas (20+)" },
        { en: "Local keyword targeting", es: "Segmentación de palabras clave locales" },
        { en: "Ranking improvement tracking", es: "Seguimiento de mejora de clasificación" },
      ],
      bestFor: {
        en: "physical-location businesses seeking stronger map visibility",
        es: "negocios con ubicación física buscando mayor visibilidad en mapas",
      },
    },
    {
      name: "Commerce Boost",
      price: 799,
      type: "one-time",
      tagline: {
        en: "E-commerce and delivery integration",
        es: "Integración de e-commerce y entrega",
      },
      features: [
        { en: "Store setup on Amazon, Shopify, DoorDash, UberEats, Grubhub, Groupon", es: "Configuración de tienda en Amazon, Shopify, DoorDash, UberEats, Grubhub, Groupon" },
        { en: "Payment, inventory, and shipping setup", es: "Configuración de pagos, inventario y envíos" },
        { en: "Merchant analytics dashboard", es: "Panel de análisis comercial" },
      ],
      bestFor: {
        en: "restaurants and retailers expanding to online sales",
        es: "restaurantes y minoristas expandiéndose a ventas en línea",
      },
    },
    {
      name: "Data Pulse",
      price: 399,
      type: "one-time",
      tagline: {
        en: "Analytics + performance dashboard",
        es: "Análisis + panel de rendimiento",
      },
      features: [
        { en: "GA4, GSC, Meta Pixel, UTM setup", es: "Configuración de GA4, GSC, Meta Pixel, UTM" },
        { en: "Real-time KPI dashboard", es: "Panel de KPI en tiempo real" },
        { en: "Weekly email performance summary", es: "Resumen semanal de rendimiento por correo" },
      ],
      bestFor: {
        en: "clients wanting transparent data tracking",
        es: "clientes que desean seguimiento transparente de datos",
      },
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header lang={lang} onLanguageChange={setLang} />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/10 py-20">
          <div className="w-full absolute inset-0 h-full">
            <SparklesCore
              id="pricing-sparkles"
              background="transparent"
              minSize={0.8}
              maxSize={2}
              particleDensity={120}
              className="w-full h-full"
              speed={0.8}
              colorful={true}
            />
          </div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6">
              {lang === "en" ? "Launch Strong. Scale Smart." : "Lanza Fuerte. Escala Inteligente."}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              {lang === "en"
                ? "Complete business setup with flexible add-ons to match your growth."
                : "Configuración completa del negocio con complementos flexibles para tu crecimiento."}
            </p>
            
            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-3">
              <ToggleGroup 
                type="single" 
                value={billing} 
                onValueChange={(value) => value && setBilling(value as "monthly" | "annual")}
                className="bg-muted p-1 rounded-lg"
              >
                <ToggleGroupItem 
                  value="monthly" 
                  className="data-[state=on]:bg-background data-[state=on]:text-foreground px-6 py-2"
                >
                  {lang === "en" ? "Monthly" : "Mensual"}
                </ToggleGroupItem>
                <ToggleGroupItem 
                  value="annual" 
                  className="data-[state=on]:bg-background data-[state=on]:text-foreground px-6 py-2"
                >
                  {lang === "en" ? "Annual" : "Anual"}
                </ToggleGroupItem>
              </ToggleGroup>
              {billing === "annual" && (
                <span className="text-sm text-primary font-semibold">
                  {lang === "en" ? "Save up to 15%" : "Ahorra hasta 15%"}
                </span>
              )}
            </div>
          </div>
        </section>

        {/* Recurring Plans */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-primary text-primary-foreground">
                {lang === "en" ? "RECURRING PLANS" : "PLANES RECURRENTES"}
              </Badge>
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                {lang === "en" ? "Choose Your Growth Plan" : "Elige tu Plan de Crecimiento"}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-12">
              {recurringPlans.map((plan, index) => {
                const currentPrice = billing === "monthly" ? plan.monthlyPrice : plan.annualPrice;
                const billingPeriod = billing === "monthly" 
                  ? "" 
                  : `${lang === "en" ? "billed as" : "cobrado como"} $${plan.annualTotal}/${lang === "en" ? "yr" : "año"}`;

                return (
                  <Card
                    key={index}
                    className={`relative shadow-soft hover:shadow-medium transition-all duration-300 border-border/50 bg-card overflow-hidden ${
                      plan.featured
                        ? "border-primary shadow-glow md:-translate-y-4"
                        : "hover:-translate-y-1"
                    }`}
                  >
                    {plan.featured && (
                      <>
                        <Badge className="absolute top-4 left-1/2 -translate-x-1/2 bg-primary z-10">
                          {lang === "en" ? "Most Popular" : "Más Popular"}
                        </Badge>
                        <BorderBeam duration={12} size={300} colorVia="hsl(var(--primary))" />
                      </>
                    )}

                    <CardHeader className="text-center pb-8 pt-8">
                      <div className="text-xs font-semibold text-muted-foreground mb-2">
                        {plan.tier[lang]}
                      </div>
                      <h3 className="text-2xl font-heading font-bold mb-4">
                        {plan.name}
                      </h3>
                      <div className="mb-2">
                        <span className="text-4xl font-heading font-bold">${currentPrice}</span>
                        <span className="text-muted-foreground">/mo</span>
                      </div>
                      {billingPeriod && (
                        <div className="text-sm text-muted-foreground mb-2">
                          {billingPeriod}
                        </div>
                      )}
                      {billing === "annual" && (
                        <div className="text-xs text-primary font-semibold mb-4">
                          {plan.discount}% {lang === "en" ? "off" : "desc."}
                        </div>
                      )}
                      <p className="text-sm text-muted-foreground">
                        {plan.summary[lang]}
                      </p>
                    </CardHeader>

                    <CardContent className="space-y-3">
                      {plan.features.slice(0, 6).map((feature, i) => (
                        <div key={i} className="flex items-start gap-3">
                          {feature.included ? (
                            <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          ) : (
                            <X className="h-5 w-5 text-muted-foreground/50 flex-shrink-0 mt-0.5" />
                          )}
                          <span className={`text-sm ${!feature.included && 'text-muted-foreground'}`}>
                            {feature[lang]}
                          </span>
                        </div>
                      ))}
                    </CardContent>

                    <CardFooter className="pt-6">
                      <Button asChild className="w-full" variant={plan.featured ? "default" : "outline"}>
                        <a href="https://api.whatsapp.com/send/?phone=19294468440&text&type=phone_number&app_absent=0" target="_blank" rel="noopener noreferrer">
                          {lang === "en" ? "Get Started" : "Comenzar"}
                        </a>
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>

            {/* Feature Comparison Toggle */}
            <div className="text-center space-y-4">
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => setShowComparison(!showComparison)}
              >
                {showComparison 
                  ? (lang === "en" ? "Hide Comparison" : "Ocultar Comparación")
                  : (lang === "en" ? "Compare All Features" : "Comparar Todas las Características")
                }
              </Button>
              <div>
                <Button size="lg" variant="default" asChild>
                  <a href="#addons">
                    {lang === "en" ? "View Add-Ons" : "Ver Complementos"}
                  </a>
                </Button>
              </div>
            </div>

            {/* Comparison Table */}
            {showComparison && (
              <div className="mt-12 overflow-x-auto">
                <table className="w-full border-collapse bg-card rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-muted">
                      <th className="text-left p-4 font-heading font-bold">
                        {lang === "en" ? "Feature" : "Característica"}
                      </th>
                      {recurringPlans.map((plan, idx) => (
                        <th key={idx} className="text-center p-4 font-heading font-bold">
                          {plan.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recurringPlans[0].features.map((_, featureIdx) => (
                      <tr key={featureIdx} className="border-t border-border">
                        <td className="p-4 text-sm font-medium">
                          {recurringPlans[0].features[featureIdx][lang]}
                        </td>
                        {recurringPlans.map((plan, planIdx) => (
                          <td key={planIdx} className="text-center p-4">
                            {plan.features[featureIdx]?.included ? (
                              <Check className="h-5 w-5 text-primary mx-auto" />
                            ) : (
                              <X className="h-5 w-5 text-muted-foreground/50 mx-auto" />
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        {/* One-Time Launch Package */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-secondary text-secondary-foreground">
                {lang === "en" ? "COMPLETE SOLUTION" : "SOLUCIÓN COMPLETA"}
              </Badge>
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                {lang === "en" ? "Everything You Need to Launch" : "Todo lo que Necesitas para Lanzar"}
              </h2>
            </div>

            <Card className="max-w-4xl mx-auto relative shadow-glow border-primary overflow-hidden">
              <BorderBeam duration={12} size={300} colorVia="hsl(var(--primary))" />
              <CardHeader className="text-center pb-8 pt-8">
                <h3 className="text-3xl font-heading font-bold mb-4">
                  {mainPackage.name}
                </h3>
                <p className="text-lg text-muted-foreground mb-6">
                  {mainPackage.tagline[lang]}
                </p>
                <div className="mb-4">
                  <span className="text-5xl font-heading font-bold">${mainPackage.price}</span>
                  <span className="text-muted-foreground ml-2">{lang === "en" ? "one-time" : "único pago"}</span>
                </div>
              </CardHeader>

              <CardContent className="grid md:grid-cols-2 gap-4 pb-8">
                {mainPackage.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature[lang]}</span>
                  </div>
                ))}
                <div className="md:col-span-2 pt-4 mt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground italic text-center">
                    <span className="font-semibold">{lang === "en" ? "Best for:" : "Mejor para:"}</span> {mainPackage.bestFor[lang]}
                  </p>
                </div>
              </CardContent>

              <CardFooter className="pt-6 pb-8">
                <Button asChild className="w-full" size="lg">
                  <a href="https://api.whatsapp.com/send/?phone=19294468440&text&type=phone_number&app_absent=0" target="_blank" rel="noopener noreferrer">
                    {lang === "en" ? "Get Started" : "Comenzar"}
                  </a>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* Add-On Packages */}
        <section id="addons" className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-secondary text-secondary-foreground">
                {lang === "en" ? "ADD-ON PACKAGES" : "PAQUETES ADICIONALES"}
              </Badge>
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                {lang === "en" ? "Enhance Your Launch" : "Mejora tu Lanzamiento"}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {lang === "en"
                  ? "Pick the services that match your specific needs."
                  : "Elige los servicios que se adapten a tus necesidades específicas."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {addOnPackages.map((pkg, index) => (
                <Card
                  key={index}
                  className="relative shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1 flex flex-col"
                >
                  <CardHeader className="pb-6">
                    <h3 className="text-xl font-heading font-bold mb-2">
                      {pkg.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {pkg.tagline[lang]}
                    </p>
                    <div>
                      <span className="text-3xl font-heading font-bold">${pkg.price}</span>
                      <span className="text-muted-foreground text-sm ml-2">
                        {lang === "en" ? "one-time" : "único pago"}
                      </span>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3 flex-1">
                    {pkg.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-xs">{feature[lang]}</span>
                      </div>
                    ))}
                    <div className="pt-3 mt-3 border-t border-border">
                      <p className="text-xs text-muted-foreground italic">
                        <span className="font-semibold">{lang === "en" ? "Best for:" : "Mejor para:"}</span> {pkg.bestFor[lang]}
                      </p>
                    </div>
                  </CardContent>

                  <CardFooter className="pt-4">
                    <Button asChild className="w-full" variant="outline">
                      <a href="https://api.whatsapp.com/send/?phone=19294468440&text&type=phone_number&app_absent=0" target="_blank" rel="noopener noreferrer">
                        {lang === "en" ? "Add to Package" : "Agregar al Paquete"}
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <p className="text-sm text-muted-foreground">
                {lang === "en"
                  ? "All packages are one-time investments. Contact us to create a custom bundle."
                  : "Todos los paquetes son inversiones únicas. Contáctanos para crear un paquete personalizado."}
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer lang={lang} />
    </div>
  );
};

export default Pricing;
