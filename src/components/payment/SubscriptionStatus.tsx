/**
 * Subscription Status Component
 * Displays current subscription info with management options
 */
import { useEffect } from "react";
import { useStripe as useStripeContext } from "@/contexts/StripeContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, CreditCard, Settings, Calendar, AlertCircle } from "lucide-react";
import { format } from "date-fns";

interface SubscriptionStatusProps {
  showManageButton?: boolean;
}

export function SubscriptionStatus({ showManageButton = true }: SubscriptionStatusProps) {
  const { subscription, isLoading, refreshSubscription, openCustomerPortal } = useStripeContext();

  useEffect(() => {
    refreshSubscription();
  }, [refreshSubscription]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!subscription) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <CreditCard className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No active subscription</p>
          <Button className="mt-4" variant="outline" asChild>
            <a href="/pricing">View Plans</a>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const statusColors: Record<string, string> = {
    active: "bg-green-500",
    trialing: "bg-blue-500",
    past_due: "bg-yellow-500",
    canceled: "bg-red-500",
  };

  const formatAmount = (cents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: subscription.price.currency.toUpperCase(),
    }).format(cents / 100);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{subscription.product.name}</CardTitle>
          <Badge className={statusColors[subscription.status] || "bg-gray-500"}>
            {subscription.status.replace("_", " ")}
          </Badge>
        </div>
        <CardDescription>{subscription.product.description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Price</span>
          <span className="font-semibold">
            {formatAmount(subscription.price.amount)}/{subscription.price.interval}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-muted-foreground flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            Current Period
          </span>
          <span className="text-sm">
            {format(new Date(subscription.currentPeriodStart), "MMM d")} -{" "}
            {format(new Date(subscription.currentPeriodEnd), "MMM d, yyyy")}
          </span>
        </div>

        {subscription.cancelAtPeriodEnd && (
          <div className="flex items-center gap-2 rounded-lg bg-yellow-50 p-3 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200">
            <AlertCircle className="h-5 w-5" />
            <span className="text-sm">
              Subscription ends on {format(new Date(subscription.currentPeriodEnd), "MMM d, yyyy")}
            </span>
          </div>
        )}
      </CardContent>

      {showManageButton && (
        <CardFooter>
          <Button
            onClick={() => openCustomerPortal()}
            variant="outline"
            className="w-full"
          >
            <Settings className="mr-2 h-4 w-4" />
            Manage Subscription
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

export default SubscriptionStatus;
