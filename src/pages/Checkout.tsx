/**
 * Checkout Page - Collect billing information (UI only, no processing)
 */
import { useState } from "react";
import { Link } from "react-router-dom";
import { RootLayout } from "@/components/layout/RootLayout";
import SEOHead from "@/components/SEO/SEOHead";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ContactFormDialog } from "@/components/forms/ContactFormDialog";

const Checkout = () => {
  const { lang } = useLanguage();
  const { cart } = useCart();
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    company: "",
    phone: "",
  });

  const content = {
    en: {
      title: "Checkout",
      orderSummary: "Order Summary",
      items: "items",
      total: "Total",
      billingInfo: "Billing Information",
      email: "Email Address",
      fullName: "Full Name",
      company: "Company Name",
      phone: "Phone Number",
      backendRequired: "Backend Integration Required",
      backendMessage:
        "To complete your purchase, we need to set up authentication and payment processing. Please contact us to proceed with your order.",
      contactUs: "Contact Us to Complete Order",
      backToCart: "Back to Cart",
    },
    es: {
      title: "Pago",
      orderSummary: "Resumen del Pedido",
      items: "artículos",
      total: "Total",
      billingInfo: "Información de Facturación",
      email: "Correo Electrónico",
      fullName: "Nombre Completo",
      company: "Nombre de la Empresa",
      phone: "Número de Teléfono",
      backendRequired: "Se Requiere Integración Backend",
      backendMessage:
        "Para completar tu compra, necesitamos configurar autenticación y procesamiento de pagos. Por favor contáctanos para proceder con tu pedido.",
      contactUs: "Contáctanos para Completar Pedido",
      backToCart: "Volver al Carrito",
    },
  };

  const t = content[lang];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <RootLayout>
      <SEOHead
        pageSEO={{
          title: t.title,
          description: "Complete your order",
          keywords: "checkout, billing, payment, brashline",
          ogImage: "/images/og-contact.jpg",
        }}
        lang={lang}
      />

      <main id="main-content" className="min-h-screen py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-8 text-center">
            {t.title}
          </h1>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Order Summary */}
            <Card className="shadow-soft h-fit">
              <CardHeader>
                <h2 className="text-2xl font-heading font-bold">{t.orderSummary}</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-start gap-4 pb-4 border-b"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{item.name}</span>
                        {item.quantity > 1 && (
                          <Badge variant="secondary" className="text-xs">
                            x{item.quantity}
                          </Badge>
                        )}
                      </div>
                      {item.tier && (
                        <div className="text-xs text-muted-foreground">{item.tier}</div>
                      )}
                    </div>
                    <div className="text-right font-semibold">${item.price * item.quantity}</div>
                  </div>
                ))}
                <div className="flex justify-between items-center text-xs text-muted-foreground pt-2">
                  <span>
                    {cart.itemCount} {t.items}
                  </span>
                </div>
                <div className="flex justify-between items-center text-2xl font-heading font-bold pt-4 border-t">
                  <span>{t.total}</span>
                  <span>${cart.total}</span>
                </div>
              </CardContent>
            </Card>

            {/* Billing Form */}
            <div className="space-y-6">
              <Card className="shadow-soft">
                <CardHeader>
                  <h2 className="text-2xl font-heading font-bold">{t.billingInfo}</h2>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="email">{t.email}</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="name">{t.fullName}</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="company">{t.company}</Label>
                    <Input
                      id="company"
                      name="company"
                      type="text"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Your Company Inc."
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">{t.phone}</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 123-4567"
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-3">
                    <div>
                      <strong>{t.backendRequired}</strong>
                    </div>
                    <p className="text-sm">{t.backendMessage}</p>
                  </div>
                </AlertDescription>
              </Alert>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="outline" asChild className="flex-1">
                  <Link to="/cart">{t.backToCart}</Link>
                </Button>
                <ContactFormDialog
                  lang={lang}
                  trigger={
                    <Button size="lg" className="flex-1">
                      {t.contactUs}
                    </Button>
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </RootLayout>
  );
};

export default Checkout;
