import { memo } from "react";
import { Share2, Globe, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface ValuePropsProps {
  lang: "en" | "es";
}

const valueProps = [
  {
    icon: Share2,
    title: { en: "Social, Handled.", es: "Redes Gestionadas." },
    text: {
      en: "Consistent, on-brand content that keeps your business visible everywhere.",
      es: "Contenido constante y de marca que mantiene tu negocio visible en todas partes.",
    },
  },
  {
    icon: Globe,
    title: { en: "Websites That Work.", es: "Sitios Web que Funcionan." },
    text: {
      en: "Fast, optimized, and built to turn clicks into customers.",
      es: "Rápidos, optimizados y construidos para convertir clics en clientes.",
    },
  },
  {
    icon: TrendingUp,
    title: { en: "Presence That Performs.", es: "Presencia que Rinde." },
    text: {
      en: "Smart SEO and strategy to grow your brand organically.",
      es: "SEO inteligente y estrategia para hacer crecer tu marca orgánicamente.",
    },
  },
];

const ValueProps = memo(({ lang }: ValuePropsProps) => {
  const { elementRef, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section ref={elementRef as React.RefObject<HTMLElement>} className="py-32 md:py-40 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {valueProps.map((prop, index) => {
            const Icon = prop.icon;
            return (
              <Card
                key={index}
                className={`shadow-soft hover:shadow-medium transition-all duration-700 hover:-translate-y-1 border-border/50 bg-card/50 backdrop-blur-sm ${
                  isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <CardContent className="p-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-foreground/5 border border-border/50 mb-6">
                    <Icon className="h-8 w-8 text-foreground" />
                  </div>
                  <h3 className="text-xl font-heading font-semibold mb-4">
                    {prop.title[lang]}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {prop.text[lang]}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
});

ValueProps.displayName = 'ValueProps';

export default ValueProps;
