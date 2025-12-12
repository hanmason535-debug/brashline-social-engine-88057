/**
 * Checkout Page - Redirects to Stripe hosted checkout
 * No custom forms, no duplicate pricing cards. Just a clean redirect flow.
 */
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { RootLayout } from "@/components/layout/RootLayout";
import SEOHead from "@/components/SEO/SEOHead";
import { useLanguage } from "@/contexts/LanguageContext";
import { useStripe as useStripeContext } from "@/contexts/StripeContext";
import { Loader2 } from "lucide-react";

const Checkout = () => {
  const { lang } = useLanguage();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { createCheckoutSession, isLoading, error } = useStripeContext();
  const [redirecting, setRedirecting] = useState(false);

  const priceId = searchParams.get("priceId");
  const mode = (searchParams.get("mode") as "payment" | "subscription") || "subscription";

  const content = {
    en: {
      title: "Checkout",
      redirecting: "Redirecting to secure payment...",
      error: "Something went wrong. Please try again.",
      noPrice: "No plan selected. Please choose a plan first.",
      backToPricing: "Back to Pricing",
    },
    es: {
      title: "Pago",
      redirecting: "Redirigiendo al pago seguro...",
      error: "Algo salió mal. Por favor, inténtalo de nuevo.",
      noPrice: "No se seleccionó plan. Por favor, elige un plan primero.",
      backToPricing: "Volver a Precios",
    },
  };

  const t = content[lang];

  useEffect(() => {
    const initiateCheckout = async () => {
      if (!priceId) return;
      if (redirecting) return;

      setRedirecting(true);

      try {
        const result = await createCheckoutSession(priceId, mode);
        if (result?.url) {
          window.location.href = result.url;
        }
      } catch (err) {
        setRedirecting(false);
      }
    };

    initiateCheckout();
  }, [priceId, mode, createCheckoutSession, redirecting]);

  // No price ID provided - show error and link back
  if (!priceId) {
    return (
      <RootLayout>
        <SEOHead
          pageSEO={{
            title: t.title,
            description: "Complete your order",
            keywords: "checkout, billing, payment, brashline",
            ogImage: "/images/og-contact.jpg",
          }}
          lang={lang}
        />
        <main id="main-content" className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center px-4">
            <p className="text-lg text-muted-foreground mb-6">{t.noPrice}</p>
            <button
              onClick={() => navigate("/pricing")}
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-colors"
            >
              {t.backToPricing}
            </button>
          </div>
        </main>
      </RootLayout>
    );
  }

  // Error state
  if (error && !isLoading && !redirecting) {
    return (
      <RootLayout>
        <SEOHead
          pageSEO={{
            title: t.title,
            description: "Complete your order",
            keywords: "checkout, billing, payment, brashline",
            ogImage: "/images/og-contact.jpg",
          }}
          lang={lang}
        />
        <main id="main-content" className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center px-4">
            <p className="text-lg text-destructive mb-6">{t.error}</p>
            <p className="text-sm text-muted-foreground mb-6">{error}</p>
            <button
              onClick={() => navigate("/pricing")}
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-colors"
            >
              {t.backToPricing}
            </button>
          </div>
        </main>
      </RootLayout>
    );
  }

  // Loading / Redirecting state
  return (
    <RootLayout>
      <SEOHead
        pageSEO={{
          title: t.title,
          description: "Complete your order",
          keywords: "checkout, billing, payment, brashline",
          ogImage: "/images/og-contact.jpg",
        }}
        lang={lang}
      />
      <main id="main-content" className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center px-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-6" />
          <p className="text-lg font-medium text-foreground">{t.redirecting}</p>
        </div>
      </main>
    </RootLayout>
  );
};

export default Checkout;
