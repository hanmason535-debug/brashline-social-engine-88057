/**
 * Pricing Card Component
 * Displays a pricing plan with Stripe checkout integration
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { useStripe as useStripeContext, PRODUCTS, type ProductId } from "@/contexts/StripeContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface PricingCardProps {
  productId: ProductId;
  priceId: string;
  billingInterval: "monthly" | "yearly";
  featured?: boolean;
}

export function PricingCard({
  productId,
  priceId,
  billingInterval,
  featured = false,
}: PricingCardProps) {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();
  const { createCheckoutSession, isLoading } = useStripeContext();
  const [isProcessing, setIsProcessing] = useState(false);

  const product = PRODUCTS[productId];
  const price = product.prices[billingInterval];

  const handleSubscribe = async () => {
    if (!isSignedIn) {
      // Redirect to sign in with return URL
      navigate(`/sign-in?redirect_url=/pricing`);
      return;
    }

    setIsProcessing(true);
    try {
      const result = await createCheckoutSession(priceId, "subscription");
      if (result?.url) {
        window.location.href = result.url;
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(cents / 100);
  };

  return (
    <Card
      className={cn(
        "relative flex flex-col",
        featured && "border-primary shadow-lg scale-105"
      )}
    >
      {featured && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Sparkles className="mr-1 h-3 w-3" />
          Most Popular
        </Badge>
      )}

      <CardHeader className="text-center">
        <CardTitle className="text-xl">{product.name}</CardTitle>
        <CardDescription>{product.description}</CardDescription>
      </CardHeader>

      <CardContent className="flex-1">
        <div className="text-center mb-6">
          <span className="text-4xl font-bold">{formatPrice(price)}</span>
          <span className="text-muted-foreground">
            /{billingInterval === "monthly" ? "mo" : "yr"}
          </span>
          {billingInterval === "yearly" && (
            <p className="mt-1 text-sm text-green-600">
              Save {formatPrice(product.prices.monthly * 12 - product.prices.yearly)}/year
            </p>
          )}
        </div>

        <ul className="space-y-3">
          {product.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter>
        <Button
          onClick={handleSubscribe}
          disabled={isProcessing || isLoading || !priceId}
          className="w-full"
          variant={featured ? "default" : "outline"}
          size="lg"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : !priceId ? (
            "Coming Soon"
          ) : (
            "Get Started"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default PricingCard;
