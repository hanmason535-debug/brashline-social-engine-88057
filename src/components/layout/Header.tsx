import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeSwitch from "@/components/ui/theme-switch";
import FlipButton from "@/components/ui/flip-button";
import { useLanguage } from "@/contexts/LanguageContext";

const navigation = {
  top: [
    { label: { en: "Home", es: "Inicio" }, href: "/" },
    { label: { en: "Services", es: "Servicios" }, href: "/services" },
    { label: { en: "Pricing", es: "Precios" }, href: "/pricing" },
    { label: { en: "Work", es: "Casos" }, href: "/case-studies" },
    { label: { en: "About", es: "Nosotros" }, href: "/about" },
    { label: { en: "Blog", es: "Blog" }, href: "/blog" },
    { label: { en: "Contact", es: "Contacto" }, href: "/contact" },
  ],
};

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { lang, setLang } = useLanguage();

  const isActive = (href: string) => location.pathname === href;

  return (
    <>
      {/* Skip to content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-0 focus:top-0 focus:z-50 focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-none"
      >
        {lang === "en" ? "Skip to main content" : "Saltar al contenido principal"}
      </a>

      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <nav className="container mx-auto flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center -space-x-1">
          <img
            src="/logo.png"
            alt="Brashline Logo"
            className="h-20 w-auto relative top-1"
            onError={(e) => {
              const img = e.currentTarget as HTMLImageElement;
              if (img.src.endsWith('/logo.png')) {
                img.onerror = null;
                img.src = '/logo.svg';
              }
            }}
          />
          <div className="-ml-3 text-xl font-heading font-bold text-foreground">
            BRASHLINE
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:items-center lg:gap-8">
          {navigation.top.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`nav-link text-sm font-medium transition-colors pb-1 ${
                isActive(item.href)
                  ? "text-foreground active"
                  : "text-foreground/80 hover:text-foreground"
              }`}
            >
              {item.label[lang]}
            </Link>
          ))}
        </div>

        {/* CTAs & Controls */}
        <div className="flex items-center gap-3">
          <ThemeSwitch className="hidden sm:flex scale-75" />
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLang(lang === "en" ? "es" : "en")}
            className="hidden sm:flex items-center gap-2"
          >
            <Globe className="h-4 w-4" />
            {lang.toUpperCase()}
          </Button>

          <FlipButton
            frontText={lang === "en" ? "Book Strategic Call" : "Reservar Llamada"}
            backText="📞 Calling…"
            from="top"
            href="https://wa.me/19294468440"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex"
          />

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border/40 bg-background">
          <div className="container mx-auto px-4 py-6 space-y-4">
            {navigation.top.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-2 text-base font-medium transition-colors ${
                  isActive(item.href)
                    ? "text-primary"
                    : "text-foreground/80 hover:text-primary"
                }`}
              >
                {item.label[lang]}
              </Link>
            ))}
            <div className="pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{lang === "en" ? "Theme" : "Tema"}</span>
                <ThemeSwitch className="scale-75" />
              </div>
              <FlipButton
                frontText={lang === "en" ? "Book Strategic Call" : "Reservar Llamada"}
                backText="📞 Calling…"
                from="top"
                href="https://wa.me/19294468440"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
                onClick={() => setMobileMenuOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
      </header>
    </>
  );
};

export default Header;
