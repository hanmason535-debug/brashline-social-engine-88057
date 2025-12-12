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
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useCountUp } from '@/hooks/useCountUp';
import { Users, Award, Clock, TrendingUp } from 'lucide-react';

interface StatsSectionProps {
  lang: 'en' | 'es';
}

const StatsSection = ({ lang }: StatsSectionProps) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

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
    <section ref={ref} className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <StatItem key={index} {...stat} lang={lang} isVisible={inView} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

const StatItem = ({ icon: Icon, end, suffix, label, lang, isVisible, index }) => {
  const count = useCountUp({ end, duration: 2500, shouldStart: isVisible });

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
      },
    },
  };

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate={isVisible ? 'visible' : 'hidden'}
      className="text-center p-4 rounded-lg transition-all duration-300 hover:bg-muted/50"
    >
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary/10 to-primary/20 border border-primary/20 mb-4">
        <Icon className="h-8 w-8 text-primary" />
      </div>
      <div className="text-4xl md:text-5xl font-heading font-bold mb-2">
        {count}
        {suffix}
      </div>
      <p className="text-sm text-muted-foreground">{label[lang]}</p>
    </motion.div>
  );
};


export default StatsSection;
