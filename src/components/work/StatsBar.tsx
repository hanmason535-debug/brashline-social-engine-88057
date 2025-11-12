import { motion } from "framer-motion";
import { useCountUp } from "@/hooks/useCountUp";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Award, TrendingUp, Users } from "lucide-react";

interface StatsBarProps {
  lang: "en" | "es";
}

export function StatsBar({ lang }: StatsBarProps) {
  const { elementRef, isVisible } = useScrollAnimation({ threshold: 0.5 });

  const stats = [
    {
      icon: Users,
      value: 150,
      suffix: "+",
      label: { en: "Projects Completed", es: "Proyectos Completados" },
    },
    {
      icon: Award,
      value: 98,
      suffix: "%",
      label: { en: "Client Satisfaction", es: "Satisfacción del Cliente" },
    },
    {
      icon: TrendingUp,
      value: 5,
      suffix: "M+",
      label: { en: "Social Reach", es: "Alcance Social" },
    },
  ];

  return (
    <motion.div
      ref={elementRef as React.RefObject<HTMLDivElement>}
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6 }}
      className="bg-muted py-12 mb-16 rounded-2xl"
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const count = useCountUp({
              end: stat.value,
              duration: 2000,
              shouldStart: isVisible,
            });

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="text-center"
              >
                <div className="flex items-center justify-center mb-3">
                  <div className="bg-foreground text-background p-3 rounded-full">
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
                <div className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-2">
                  {count}
                  {stat.suffix}
                </div>
                <p className="text-muted-foreground font-medium">{stat.label[lang]}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
