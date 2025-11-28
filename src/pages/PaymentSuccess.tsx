/**
 * Payment Success Page
 * Displayed after successful payment or subscription
 */
import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2, ArrowRight, Home } from "lucide-react";
import { SubscriptionStatus } from "@/components/payment";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const { isSignedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    // Give a moment for webhook to process
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="container flex min-h-[60vh] items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-lg font-medium">Processing your payment...</p>
            <p className="text-sm text-muted-foreground">Please wait a moment</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-2xl space-y-8">
        {/* Success Message */}
        <Card>
          <CardContent className="flex flex-col items-center py-12">
            <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/20 mb-6">
              <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-2xl mb-2">Payment Successful!</CardTitle>
            <CardDescription className="text-center max-w-md">
              Thank you for your purchase. Your payment has been processed successfully
              and you now have access to all features included in your plan.
            </CardDescription>
          </CardContent>
        </Card>

        {/* Subscription Details */}
        {isSignedIn && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Your Subscription</h2>
            <SubscriptionStatus />
          </div>
        )}

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">What's Next?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 p-2 shrink-0">
                <span className="text-sm font-bold text-primary">1</span>
              </div>
              <div>
                <p className="font-medium">Check your email</p>
                <p className="text-sm text-muted-foreground">
                  We've sent you a confirmation email with your receipt and next steps.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 p-2 shrink-0">
                <span className="text-sm font-bold text-primary">2</span>
              </div>
              <div>
                <p className="font-medium">Set up your account</p>
                <p className="text-sm text-muted-foreground">
                  Complete your profile and configure your preferences in the dashboard.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 p-2 shrink-0">
                <span className="text-sm font-bold text-primary">3</span>
              </div>
              <div>
                <p className="font-medium">Schedule a call</p>
                <p className="text-sm text-muted-foreground">
                  Book your onboarding call with our team to get started.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link to="/dashboard">
              Go to Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
