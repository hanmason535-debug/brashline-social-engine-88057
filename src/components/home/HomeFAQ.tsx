/**
 * Homepage FAQ Section with SEO Schema
 * Targets high-value keywords for local search
 */

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FAQItem {
    question: { en: string; es: string };
    answer: { en: string; es: string };
}

const FAQ_DATA: FAQItem[] = [
    {
        question: {
            en: "How much does social media management cost in Orlando?",
            es: "¿Cuánto cuesta la gestión de redes sociales en Orlando?",
        },
        answer: {
            en: "Our Orlando social media packages are designed to be affordable for small businesses. We offer transparent monthly pricing with no long-term contracts, starting at competitive rates that include content creation, posting, and reporting.",
            es: "Nuestros paquetes de redes sociales en Orlando están diseñados para ser asequibles para pequeñas empresas. Ofrecemos precios mensuales transparentes sin contratos a largo plazo, comenzando con tarifas competitivas que incluyen creación de contenido, publicaciones e informes.",
        },
    },
    {
        question: {
            en: "Do you work with restaurants in Florida?",
            es: "¿Trabajan con restaurantes en Florida?",
        },
        answer: {
            en: "Yes! We specialize in social media for Orlando restaurants and food businesses. Our packages include Instagram content, Google Business Profile optimization, and integration with delivery platforms like DoorDash, UberEats, and Groupon.",
            es: "¡Sí! Nos especializamos en redes sociales para restaurantes y negocios de comida en Orlando. Nuestros paquetes incluyen contenido de Instagram, optimización de Google Business Profile e integración con plataformas de entrega como DoorDash, UberEats y Groupon.",
        },
    },
    {
        question: {
            en: "What social media platforms do you manage?",
            es: "¿Qué plataformas de redes sociales manejan?",
        },
        answer: {
            en: "We manage all major platforms including Instagram, Facebook, Google Business Profile, Yelp, Nextdoor, LinkedIn, and TikTok. We focus on the platforms that matter most for your industry and local audience in Florida.",
            es: "Manejamos todas las plataformas principales incluyendo Instagram, Facebook, Google Business Profile, Yelp, Nextdoor, LinkedIn y TikTok. Nos enfocamos en las plataformas que más importan para tu industria y audiencia local en Florida.",
        },
    },
    {
        question: {
            en: "How is Brashline different from other Orlando agencies?",
            es: "¿En qué se diferencia Brashline de otras agencias de Orlando?",
        },
        answer: {
            en: "We're built specifically for small businesses, not big corporations. That means affordable pricing, no confusing contracts, and a team that actually responds to your messages. We focus on real results - more visibility, more engagement, and more customers - not vanity metrics.",
            es: "Estamos construidos específicamente para pequeñas empresas, no para grandes corporaciones. Eso significa precios asequibles, sin contratos confusos, y un equipo que realmente responde a tus mensajes. Nos enfocamos en resultados reales - más visibilidad, más engagement y más clientes - no métricas de vanidad.",
        },
    },
];

interface HomeFAQProps {
    lang: "en" | "es";
}

export default function HomeFAQ({ lang }: HomeFAQProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    // Generate FAQ Schema for SEO
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: FAQ_DATA.map((faq) => ({
            "@type": "Question",
            name: faq.question.en,
            acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer.en,
            },
        })),
    };

    return (
        <section className="py-20 bg-background">
            {/* Inject FAQ Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />

            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-4">
                        {lang === "en"
                            ? "Frequently Asked Questions"
                            : "Preguntas Frecuentes"}
                    </h2>
                    <p className="text-muted-foreground text-center mb-12">
                        {lang === "en"
                            ? "Common questions about social media management for Florida businesses"
                            : "Preguntas comunes sobre gestión de redes sociales para negocios de Florida"}
                    </p>

                    <div className="space-y-4">
                        {FAQ_DATA.map((faq, index) => (
                            <div
                                key={index}
                                className="border border-border rounded-lg overflow-hidden"
                            >
                                <button
                                    onClick={() => toggleFAQ(index)}
                                    className="w-full flex items-center justify-between p-5 text-left bg-card hover:bg-muted/50 transition-colors"
                                    aria-expanded={openIndex === index}
                                >
                                    <span className="font-medium pr-4">
                                        {faq.question[lang]}
                                    </span>
                                    {openIndex === index ? (
                                        <ChevronUp className="h-5 w-5 shrink-0 text-primary" />
                                    ) : (
                                        <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground" />
                                    )}
                                </button>
                                <AnimatePresence>
                                    {openIndex === index && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <div className="p-5 pt-0 text-muted-foreground border-t border-border">
                                                {faq.answer[lang]}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
