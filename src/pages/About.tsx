import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/SEO/SEOHead";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Users, Award } from "lucide-react";
import { Meteors } from "@/components/ui/meteors";
import { useLanguage } from "@/contexts/LanguageContext";
import { getPageSEO } from "@/utils/seo";

const About = () => {
  const { lang } = useLanguage();
  const pageSEO = getPageSEO("about");

  return (
    <>
      <SEOHead pageSEO={pageSEO} lang={lang} />
      <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-muted py-20">
          <div className="w-full absolute inset-0 h-full">
            <Meteors number={30} />
          </div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6">
              {lang === "en" ? "About Brashline" : "Acerca de Brashline"}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {lang === "en"
                ? "Digital made simple. Growth made real."
                : "Lo digital simplificado. Crecimiento real."}
            </p>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mt-4">
              {lang === "en"
                ? "Brashline helps businesses stay visible online with affordable plans, consistent content, and measurable results — no jargon, no fluff, just progress that lasts."
                : "Brashline ayuda a las empresas a mantenerse visibles en línea con planes asequibles, contenido consistente y resultados medibles, sin jerga, sin relleno, solo progreso que dura."}
            </p>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="prose prose-lg mx-auto mb-12">
              <h2 className="text-3xl font-heading font-bold mb-6 text-foreground">
                {lang === "en" ? "Our Story" : "Nuestra Historia"}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {lang === "en"
                  ? "Brashline started as a simple idea between a few friends rooted in technology and design. Each had spent years helping local businesses build websites, manage social media, and solve digital problems that bigger agencies ignored. What they discovered was clear — small business owners weren't lacking ambition; they were being priced out of the digital world."
                  : "Brashline comenzó como una idea simple entre algunos amigos arraigados en tecnología y diseño. Cada uno había pasado años ayudando a negocios locales a construir sitios web, gestionar redes sociales y resolver problemas digitales que las agencias más grandes ignoraban. Lo que descubrieron fue claro: los dueños de pequeñas empresas no carecían de ambición; estaban siendo excluidos del mundo digital."}
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {lang === "en"
                  ? "Professional agencies charged thousands for what most people really needed: visibility, consistency, and honest results. So they built Brashline — a digital agency designed for real people, not corporate budgets. No confusing retainers or inflated promises, just affordable, reliable, and practical solutions that help businesses look good, stay active, and grow online."
                  : "Las agencias profesionales cobraban miles por lo que la mayoría de la gente realmente necesitaba: visibilidad, consistencia y resultados honestos. Así que construyeron Brashline, una agencia digital diseñada para personas reales, no para presupuestos corporativos. Sin anticipos confusos ni promesas infladas, solo soluciones asequibles, confiables y prácticas que ayudan a las empresas a verse bien, mantenerse activas y crecer en línea."}
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {lang === "en"
                  ? "The team's mission has stayed the same from day one: make technology work for small businesses, not against them. Whether it's creating steady social content, optimizing for search, or building websites that convert, Brashline keeps it simple, transparent, and effective."
                  : "La misión del equipo ha permanecido igual desde el primer día: hacer que la tecnología funcione para las pequeñas empresas, no en su contra. Ya sea creando contenido social constante, optimizando para búsqueda o construyendo sitios web que conviertan, Brashline lo mantiene simple, transparente y efectivo."}
              </p>
              <p className="text-muted-foreground leading-relaxed font-semibold">
                {lang === "en"
                  ? "Real people. Real support. Real results. That's Brashline."
                  : "Personas reales. Soporte real. Resultados reales. Eso es Brashline."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="shadow-soft">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-muted mb-4">
                    <Target className="h-7 w-7 text-foreground" />
                  </div>
                  <h3 className="font-heading font-semibold mb-2 text-foreground">
                    {lang === "en" ? "Simplify Digital" : "Simplificar lo Digital"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {lang === "en"
                      ? "Make online growth easy to understand and manage."
                      : "Hacer que el crecimiento en línea sea fácil de entender y gestionar."}
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-soft">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-muted mb-4">
                    <Users className="h-7 w-7 text-foreground" />
                  </div>
                  <h3 className="font-heading font-semibold mb-2 text-foreground">
                    {lang === "en" ? "Create Value" : "Crear Valor"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {lang === "en"
                      ? "Deliver real impact, not vanity metrics."
                      : "Entregar impacto real, no métricas de vanidad."}
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-soft">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-muted mb-4">
                    <Award className="h-7 w-7 text-foreground" />
                  </div>
                  <h3 className="font-heading font-semibold mb-2 text-foreground">
                    {lang === "en" ? "Build Trust" : "Construir Confianza"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {lang === "en"
                      ? "Earn confidence through honesty and results."
                      : "Ganar confianza a través de honestidad y resultados."}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
    </>
  );
};

export default About;
