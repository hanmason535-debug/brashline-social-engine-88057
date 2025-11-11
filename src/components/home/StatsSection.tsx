import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useCountUp } from '@/hooks/useCountUp';
import { Users, Award, Clock, TrendingUp } from 'lucide-react';

interface StatsSectionProps {
  lang: 'en' | 'es';
}

const StatsSection = ({ lang }: StatsSectionProps) => {
  const { elementRef, isVisible } = useScrollAnimation({ threshold: 0.3 });

  const stats = [
    {
      icon: Users,
      end: 500,
      suffix: '+',
      label: { en: 'Clients Served', es: 'Clientes Atendidos' },
    },
    {
      icon: Award,
      end: 98,
      suffix: '%',
      label: { en: 'Satisfaction Rate', es: 'Tasa de Satisfacción' },
    },
    {
      icon: Clock,
      end: 24,
      suffix: '/7',
      label: { en: 'Support Available', es: 'Soporte Disponible' },
    },
    {
      icon: TrendingUp,
      end: 150,
      suffix: '%',
      label: { en: 'Avg. Growth', es: 'Crecimiento Promedio' },
    },
  ];

  return (
    <section
      ref={elementRef as React.RefObject<HTMLElement>}
      className="py-20 bg-gradient-to-b from-background to-muted/30"
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const count = useCountUp({
              end: stat.end,
              duration: 2500,
              shouldStart: isVisible,
            });

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
                  {count}
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
