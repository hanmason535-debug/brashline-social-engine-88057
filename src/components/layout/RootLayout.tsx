/**
 * Root Layout Component
 * Provides consistent header/footer layout for all pages
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
      <Header />
      <Breadcrumbs />
      <BreadcrumbsJsonLd />
      <main className="flex-1">
        {children || <Outlet />}
      </main>
      <Footer />
    </div>
  );
}
