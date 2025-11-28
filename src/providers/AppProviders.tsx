/**
 * App Providers Composition
 * Centralized provider composition to reduce nesting in App.tsx
 */
/**
 * File overview: src/providers/AppProviders.tsx
 *
 * React context/provider responsible for shared application state.
 * Behavior:
 * - Owns the shape of the context value and update surface.
 * - Coordinates state changes that span multiple feature areas.
 * Assumptions:
 * - Consumers are mounted beneath this provider in the component tree.
 * Performance:
 * - Be mindful when extending the context value to avoid broad re-renders.
 */
import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { HelmetProvider } from "react-helmet-async";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { StripeProvider } from "@/contexts/StripeContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ErrorBoundary } from "@/components/ErrorBoundary";

// Configure QueryClient with sensible defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60000, // 1 minute
      gcTime: 300000, // 5 minutes (formerly cacheTime in React Query v4)
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <LanguageProvider>
              <AuthProvider>
                <StripeProvider>
                  <CartProvider>
                    <TooltipProvider>{children}</TooltipProvider>
                  </CartProvider>
                </StripeProvider>
              </AuthProvider>
            </LanguageProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}
