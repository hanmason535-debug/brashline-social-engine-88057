/**
 * File overview: src/components/pricing/OneTimePackageCard.tsx
 *
 * React component for rendering one-time package cards with Stripe checkout support.
 * Behavior:
 * - Displays package information with pricing
 * - Provides both "Buy Now" (Stripe checkout) and "Add to Cart" options
 * Data flow:
 * - Uses StripeContext for checkout, CartContext for cart functionality
 */
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, ShoppingCart, CreditCard } from "lucide-react";
import { BorderBeam } from "@/components/ui/border-beam";
import { useCart } from "@/contexts/CartContext";
import { useStripe as useStripeContext } from "@/contexts/StripeContext";

interface OneTimePackageCardProps {
  name: string;
  price: number;
  tagline: string;
  features: string[];
  bestFor: string;
  featured?: boolean;
  lang: "en" | "es";
  stripePriceId?: string;
  stripeProductId?: string;
  compact?: boolean;
}

export const OneTimePackageCard = ({
  name,
  price,
  tagline,
  features,
  bestFor,
  featured = false,
  lang,
  stripePriceId,
  compact = false,
}: OneTimePackageCardProps) => {
  const { addToCart } = useCart();
  const { createCheckoutSession, isLoading } = useStripeContext();

  const handleAddToCart = () => {
    addToCart({
      id: `onetime-${name.toLowerCase().replace(/\s+/g, "-")}`,
      name,
      price,
      type: "one-time",
      summary: tagline,
      features,
    });
  };

  const handleCheckout = async () => {
    // If no price ID configured, fall back to cart
    if (!stripePriceId || stripePriceId.includes("placeholder")) {
      handleAddToCart();
      return;
    }

    try {
      const result = await createCheckoutSession(stripePriceId, "payment");
      if (result?.url) {
        window.location.href = result.url;
      }
    } catch (err) {
      // On error, fallback to add to cart
      handleAddToCart();
    }
  };

  if (compact) {
    return (
      <Card className="relative shadow-soft hover:shadow-glow transition-all duration-700 hover:-translate-y-2 flex flex-col">
        <CardHeader className="pb-6">
          <h3 className="text-xl font-heading font-bold mb-2">{name}</h3>
          <p className="text-sm text-muted-foreground mb-4">{tagline}</p>
          <div>
            <span className="text-3xl font-heading font-bold">${price}</span>
            <span className="text-muted-foreground text-sm ml-2">
              {lang === "en" ? "one-time" : "único pago"}
            </span>
          </div>
        </CardHeader>

        <CardContent className="space-y-3 flex-1">
          {features.map((feature, i) => (
            <div key={i} className="flex items-start gap-3">
              <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-xs">{feature}</span>
            </div>
          ))}
          <div className="pt-3 mt-3 border-t border-border">
            <p className="text-xs text-muted-foreground italic">
              <span className="font-semibold">
                {lang === "en" ? "Best for:" : "Mejor para:"}
              </span>{" "}
              {bestFor}
            </p>
          </div>
        </CardContent>

        <CardFooter className="pt-4 flex gap-2">
          <Button
            className="flex-1 gap-2"
            onClick={handleCheckout}
            disabled={isLoading}
          >
            <CreditCard className="h-4 w-4" />
            {isLoading 
              ? (lang === "en" ? "Processing..." : "Procesando...") 
              : (lang === "en" ? "Buy Now" : "Comprar")}
          </Button>
          <Button
            className="gap-2"
            variant="outline"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className={`group relative shadow-glow border-primary overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-glow ${featured ? "max-w-4xl mx-auto" : ""}`}>
      {featured && (
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
      )}
      
      <CardHeader className="text-center pb-8 pt-8">
        <h3 className="text-3xl font-heading font-bold mb-4">{name}</h3>
        <p className="text-lg text-muted-foreground mb-6">{tagline}</p>
        <div className="mb-4">
          <span className="text-5xl font-heading font-bold">${price}</span>
          <span className="text-muted-foreground ml-2">
            {lang === "en" ? "one-time" : "único pago"}
          </span>
        </div>
      </CardHeader>

      <CardContent className="grid md:grid-cols-2 gap-4 pb-8">
        {features.map((feature, i) => (
          <div key={i} className="flex items-start gap-3">
            <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <span className="text-sm">{feature}</span>
          </div>
        ))}
        <div className="md:col-span-2 pt-4 mt-4 border-t border-border">
          <p className="text-sm text-muted-foreground italic text-center">
            <span className="font-semibold">
              {lang === "en" ? "Best for:" : "Mejor para:"}
            </span>{" "}
            {bestFor}
          </p>
        </div>
      </CardContent>

      <CardFooter className="pt-6 pb-8 flex gap-4">
        <Button
          className="flex-1 gap-2"
          size="lg"
          onClick={handleCheckout}
          disabled={isLoading}
        >
          <CreditCard className="h-5 w-5" />
          {isLoading 
            ? (lang === "en" ? "Processing..." : "Procesando...") 
            : (lang === "en" ? "Buy Now" : "Comprar Ahora")}
        </Button>
        <Button
          className="gap-2"
          size="lg"
          variant="outline"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="h-5 w-5" />
          {lang === "en" ? "Add to Cart" : "Agregar"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OneTimePackageCard;
