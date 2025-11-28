/**
 * Stripe Context
 * Provides Stripe payment functionality throughout the application
 */
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { Elements } from "@stripe/react-stripe-js";
import { type Stripe } from "@stripe/stripe-js";
import { getStripe, type ProductId, type BillingInterval, PRODUCTS } from "@/lib/stripe";
import { useAuth } from "@clerk/clerk-react";

// Types
interface Subscription {
  id: string;
  stripeSubscriptionId: string;
  status: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  canceledAt: string | null;
  price: {
    stripePriceId: string;
    amount: number;
    currency: string;
    interval: string;
  };
  product: {
    name: string;
    description: string;
  };
}

interface StripeContextType {
  // State
  isLoading: boolean;
  error: string | null;
  subscription: Subscription | null;
  
  // Actions
  createCheckoutSession: (
    priceId: string,
    mode?: "payment" | "subscription"
  ) => Promise<{ sessionId: string; url: string } | null>;
  createPaymentIntent: (
    amount: number,
    description?: string
  ) => Promise<{ clientSecret: string; paymentIntentId: string } | null>;
  openCustomerPortal: () => Promise<void>;
  refreshSubscription: () => Promise<void>;
  clearError: () => void;
}

const StripeContext = createContext<StripeContextType | undefined>(undefined);

// API URL
const API_URL = import.meta.env.VITE_API_URL || "";

interface StripeProviderProps {
  children: ReactNode;
}

export function StripeProvider({ children }: StripeProviderProps) {
  const { getToken, isSignedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [stripePromise] = useState(() => getStripe());

  // Get auth headers
  const getAuthHeaders = useCallback(async (): Promise<HeadersInit> => {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };
    
    if (isSignedIn) {
      const token = await getToken();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }
    
    return headers;
  }, [getToken, isSignedIn]);

  // Create checkout session
  const createCheckoutSession = useCallback(
    async (
      priceId: string,
      mode: "payment" | "subscription" = "subscription"
    ): Promise<{ sessionId: string; url: string } | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const headers = await getAuthHeaders();
        const response = await fetch(`${API_URL}/api/stripe/create-checkout-session`, {
          method: "POST",
          headers,
          body: JSON.stringify({
            priceId,
            mode,
            successUrl: `${window.location.origin}/payment/success`,
            cancelUrl: `${window.location.origin}/pricing`,
          }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error?.message || "Failed to create checkout session");
        }

        return data.data;
      } catch (err) {
        const message = err instanceof Error ? err.message : "An error occurred";
        setError(message);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [getAuthHeaders]
  );

  // Create payment intent for custom payment flows
  const createPaymentIntent = useCallback(
    async (
      amount: number,
      description?: string
    ): Promise<{ clientSecret: string; paymentIntentId: string } | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const headers = await getAuthHeaders();
        const response = await fetch(`${API_URL}/api/stripe/create-payment-intent`, {
          method: "POST",
          headers,
          body: JSON.stringify({
            amount,
            currency: "usd",
            description,
          }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error?.message || "Failed to create payment intent");
        }

        return data.data;
      } catch (err) {
        const message = err instanceof Error ? err.message : "An error occurred";
        setError(message);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [getAuthHeaders]
  );

  // Open customer portal
  const openCustomerPortal = useCallback(async (): Promise<void> => {
    if (!isSignedIn) {
      setError("Please sign in to manage your subscription");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_URL}/api/stripe/customer-portal`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          returnUrl: window.location.href,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error?.message || "Failed to open customer portal");
      }

      // Redirect to customer portal
      window.location.href = data.data.url;
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [getAuthHeaders, isSignedIn]);

  // Refresh subscription status
  const refreshSubscription = useCallback(async (): Promise<void> => {
    if (!isSignedIn) {
      setSubscription(null);
      return;
    }

    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_URL}/api/stripe/subscription`, {
        method: "GET",
        headers,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubscription(data.data.subscription);
      } else {
        setSubscription(null);
      }
    } catch (err) {
      console.error("Failed to fetch subscription:", err);
      setSubscription(null);
    }
  }, [getAuthHeaders, isSignedIn]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: StripeContextType = {
    isLoading,
    error,
    subscription,
    createCheckoutSession,
    createPaymentIntent,
    openCustomerPortal,
    refreshSubscription,
    clearError,
  };

  return (
    <StripeContext.Provider value={value}>
      <StripeElements stripePromise={stripePromise}>{children}</StripeElements>
    </StripeContext.Provider>
  );
}

// Wrapper component for Stripe Elements
function StripeElements({
  children,
  stripePromise,
}: {
  children: ReactNode;
  stripePromise: Promise<Stripe | null>;
}) {
  return (
    <Elements
      stripe={stripePromise}
      options={{
        appearance: {
          theme: "stripe",
          variables: {
            colorPrimary: "#0f172a",
            colorBackground: "#ffffff",
            colorText: "#1e293b",
            colorDanger: "#ef4444",
            fontFamily: "Inter, system-ui, sans-serif",
            spacingUnit: "4px",
            borderRadius: "8px",
          },
        },
      }}
    >
      {children}
    </Elements>
  );
}

// Hook to use Stripe context
export function useStripe() {
  const context = useContext(StripeContext);
  if (context === undefined) {
    throw new Error("useStripe must be used within a StripeProvider");
  }
  return context;
}

// Export product helpers
export { PRODUCTS, type ProductId, type BillingInterval };
