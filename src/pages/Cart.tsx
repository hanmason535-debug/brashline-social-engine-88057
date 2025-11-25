/**
 * Cart Page - View and manage cart items
 */
import { Link } from "react-router-dom";
import { RootLayout } from "@/components/layout/RootLayout";
import SEOHead from "@/components/SEO/SEOHead";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus, X, ShoppingBag } from "lucide-react";

const Cart = () => {
  const { lang } = useLanguage();
  const { cart, removeFromCart, updateQuantity } = useCart();

  const content = {
    en: {
      title: "Your Cart",
      emptyCart: "Your cart is empty",
      emptyDescription: "Add packages to get started with your digital transformation.",
      browsePlans: "Browse Plans",
      remove: "Remove",
      subtotal: "Subtotal",
      total: "Total",
      checkout: "Proceed to Checkout",
      continueShopping: "Continue Shopping",
      oneTime: "one-time",
      monthly: "/month",
    },
    es: {
      title: "Tu Carrito",
      emptyCart: "Tu carrito está vacío",
      emptyDescription: "Agrega paquetes para comenzar con tu transformación digital.",
      browsePlans: "Ver Planes",
      remove: "Eliminar",
      subtotal: "Subtotal",
      total: "Total",
      checkout: "Proceder al Pago",
      continueShopping: "Seguir Comprando",
      oneTime: "pago único",
      monthly: "/mes",
    },
  };

  const t = content[lang];

  return (
    <RootLayout>
      <SEOHead
        pageSEO={{
          title: t.title,
          description: t.emptyDescription,
          keywords: "cart, checkout, pricing, brashline",
          ogImage: "/images/og-pricing.jpg",
        }}
        lang={lang}
      />

      <main id="main-content" className="min-h-screen py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 max-w-5xl">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-8 text-center">
            {t.title}
          </h1>

          {cart.items.length === 0 ? (
            <Card className="max-w-2xl mx-auto text-center py-12">
              <CardContent className="space-y-6">
                <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground" />
                <div>
                  <h2 className="text-2xl font-heading font-bold mb-2">{t.emptyCart}</h2>
                  <p className="text-muted-foreground">{t.emptyDescription}</p>
                </div>
                <Button asChild size="lg">
                  <Link to="/pricing">{t.browsePlans}</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-8">
              {/* Cart Items */}
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <Card key={item.id} className="shadow-soft">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-heading font-bold">{item.name}</h3>
                            {item.tier && (
                              <Badge variant="secondary" className="text-xs">
                                {item.tier}
                              </Badge>
                            )}
                          </div>
                          {item.summary && (
                            <p className="text-sm text-muted-foreground mb-3">{item.summary}</p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                          aria-label={`${t.remove} ${item.name}`}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>

                    <CardContent className="pb-4">
                      <div className="grid md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                        {item.features.slice(0, 4).map((feature, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <span className="text-primary">•</span>
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>

                    <CardFooter className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="text-lg font-semibold w-8 text-center">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-heading font-bold">
                          ${item.price * item.quantity}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          ${item.price} {item.type === "one-time" ? t.oneTime : t.monthly}
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              {/* Cart Summary */}
              <Card className="shadow-glow border-primary">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex justify-between text-lg">
                      <span className="text-muted-foreground">{t.subtotal}</span>
                      <span className="font-semibold">${cart.total}</span>
                    </div>
                    <div className="flex justify-between text-2xl font-heading font-bold border-t pt-4">
                      <span>{t.total}</span>
                      <span>${cart.total}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row gap-4">
                  <Button variant="outline" asChild className="flex-1">
                    <Link to="/pricing">{t.continueShopping}</Link>
                  </Button>
                  <Button asChild size="lg" className="flex-1">
                    <Link to="/checkout">{t.checkout}</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </div>
      </main>
    </RootLayout>
  );
};

export default Cart;
