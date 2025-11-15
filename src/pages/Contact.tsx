/**
 * File overview: src/pages/Contact.tsx
 *
 * React component `Contact` rendering a focused piece of UI.
 * Behavior:
 * - Receives props from parents and may read from hooks or context.
 * - Renders presentational markup and wires callbacks for user interaction.
 * Data flow:
 * - Follows a one-way data flow: parents own data, this component focuses on display.
 * Performance:
 * - Avoid expensive work during render and prefer memoized helpers for heavy subtrees.
 */
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/SEO/SEOHead";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Mail, Clock } from "lucide-react";
import { Meteors } from "@/components/ui/meteors";
import { useLanguage } from "@/contexts/LanguageContext";
import { getPageSEO } from "@/utils/seo";

const Contact = () => {
  const { lang } = useLanguage();
  const pageSEO = getPageSEO("contact");

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
              {lang === "en" ? "Get in Touch" : "Contáctanos"}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {lang === "en"
                ? "Ready to boost your social media presence? Let's talk."
                : "¿Listo para impulsar tu presencia en redes sociales? Hablemos."}
            </p>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <Card className="shadow-soft">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
                    <Phone className="h-6 w-6 text-foreground" />
                  </div>
                  <h3 className="font-heading font-semibold mb-2">
                    {lang === "en" ? "Phone" : "Teléfono"}
                  </h3>
                  <a href="tel:+19294468440" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    +1 (929) 446-8440
                  </a>
                </CardContent>
              </Card>

              <Card className="shadow-soft">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
                    <Mail className="h-6 w-6 text-foreground" />
                  </div>
                  <h3 className="font-heading font-semibold mb-2">
                    {lang === "en" ? "Email" : "Correo"}
                  </h3>
                  <a href="mailto:Brashline@gmail.com" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Brashline@gmail.com
                  </a>
                </CardContent>
              </Card>

              <Card className="shadow-soft">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
                    <Clock className="h-6 w-6 text-foreground" />
                  </div>
                  <h3 className="font-heading font-semibold mb-2">
                    {lang === "en" ? "Hours" : "Horario"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {lang === "en" ? "Mon–Fri 9:00–6:00 ET" : "Lun–Vie 9:00–18:00 ET"}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-soft">
              <CardContent className="p-8 text-center">
                <h2 className="text-2xl font-heading font-bold mb-4">
                  {lang === "en" ? "Schedule a Strategy Call" : "Agenda una Llamada Estratégica"}
                </h2>
                <p className="text-muted-foreground mb-6">
                  {lang === "en"
                    ? "Book a free 20-minute consultation to discuss your social media goals."
                    : "Reserva una consulta gratuita de 20 minutos para discutir tus objetivos en redes sociales."}
                </p>
                <Button size="lg" asChild>
                  <a href="https://api.whatsapp.com/send/?phone=19294468440&text&type=phone_number&app_absent=0" target="_blank" rel="noopener noreferrer">
                    {lang === "en" ? "Book Now" : "Reservar Ahora"}
                  </a>
                </Button>
                <p className="text-xs text-muted-foreground mt-4">
                  {lang === "en"
                    ? "Replies within 1 hour"
                    : "Respondemos en 1 hora"}
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
    </>
  );
};

export default Contact;
