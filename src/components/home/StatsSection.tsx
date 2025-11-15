/**
 * File overview: src/components/home/StatsSection.tsx
 *
 * React component `StatsSection` rendering a focused piece of UI.
 * Behavior:
 * - Receives props from parents and may read from hooks or context.
 * - Renders presentational markup and wires callbacks for user interaction.
 * Data flow:
 * - Follows a one-way data flow: parents own data, this component focuses on display.
 * Performance:
 * - Avoid expensive work during render and prefer memoized helpers for heavy subtrees.
 */
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useCountUp } from '@/hooks/useCountUp';
import { Users, Award, Clock, TrendingUp } from 'lucide-react';

interface StatsSectionProps {
  lang: 'en' | 'es';
}

const StatsSection = ({ lang }: StatsSectionProps) => {
  const { elementRef, isVisible } = useScrollAnimation({ threshold: 0.3 });

  // Call hooks at the top level for each stat
  const count1 = useCountUp({ end: 500, duration: 2500, shouldStart: isVisible });
  const count2 = useCountUp({ end: 98, duration: 2500, shouldStart: isVisible });
  const count3 = useCountUp({ end: 24, duration: 2500, shouldStart: isVisible });
  const count4 = useCountUp({ end: 150, duration: 2500, shouldStart: isVisible });

  const stats = [
    {
      icon: Users,
      count: count1,
      suffix: '+',
      label: { en: 'Clients Served', es: 'Clientes Atendidos' },
    },
    {
      icon: Award,
      count: count2,
      suffix: '%',
      label: { en: 'Satisfaction Rate', es: 'Tasa de Satisfacción' },
    },
    {
      icon: Clock,
      count: count3,
      suffix: '/7',
      label: { en: 'Support Available', es: 'Soporte Disponible' },
    },
    {
      icon: TrendingUp,
      count: count4,
      suffix: '%',
      label: { en: 'Avg. Growth', es: 'Crecimiento Promedio' },
    },
  ];

  return (
    <section
      ref={elementRef as React.RefObject<HTMLElement>}
      className="pt-12 pb-20 bg-gradient-to-b from-background to-muted/30"
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <div
                key={index}
                className={`text-center transform transition-all duration-700 ${
                  isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/20 mb-4">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                <div className="text-4xl md:text-5xl font-heading font-bold mb-2">
                  {stat.count}
                  {stat.suffix}
                </div>
                <p className="text-sm text-muted-foreground">
                  {stat.label[lang]}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
