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
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import FlipButton from "@/components/ui/flip-button";
import BackgroundPaths from "@/components/ui/background-paths";
import { useParallax } from "@/hooks/useParallax";
import { analytics } from "@/lib/analytics";

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
  const parallaxOffset = useParallax({ speed: 0.3, direction: "down" });
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
      <div 
        className="absolute inset-0 z-0" 
        style={{ transform: `translateY(${parallaxOffset}px)` }}
      >
        <BackgroundPaths />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-24 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="flex justify-center mb-8 animate-fade-in">
            <Badge variant="outline" className="border-muted-foreground/30 text-muted-foreground">
              {lang === "en" ? "Florida-Grown" : "Crecido en Florida"}
            </Badge>
          </div>

          {/* Animated Headline with Framer Motion */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-foreground mb-6 leading-tight">
            <motion.div 
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div>{lang === "en" ? "Be" : "Siempre"}</div>
              <div className="relative h-[1.2em] w-full overflow-hidden flex justify-center">
                {titles.map((title, index) => (
                  <motion.span
                    key={index}
                    className="inline-block font-bold"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{
                      opacity: titleNumber === index ? 1 : 0,
                      y: titleNumber === index ? 0 : titleNumber > index ? -50 : 50,
                      scale: titleNumber === index ? 1 : 0.9,
                    }}
                    transition={{
                      duration: 0.5,
                      ease: [0.4, 0, 0.2, 1],
                      opacity: { duration: 0.3 }
                    }}
                  >
                    {title}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-fade-in leading-relaxed animate-delay-100">
            {lang === "en" ? "Brashline started with two friends and one mission - make online visibility effortless. We create consistent, real content that keeps your business active and seen. Straightforward, affordable, and built to last." : "Brashline comenzó con dos amigos y una misión: hacer que la visibilidad en línea sea sin esfuerzo. Creamos contenido real y constante que mantiene tu negocio activo y visible. Directo, asequible y construido para durar."}
          </p>

          {/* CTA */}
          <div className="flex justify-center animate-fade-in mb-8 animate-delay-200">
            <FlipButton
              frontText={lang === "en" ? "Book Strategic Call" : "Reservar Llamada Estratégica"}
              backText="📞 Calling…"
              from="top"
              href="https://wa.me/19294468440"
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg px-10 py-6 h-auto"
              onClick={() => analytics.trackCTA('Book Strategic Call', 'Hero Section')}
            />
          </div>
        </div>
      </div>

    </section>;
});

Hero.displayName = 'Hero';

export default Hero;