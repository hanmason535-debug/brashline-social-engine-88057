import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { BorderBeam } from "@/components/ui/border-beam";

interface PricingPreviewProps {
  lang: "en" | "es";
}

const plans = [
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
      { en: "Content planning", es: "Planificación de contenido", included: false },
      { en: "Photography or video", es: "Fotografía o video", included: false },
      { en: "SEO or ads", es: "SEO o anuncios", included: false },
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
      { en: "Photography", es: "Fotografía", included: false },
      { en: "Premium SEO", es: "SEO Premium", included: false },
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
      { en: "CRM integration", es: "Integración CRM", included: true },
      { en: "Advanced tracking", es: "Seguimiento avanzado", included: true },
    ],
  },
];

const PricingPreview = ({ lang }: PricingPreviewProps) => {
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");
  const [showComparison, setShowComparison] = useState(false);

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4">
            {lang === "en" ? "Pick your plan" : "Elige tu plan"}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            {lang === "en"
              ? "Transparent pricing. No hidden fees. Cancel anytime."
              : "Precios transparentes. Sin tarifas ocultas. Cancela en cualquier momento."}
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-3 mt-6">
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
                className="data-[state=on]:bg-background data-[state=on]:text-foreground px-12 py-2 flex items-center gap-2"
              >
                {lang === "en" ? "Annual" : "Anual"}
                <Badge className="bg-green-600 hover:bg-green-600 text-white text-xs px-2 py-0">
                  {lang === "en" ? "Upto 15% off" : "Ahorra 10%"}
                </Badge>
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          {plans.map((plan, index) => {
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
                    <BorderBeam 
                      size={250} 
                      duration={12} 
                      delay={0}
                      colorFrom="hsl(var(--primary))"
                      colorTo="hsl(var(--primary-glow))"
                    />
                    <Badge className="absolute top-4 left-1/2 -translate-x-1/2 bg-primary z-10">
                      {lang === "en" ? "Most Popular" : "Más Popular"}
                    </Badge>
                  </>
                )}

                <CardHeader className="text-center pb-8 pt-12">
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
                  {plan.features.map((feature, i) => (
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
            );
          })}
        </div>

        {/* Comparison Table Toggle */}
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
              <Link to="/pricing#addons">
                {lang === "en" ? "View Add-Ons" : "Ver Complementos"}
              </Link>
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
                  {plans.map((plan, idx) => (
                    <th key={idx} className="text-center p-4 font-heading font-bold">
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {plans[0].features.map((_, featureIdx) => (
                  <tr key={featureIdx} className="border-t border-border">
                    <td className="p-4 text-sm font-medium">
                      {plans[0].features[featureIdx][lang]}
                    </td>
                    {plans.map((plan, planIdx) => (
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
  );
};

export default PricingPreview;
