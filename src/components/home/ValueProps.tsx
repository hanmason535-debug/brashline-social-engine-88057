/**
 * File overview: src/components/home/ValueProps.tsx
 *
 * React component `ValueProps` rendering a focused piece of UI.
 * Behavior:
 * - Receives props from parents and may read from hooks or context.
 * - Renders presentational markup and wires callbacks for user interaction.
 * Data flow:
 * - Follows a one-way data flow: parents own data, this component focuses on display.
 * Performance:
 * - Avoid expensive work during render and prefer memoized helpers for heavy subtrees.
 */
import { memo } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Share2, Globe, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.15,
        duration: 0.5,
      },
    }),
  };

  return (
    <section ref={ref} className="py-32 md:py-40 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {valueProps.map((prop, index) => {
            const Icon = prop.icon;
            return (
              <motion.div
                key={index}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
              >
                <Card className="h-full shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1 border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50">
                  <CardContent className="p-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-foreground/5 to-foreground/10 border border-border/50 mb-6">
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
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
});

ValueProps.displayName = 'ValueProps';

export default ValueProps;
