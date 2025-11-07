import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { BorderBeam } from "@/components/ui/border-beam";

interface PricingPreviewProps {
  lang: "en" | "es";
}

const plans = [
  {
    tier: { en: "BASIC", es: "BÁSICO" },
    name: "Starter Spark",
    price: 99,
    annualPrice: 1106,
    annualDiscount: 7,
    summary: {
      en: "Keep accounts active with low lift.",
      es: "Mantén las cuentas activas con bajo esfuerzo.",
    },
    features: [
      { en: "4 static posts/month", es: "4 publicaciones estáticas/mes" },
      { en: "Facebook & Instagram", es: "Facebook e Instagram" },
      { en: "Basic profile hygiene", es: "Higiene básica de perfil" },
      { en: "Daily inbox scan", es: "Revisión diaria de bandeja" },
      { en: "Monthly mini-report", es: "Mini-informe mensual" },
    ],
  },
  {
    tier: { en: "STANDARD", es: "ESTÁNDAR" },
    name: "Brand Pulse",
    price: 179,
    annualPrice: 1826,
    annualDiscount: 15,
    limitedOffer: true,
    summary: {
      en: "Maintain presence and manage your ecosystem.",
      es: "Mantén la presencia y gestiona tu ecosistema.",
    },
    features: [
      { en: "~15 posts/month", es: "~15 publicaciones/mes" },
      { en: "Full captions + templates", es: "Copys completos + plantillas" },
      { en: "GBP & Yelp maintained", es: "Mantenimiento GBP y Yelp" },
      { en: "Review responses", es: "Respuestas a reseñas" },
      { en: "Light Meta ads oversight", es: "Supervisión ligera anuncios" },
      { en: "Monthly performance report", es: "Informe mensual" },
    ],
    featured: true,
  },
  {
    tier: { en: "PREMIUM", es: "PREMIUM" },
    name: "Impact Engine",
    price: 399,
    annualPrice: 5689,
    annualDiscount: 10,
    summary: {
      en: "Growth with measurable ROI.",
      es: "Crecimiento con ROI medible.",
    },
    features: [
      { en: "12–16 posts/month", es: "12–16 publicaciones/mes" },
      { en: "2–4 videos/month", es: "2–4 videos/mes" },
      { en: "Monthly photo session", es: "Sesión de fotos mensual" },
      { en: "SEO blog + full SEO", es: "Blog SEO + SEO completo" },
      { en: "Meta + Google ads", es: "Anuncios Meta y Google" },
      { en: "KPI dashboard + strategy call", es: "Dashboard KPIs + llamada" },
    ],
  },
];

const PricingPreview = ({ lang }: PricingPreviewProps) => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4">
            {lang === "en" ? "Pick your plan" : "Elige tu plan"}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {lang === "en"
              ? "Transparent pricing. No hidden fees. Cancel anytime."
              : "Precios transparentes. Sin tarifas ocultas. Cancela en cualquier momento."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
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
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary z-10">
                    {lang === "en" ? "Most Popular" : "Más Popular"}
                  </Badge>
                  <BorderBeam
                    duration={8}
                    size={250}
                    colorVia="hsl(0 0% 100%)"
                  />
                  <BorderBeam
                    duration={8}
                    delay={4}
                    size={250}
                    borderWidth={2}
                    colorVia="hsl(0 0% 80%)"
                  />
                </>
              )}
              
              {plan.limitedOffer && (
                <Badge className="absolute -top-3 right-4 z-10 bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 text-background shadow-lg animate-shine-pulse bg-[length:200%_100%]">
                  {lang === "en" ? "Limited Offer" : "Oferta Limitada"}
                </Badge>
              )}

              <CardHeader className="text-center pb-8 pt-6">
                <div className="text-xs font-semibold text-muted-foreground mb-2">
                  {plan.tier[lang]}
                </div>
                <h3 className="text-2xl font-heading font-bold mb-4">
                  {plan.name}
                </h3>
                <div className="mb-2">
                  <span className="text-4xl font-heading font-bold">${plan.price}</span>
                  <span className="text-muted-foreground">/mo</span>
                </div>
                <div className="text-sm text-muted-foreground mb-4">
                  {lang === "en" ? "or " : "o "}${plan.annualPrice}
                  {lang === "en" ? "/year" : "/año"}
                  <span className="text-xs ml-1">
                    ({plan.annualDiscount}% {lang === "en" ? "off" : "desc."}{plan.limitedOffer ? ` - ${lang === "en" ? "Limited Offer" : "Oferta Limitada"}` : ""})
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {plan.summary[lang]}
                </p>
              </CardHeader>

              <CardContent className="space-y-3">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature[lang]}</span>
                  </div>
                ))}
              </CardContent>

              <CardFooter className="pt-6">
                <Button
                  asChild
                  className="w-full"
                  variant={plan.featured ? "default" : "outline"}
                >
                  <a href="https://api.whatsapp.com/send/?phone=19294468440&text&type=phone_number&app_absent=0" target="_blank" rel="noopener noreferrer">
                    {lang === "en" ? "Get Started" : "Comenzar"}
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" variant="outline" asChild>
            <Link to="/pricing">
              {lang === "en" ? "Compare all features" : "Comparar todas las características"}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PricingPreview;
