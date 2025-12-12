/**
 * File overview: src/App.tsx
 *
 * General TypeScript module supporting the application.
 * Behavior:
 * - Encapsulates a small, well-defined responsibility within the codebase.
 * Assumptions:
 * - Callers rely on the exported surface; internal details may evolve over time.
 * Performance:
 * - Keep logic straightforward and avoid hidden global side effects.
 */
import { Suspense, lazy, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { AppProviders } from "@/providers/AppProviders";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { LoadingBar } from "@/components/ui/loading-bar";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import { AnimatePresence, motion } from "framer-motion";
import { analytics } from "@/lib/analytics";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useWebVitals } from "@/hooks/usePerformanceMonitor";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Lazy-load route components to reduce initial bundle size
const Services = lazy(() => import("./pages/Services"));
const Pricing = lazy(() => import("./pages/Pricing"));
const CaseStudies = lazy(() => import("./pages/CaseStudies"));
const About = lazy(() => import("./pages/About"));
const Blog = lazy(() => import("./pages/Blog"));
const Contact = lazy(() => import("./pages/Contact"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Cookies = lazy(() => import("./pages/Cookies"));
const Accessibility = lazy(() => import("./pages/Accessibility"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const SignIn = lazy(() => import("./pages/SignIn"));
const SignUp = lazy(() => import("./pages/SignUp"));
const Profile = lazy(() => import("./pages/Profile"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
const PaymentHistory = lazy(() => import("./pages/PaymentHistory"));

// Location pages for local SEO
const TampaPage = lazy(() => import("./pages/services/Tampa"));
const MiamiPage = lazy(() => import("./pages/services/Miami"));

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-muted-foreground">Loading...</p>
    </div>
  </div>
);

// Animated route wrapper for smooth page transitions
const AnimatedRoutes = () => {
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : -15 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.3, ease: "easeOut" }}
        style={{
          willChange: prefersReducedMotion ? "auto" : "transform, opacity",
          transform: "translate3d(0, 0, 0)",
        }}
      >
        <Routes location={location}>
          <Route path="/" element={<Index />} />
          <Route path="/services" element={<Services />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/case-studies" element={<CaseStudies />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="/accessibility" element={<Accessibility />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/sign-in/*" element={<SignIn />} />
          <Route path="/sign-up/*" element={<SignUp />} />
          <Route path="/profile/*" element={<Profile />} />
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/payment/history" element={<PaymentHistory />} />
          {/* Location-specific pages for local SEO */}
          <Route path="/services/tampa" element={<TampaPage />} />
          <Route path="/services/miami" element={<MiamiPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

// GA4 page view tracker using route changes
const GA4Tracker = () => {
  const location = useLocation();

  useEffect(() => {
    if (typeof window !== "undefined" && window.gtag) {
      // Send page_view event
      window.gtag("event", "page_view", {
        page_title: document.title,
        page_location: window.location.href,
        page_path: location.pathname + location.search,
      });

      // Also send config for backward compatibility
      window.gtag("config", "G-D614DSBGX5", {
        page_path: location.pathname + location.search,
      });

      if (import.meta.env.DEV) {
        console.log("GA4: Page view tracked -", location.pathname);
      }
    }
  }, [location.pathname, location.search]);

  return null;
};

// Initialize GA4 on app mount
const GA4Initializer = () => {
  useEffect(() => {
    analytics.init();
  }, []);

  return null;
};

const App = () => {
  // Track Web Vitals in development
  useWebVitals();

  return (
    <AppProviders>
      <Toaster />
      <Sonner />
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <GA4Initializer />
        <GA4Tracker />
        <LoadingBar />
        <Suspense fallback={<PageLoader />}>
          <main id="main-content">
            <AnimatedRoutes />
          </main>
        </Suspense>
      </BrowserRouter>
      <VercelAnalytics />
    </AppProviders>
  );
};

export default App;
