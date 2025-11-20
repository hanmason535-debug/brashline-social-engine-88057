/**
 * Root Layout Component
 * Provides consistent header/footer layout for all pages
 */
/**
 * File overview: src/components/layout/RootLayout.tsx
 *
 * React component `RootLayout` rendering a focused piece of UI.
 * Behavior:
 * - Receives props from parents and may read from hooks or context.
 * - Renders presentational markup and wires callbacks for user interaction.
 * Data flow:
 * - Follows a one-way data flow: parents own data, this component focuses on display.
 * Performance:
 * - Avoid expensive work during render and prefer memoized helpers for heavy subtrees.
 */
import { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import BreadcrumbsJsonLd from "@/components/SEO/BreadcrumbsJsonLd";

interface RootLayoutProps {
  children?: ReactNode;
}

export function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        Skip to main content
      </a>
      <Header />
      <Breadcrumbs />
      <BreadcrumbsJsonLd />
      <main id="main-content" className="flex-1">
        {children || <Outlet />}
      </main>
      <Footer />
    </div>
  );
}
