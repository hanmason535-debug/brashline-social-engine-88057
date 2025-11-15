/**
 * File overview: src/components/layout/Footer.tsx
 *
 * React component `Footer` rendering a focused piece of UI.
 * Behavior:
 * - Receives props from parents and may read from hooks or context.
 * - Renders presentational markup and wires callbacks for user interaction.
 * Data flow:
 * - Follows a one-way data flow: parents own data, this component focuses on display.
 * Performance:
 * - Avoid expensive work during render and prefer memoized helpers for heavy subtrees.
 */
import { memo } from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Linkedin, Youtube, Twitter } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const footerLinks = [
  { label: { en: "Terms", es: "Términos" }, href: "/terms" },
  { label: { en: "Privacy", es: "Privacidad" }, href: "/privacy" },
  { label: { en: "Cookie Policy", es: "Cookies" }, href: "/cookies" },
  { label: { en: "Accessibility", es: "Accesibilidad" }, href: "/accessibility" },
];

const socialLinks = [
  { icon: Facebook, href: "https://www.facebook.com/profile.php?id=61583138566921", label: "Facebook", external: true },
  { icon: Instagram, href: "https://www.instagram.com/brashlineofficial/", label: "Instagram", external: true },
  { icon: Twitter, href: "https://x.com/brashlinex?s=11", label: "X (Twitter)", external: true },
  { icon: Linkedin, href: "/linkedin-not-found", label: "LinkedIn", external: false },
  { icon: Youtube, href: "/youtube-not-found", label: "YouTube", external: false },
];

const Footer = memo(() => {
  const { lang } = useLanguage();
  
  return (
    <footer className="border-t border-border/40 bg-muted/30">
  <div className="container mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <Link to="/" className="mb-4 inline-flex items-center gap-2">
              <img
                src="/logo.png"
                alt="Brashline Logo"
                className="h-16 w-auto"
                loading="lazy"
                onError={(e) => {
                  const img = e.currentTarget as HTMLImageElement;
                  if (img.src.endsWith('/logo.png')) {
                    img.onerror = null;
                    img.src = '/logo.svg';
                  }
                }}
              />
              <div className="text-xl font-heading font-bold text-foreground">
                BRASHLINE
              </div>
            </Link>
            <p className="text-sm text-muted-foreground">
              {lang === "en"
                ? "Orlando-based partners helping Florida businesses stay visible online."
                : "Socios en Orlando ayudando a negocios de Florida a mantenerse visibles."}
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading font-semibold mb-4">
              {lang === "en" ? "Contact" : "Contacto"}
            </h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="font-semibold text-foreground">Brashline</p>
              <p>Orlando, Florida</p>
              <p>
                <a href="tel:+19294468440" className="hover:text-primary transition-colors">
                  +1 (929) 446-8440
                </a>
              </p>
              <p>
                <a href="mailto:Brashline@gmail.com" className="hover:text-primary transition-colors">
                  Brashline@gmail.com
                </a>
              </p>
              <p className="text-xs mt-2">
                {lang === "en"
                  ? "Replies within 1 business day"
                  : "Respondemos en 1 día hábil"}
              </p>
              <p className="text-xs">
                {lang === "en" ? "Mon–Fri 9:00–6:00 ET" : "Lun–Vie 9:00–18:00 ET"}
              </p>
            </div>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-heading font-semibold mb-4">
              {lang === "en" ? "Follow Us" : "Síguenos"}
            </h3>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                social.external ? (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-muted hover:bg-primary/20 text-muted-foreground hover:text-primary transition-all duration-300"
                    aria-label={social.label}
                  >
                    <social.icon className="h-5 w-5" />
                  </a>
                ) : (
                  <Link
                    key={social.label}
                    to={social.href}
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-muted hover:bg-primary/20 text-muted-foreground hover:text-primary transition-all duration-300"
                    aria-label={social.label}
                  >
                    <social.icon className="h-5 w-5" />
                  </Link>
                )
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Brashline. {lang === "en" ? "All rights reserved." : "Todos los derechos reservados."}
          </p>

          <div className="flex flex-wrap gap-4 text-sm">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                {link.label[lang]}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';

export default Footer;
