/**
 * File overview: src/components/layout/Header.tsx
 *
 * React component `Header` rendering a focused piece of UI.
 * Behavior:
 * - Receives props from parents and may read from hooks or context.
 * - Renders presentational markup and wires callbacks for user interaction.
 * Data flow:
 * - Follows a one-way data flow: parents own data, this component focuses on display.
 * Performance:
 * - Avoid expensive work during render and prefer memoized helpers for heavy subtrees.
 */
import { useState, memo, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Globe, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeSwitch from "@/components/ui/theme-switch";
import FlipButton from "@/components/ui/flip-button";
import { CartIcon } from "@/components/ui/cart-icon";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";

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

const Header = memo(() => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { lang, setLang } = useLanguage();
  const { isAuthenticated } = useAuth();
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const isActive = (href: string) => location.pathname === href;

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Handle escape key to close mobile menu
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when menu is open
      document.body.style.overflow = "hidden";

      // Focus first link when menu opens
      setTimeout(() => {
        const firstLink = mobileMenuRef.current?.querySelector("a");
        firstLink?.focus();
      }, 100);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

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
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="Brashline Logo"
              className="h-16 w-auto"
              loading="eager"
              onError={(e) => {
                const img = e.currentTarget as HTMLImageElement;
                if (img.src.endsWith("/logo.png")) {
                  img.onerror = null; // Prevent infinite loop
                  img.src = "/logo.svg";
                }
              }}
            />
            <div className="text-xl font-heading font-bold text-foreground">BRASHLINE</div>
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
            <CartIcon />

            {isAuthenticated && (
              <Link to="/dashboard">
                <Button variant="ghost" size="sm" className="hidden sm:flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {lang === "en" ? "Dashboard" : "Panel"}
                </Button>
              </Link>
            )}

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
              ref={menuButtonRef}
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-label={
                mobileMenuOpen
                  ? lang === "en"
                    ? "Close menu"
                    : "Cerrar menú"
                  : lang === "en"
                    ? "Open menu"
                    : "Abrir menú"
              }
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <>
            {/* Backdrop with blur effect */}
            <div
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Mobile Menu Panel */}
            <div
              ref={mobileMenuRef}
              className="fixed inset-x-0 top-16 z-50 lg:hidden border-t border-border/40 bg-background shadow-glow animate-slide-in-right"
              role="dialog"
              aria-modal="true"
              aria-label={lang === "en" ? "Mobile navigation" : "Navegación móvil"}
            >
              <div className="container mx-auto px-4 py-6 space-y-4 max-h-[calc(100vh-4rem)] overflow-y-auto">
                {navigation.top.map((item, index) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block py-3 px-4 text-lg font-medium transition-all duration-300 rounded-lg ${
                      isActive(item.href)
                        ? "text-primary bg-primary/10"
                        : "text-foreground/80 hover:text-primary hover:bg-muted"
                    }`}
                    style={{
                      animationDelay: `${index * 50}ms`,
                      animation: "fade-in 0.3s ease-out forwards",
                      opacity: 0,
                    }}
                  >
                    {item.label[lang]}
                  </Link>
                ))}
                <div className="pt-4 space-y-4 border-t border-border/40">
                  <div className="flex items-center justify-between px-4">
                    <span className="text-sm text-muted-foreground">
                      {lang === "en" ? "Theme" : "Tema"}
                    </span>
                    <ThemeSwitch className="scale-90" />
                  </div>
                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={() => {
                      setLang(lang === "en" ? "es" : "en");
                    }}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <Globe className="h-5 w-5" />
                    {lang === "en" ? "Español" : "English"}
                  </Button>
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
          </>
        )}
      </header>
    </>
  );
});

Header.displayName = "Header";

export default Header;
