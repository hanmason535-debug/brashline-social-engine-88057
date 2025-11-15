/**
 * File overview: src/components/home/Hero.tsx
 *
 * React component `Hero` rendering a focused piece of UI.
 * Behavior:
 * - Receives props from parents and may read from hooks or context.
 * - Renders presentational markup and wires callbacks for user interaction.
 * Data flow:
 * - Follows a one-way data flow: parents own data, this component focuses on display.
 * Performance:
 * - Avoid expensive work during render and prefer memoized helpers for heavy subtrees.
 */
import { useEffect, useMemo, useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import FlipButton from "@/components/ui/flip-button";
import BackgroundPaths from "@/components/ui/background-paths";
interface HeroProps {
  lang: "en" | "es";
}
const Hero = memo(({
  lang
}: HeroProps) => {
  const [titleNumber, setTitleNumber] = useState(0);
  const titlesEn = useMemo(() => ["Consistent", "Growing", "Visible", "Connected"], []);
  const titlesEs = useMemo(() => ["Constantes", "en Crecimiento", "Visibles", "Conectadas"], []);
  const titles = lang === "en" ? titlesEn : titlesEs;
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);
  return <section className="relative overflow-hidden bg-background">
      {/* Animated Background with performance hints */}
      <div className="absolute inset-0 z-[-1]">
        <BackgroundPaths />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-24 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex justify-center mb-8"
          >
            <Badge variant="outline" className="border-muted-foreground/30 text-muted-foreground">
              {lang === "en" ? "Florida-Grown" : "Crecido en Florida"}
            </Badge>
          </motion.div>

          {/* Animated Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-foreground mb-6 leading-tight"
          >
            <div className="flex flex-col items-center">
              <div>{lang === "en" ? "Be" : "Siempre"}</div>
              <AnimatePresence mode="wait">
                <motion.span
                  key={titles[titleNumber]}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.5 }}
                  className="font-bold"
                >
                  {titles[titleNumber]}
                </motion.span>
              </AnimatePresence>
            </div>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            {lang === "en" ? "Brashline started with two friends and one mission - make online visibility effortless. We create consistent, real content that keeps your business active and seen. Straightforward, affordable, and built to last." : "Brashline comenzó con dos amigos y una misión: hacer que la visibilidad en línea sea sin esfuerzo. Creamos contenido real y constante que mantiene tu negocio activo y visible. Directo, asequible y construido para durar."}
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex justify-center mb-8"
          >
            <FlipButton
              frontText={lang === "en" ? "Book Strategic Call" : "Reservar Llamada Estratégica"}
              backText="📞 Calling…"
              from="top"
              href="https://wa.me/19294468440"
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg px-10 py-6 h-auto"
            />
          </motion.div>
        </div>
      </div>

    </section>;
});

Hero.displayName = 'Hero';

export default Hero;