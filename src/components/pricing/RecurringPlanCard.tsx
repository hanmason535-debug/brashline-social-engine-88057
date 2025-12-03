/**
 * File overview: src/components/pricing/RecurringPlanCard.tsx
 *
 * React component `RecurringPlanCard` rendering a focused piece of UI.
 * Behavior:
 * - Receives props from parents and may read from hooks or context.
 * - Renders presentational markup and wires callbacks for user interaction.
 * Data flow:
 * - Follows a one-way data flow: parents own data, this component focuses on display.
 * Performance:
 * - Avoid expensive work during render and prefer memoized helpers for heavy subtrees.
 */
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, ShoppingCart } from "lucide-react";
import { BorderBeam } from "@/components/ui/border-beam";
import { SparklesCore } from "@/components/ui/sparkles";
import { useCart } from "@/contexts/CartContext";
import { useStripe as useStripeContext } from "@/contexts/StripeContext";

interface RecurringPlanCardProps {
  tier: { en: string; es: string };
  name: string;
  price: number;
  annualPrice: number;
  annualDiscount: number;
  summary: { en: string; es: string };
  features: { en: string; es: string }[];
  featured?: boolean;
  lang: "en" | "es";
  billingInterval: "monthly" | "yearly";
  stripePriceIds?: { monthly?: string; yearly?: string };
}

export const RecurringPlanCard = ({
  tier,
  name,
  price,
  annualPrice,
  annualDiscount,
  summary,
  features,
  featured,
  lang,
  billingInterval,
  stripePriceIds,
}: RecurringPlanCardProps) => {
  const { addToCart } = useCart();
  const { createCheckoutSession, isLoading } = useStripeContext();

  const handleAddToCart = () => {
    const cartPrice = billingInterval === "yearly" ? annualPrice : price;
    addToCart({
      id: `recurring-${name.toLowerCase().replace(/\s+/g, "-")}`,
      name,
      price: cartPrice,
      type: "recurring",
      tier: tier[lang],
      summary: summary[lang],
      features: features.map((f) => f[lang]),
    });
  };

  const handleCheckout = async () => {
    // Resolve price ID from stripePriceIds or from environment variables as a fallback
    const normalized = name.toUpperCase().replace(/[^A-Z0-9]+/g, "_");
    const envKey = `VITE_STRIPE_PRICE_${normalized}_${billingInterval === "monthly" ? "MONTHLY" : "YEARLY"}`;
    const envPriceId = (import.meta.env as any)[envKey] as string | undefined;
    const priceId = billingInterval === "monthly" ? stripePriceIds?.monthly || envPriceId : stripePriceIds?.yearly || envPriceId;
    if (!priceId) {
      addToCart({
        id: `recurring-${name.toLowerCase().replace(/\s+/g, "-")}`,
        name,
        price,
        type: "recurring",
        tier: tier[lang],
        summary: summary[lang],
        features: features.map((f) => f[lang]),
      });
      return;
    }

    try {
      const result = await createCheckoutSession(priceId, "subscription");
      if (result?.url) {
        window.location.href = result.url;
      }
    } catch (err) {
      // On error, fallback to add to cart
      addToCart({
        id: `recurring-${name.toLowerCase().replace(/\s+/g, "-")}`,
        name,
        price,
        type: "recurring",
        tier: tier[lang],
        summary: summary[lang],
        features: features.map((f) => f[lang]),
      });
    }
  };

  return (
    <Card
      className={`group relative flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-glow ${
        featured
          ? "shadow-glow border-primary scale-105 overflow-hidden"
          : "shadow-soft hover:shadow-medium"
      }`}
    >
      {featured && (
        <>
          <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300">
            <BorderBeam
              duration={12}
              size={300}
              delay={0}
              colorFrom="hsl(var(--primary))"
              colorTo="hsl(var(--primary-glow))"
            />
            <BorderBeam
              duration={12}
              size={300}
              delay={6}
              borderWidth={2}
              colorFrom="hsl(var(--primary-glow))"
              colorTo="hsl(var(--primary))"
            />
          </div>
          <div className="absolute inset-0 w-full h-full pointer-events-none">
            <SparklesCore
              background="transparent"
              minSize={0.4}
              maxSize={1}
              particleDensity={100}
              className="w-full h-full"
              particleColor="hsl(var(--primary))"
            />
          </div>
        </>
      )}
      <CardHeader className="text-center pb-8 relative z-10">
        {featured && (
          <div className="relative">
            <Badge className="mb-4 bg-primary text-primary-foreground font-bold relative z-10">
              {lang === "en" ? "MOST POPULAR" : "MÁS POPULAR"}
            </Badge>
          </div>
        )}
        <Badge variant="outline" className="mb-4 self-center bg-background/80 backdrop-blur-sm">
          {tier[lang]}
        </Badge>
        <h3 className="text-2xl font-heading font-bold mb-2">{name}</h3>
        <p className="text-sm text-muted-foreground mb-4">{summary[lang]}</p>
        <div className="mb-2">
          <span className="text-4xl font-heading font-bold">${price}</span>
          <span className="text-muted-foreground">/mo</span>
        </div>
        <p className="text-xs text-muted-foreground">
          {lang === "en" ? "or" : "o"} ${annualPrice}/yr ({lang === "en" ? "save" : "ahorra"}{" "}
          {annualDiscount}%)
        </p>
      </CardHeader>

      <CardContent className="space-y-3 flex-1 relative z-10">
        {features.map((feature, i) => (
          <div key={i} className="flex items-start gap-3">
            <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
            <span className="text-sm">{feature[lang]}</span>
          </div>
        ))}
      </CardContent>

      <CardFooter className="pt-6 relative z-10 flex gap-3">
        <Button
          onClick={handleCheckout}
          className="w-full transition-transform hover:scale-105 gap-2"
          variant={featured ? "default" : "outline"}
          disabled={isLoading}
        >
          <ShoppingCart className="h-4 w-4" />
          {isLoading ? (lang === "en" ? "Processing..." : "Procesando...") : (lang === "en" ? "Get Started" : "Comenzar")}
        </Button>
        <Button
          onClick={handleAddToCart}
          className="w-full transition-transform hover:scale-105 gap-2"
          variant={featured ? "secondary" : "ghost"}
        >
          <ShoppingCart className="h-4 w-4" />
          {lang === "en" ? "Add to Cart" : "Agregar al Carrito"}
        </Button>
      </CardFooter>
    </Card>
  );
};

// Provide a default export to align with imports across the codebase
export default RecurringPlanCard;
