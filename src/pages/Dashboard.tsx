/**
 * User Dashboard - View subscriptions, orders, billing, and profile
 * Protected by Clerk authentication
 */
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn, useUser, useClerk } from "@clerk/clerk-react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Package, ShoppingBag, CreditCard, User, LogOut, AlertCircle, Settings, Loader2 } from "lucide-react";
import { format } from "date-fns";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

interface Order {
  id: string;
  date: string;
  items: Array<{ name: string; price: number }>;
  total: number;
  status: string;
}

function DashboardContent() {
  const { user: clerkUser, isLoaded: isClerkLoaded } = useUser();
  const { signOut } = useClerk();
  const { billingInfo, updateBilling } = useAuth();
  const navigate = useNavigate();
  const { lang } = useLanguage();
  
  const [billingForm, setBillingForm] = useState({
    billingAddress: billingInfo?.billingAddress || "",
    billingCity: billingInfo?.billingCity || "",
    billingState: billingInfo?.billingState || "",
    billingZip: billingInfo?.billingZip || "",
    billingCountry: billingInfo?.billingCountry || "United States",
  });

  // Get orders from localStorage
  const orders: Order[] = JSON.parse(localStorage.getItem("brashline_orders") || "[]");

  const handleBillingUpdate = () => {
    updateBilling(billingForm);
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  // Show loading state
  if (!isClerkLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const content = {
    en: {
      title: "My Dashboard",
      welcome: "Welcome back",
      logout: "Logout",
      subscriptions: "Subscriptions",
      orders: "Orders",
      billing: "Billing",
      profile: "Profile",
      activeSubscriptions: "Active Subscriptions",
      manageSubscriptions: "Manage your active subscription packages",
      noSubscriptions: "No active subscriptions",
      browsePackages: "Browse Packages",
      orderHistory: "Order History",
      viewOrders: "View your past orders and invoices",
      noOrders: "No orders yet",
      startShopping: "Start Shopping",
      billingInfo: "Billing Information",
      manageBilling: "Manage your payment methods and billing address",
      paymentMethod: "Payment Method",
      defaultPayment: "Default payment method",
      addPayment: "Add Payment Method",
      billingAddress: "Billing Address",
      streetAddress: "Street Address",
      city: "City",
      state: "State",
      zipCode: "ZIP Code",
      country: "Country",
      saveBilling: "Save Billing Info",
      profileSettings: "Profile Settings",
      updateInfo: "Update your personal information",
      manageClerk: "Manage Account",
      manageClerkDesc: "Click below to manage your account settings, security, and connected accounts.",
      openAccountSettings: "Open Account Settings",
    },
    es: {
      title: "Mi Panel",
      welcome: "Bienvenido de nuevo",
      logout: "Cerrar Sesión",
      subscriptions: "Suscripciones",
      orders: "Pedidos",
      billing: "Facturación",
      profile: "Perfil",
      activeSubscriptions: "Suscripciones Activas",
      manageSubscriptions: "Gestiona tus paquetes de suscripción activos",
      noSubscriptions: "Sin suscripciones activas",
      browsePackages: "Ver Paquetes",
      orderHistory: "Historial de Pedidos",
      viewOrders: "Ver tus pedidos e facturas anteriores",
      noOrders: "Sin pedidos todavía",
      startShopping: "Empezar a Comprar",
      billingInfo: "Información de Facturación",
      manageBilling: "Gestiona tus métodos de pago y dirección de facturación",
      paymentMethod: "Método de Pago",
      defaultPayment: "Método de pago predeterminado",
      addPayment: "Añadir Método de Pago",
      billingAddress: "Dirección de Facturación",
      streetAddress: "Dirección",
      city: "Ciudad",
      state: "Estado/Provincia",
      zipCode: "Código Postal",
      country: "País",
      saveBilling: "Guardar Facturación",
      profileSettings: "Configuración del Perfil",
      updateInfo: "Actualiza tu información personal",
      manageClerk: "Gestionar Cuenta",
      manageClerkDesc: "Haz clic abajo para gestionar la configuración de tu cuenta, seguridad y cuentas conectadas.",
      openAccountSettings: "Abrir Configuración de Cuenta",
    },
  };

  const t = content[lang];

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold font-heading">{t.title}</h1>
            <p className="text-muted-foreground mt-2">
              {t.welcome}, {clerkUser?.firstName || clerkUser?.primaryEmailAddress?.emailAddress}
            </p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            {t.logout}
          </Button>
        </div>

        <Tabs defaultValue="subscriptions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="subscriptions">
              <Package className="h-4 w-4 mr-2 hidden sm:inline" />
              {t.subscriptions}
            </TabsTrigger>
            <TabsTrigger value="orders">
              <ShoppingBag className="h-4 w-4 mr-2 hidden sm:inline" />
              {t.orders}
            </TabsTrigger>
            <TabsTrigger value="billing">
              <CreditCard className="h-4 w-4 mr-2 hidden sm:inline" />
              {t.billing}
            </TabsTrigger>
            <TabsTrigger value="profile">
              <User className="h-4 w-4 mr-2 hidden sm:inline" />
              {t.profile}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="subscriptions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t.activeSubscriptions}</CardTitle>
                <CardDescription>{t.manageSubscriptions}</CardDescription>
              </CardHeader>
              <CardContent>
                {orders.filter((o) => o.status === "active").length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">{t.noSubscriptions}</p>
                    <Button className="mt-4" onClick={() => navigate("/pricing")}>
                      {t.browsePackages}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders
                      .filter((o) => o.status === "active")
                      .map((order) => (
                        <Card key={order.id}>
                          <CardContent className="pt-6">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between items-center mb-2">
                                <div>
                                  <h4 className="font-semibold">{item.name}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    Started {format(new Date(order.date), "MMM d, yyyy")}
                                  </p>
                                </div>
                                <p className="font-bold">${item.price}/mo</p>
                              </div>
                            ))}
                            <Separator className="my-4" />
                            <div className="flex justify-between items-center">
                              <Button variant="outline" size="sm">
                                Manage
                              </Button>
                              <Button variant="ghost" size="sm" className="text-destructive">
                                Cancel
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t.orderHistory}</CardTitle>
                <CardDescription>{t.viewOrders}</CardDescription>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">{t.noOrders}</p>
                    <Button className="mt-4" onClick={() => navigate("/pricing")}>
                      {t.startShopping}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <Card key={order.id}>
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <p className="font-semibold">Order #{order.id.slice(0, 8)}</p>
                              <p className="text-sm text-muted-foreground">
                                {format(new Date(order.date), "MMM d, yyyy")}
                              </p>
                            </div>
                            <span
                              className={`text-xs px-2 py-1 rounded ${
                                order.status === "active"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                  : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                              }`}
                            >
                              {order.status}
                            </span>
                          </div>
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between mb-2">
                              <span className="text-sm">{item.name}</span>
                              <span className="text-sm font-medium">${item.price}</span>
                            </div>
                          ))}
                          <Separator className="my-3" />
                          <div className="flex justify-between font-bold">
                            <span>Total</span>
                            <span>${order.total}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t.billingInfo}</CardTitle>
                <CardDescription>{t.manageBilling}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-4">{t.paymentMethod}</h3>
                  {billingInfo?.cardLast4 ? (
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <CreditCard className="h-8 w-8" />
                            <div>
                              <p className="font-medium">
                                {billingInfo.cardBrand} •••• {billingInfo.cardLast4}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {t.defaultPayment}
                              </p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            Update
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Button>{t.addPayment}</Button>
                  )}
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-4">{t.billingAddress}</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="address">{t.streetAddress}</Label>
                      <Input
                        id="address"
                        value={billingForm.billingAddress}
                        onChange={(e) =>
                          setBillingForm({ ...billingForm, billingAddress: e.target.value })
                        }
                        placeholder="123 Main St"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">{t.city}</Label>
                        <Input
                          id="city"
                          value={billingForm.billingCity}
                          onChange={(e) =>
                            setBillingForm({ ...billingForm, billingCity: e.target.value })
                          }
                          placeholder="New York"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">{t.state}</Label>
                        <Input
                          id="state"
                          value={billingForm.billingState}
                          onChange={(e) =>
                            setBillingForm({ ...billingForm, billingState: e.target.value })
                          }
                          placeholder="NY"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="zip">{t.zipCode}</Label>
                        <Input
                          id="zip"
                          value={billingForm.billingZip}
                          onChange={(e) =>
                            setBillingForm({ ...billingForm, billingZip: e.target.value })
                          }
                          placeholder="10001"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country">{t.country}</Label>
                        <Input
                          id="country"
                          value={billingForm.billingCountry}
                          onChange={(e) =>
                            setBillingForm({ ...billingForm, billingCountry: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <Button onClick={handleBillingUpdate}>{t.saveBilling}</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t.profileSettings}</CardTitle>
                <CardDescription>{t.updateInfo}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* User Info from Clerk */}
                <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                  <img 
                    src={clerkUser?.imageUrl} 
                    alt="Profile" 
                    className="w-16 h-16 rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold text-lg">
                      {clerkUser?.fullName || clerkUser?.primaryEmailAddress?.emailAddress}
                    </h3>
                    <p className="text-muted-foreground">
                      {clerkUser?.primaryEmailAddress?.emailAddress}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">{t.manageClerk}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {t.manageClerkDesc}
                  </p>
                  <Link to="/profile">
                    <Button>
                      <Settings className="h-4 w-4 mr-2" />
                      {t.openAccountSettings}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <>
      <SignedIn>
        <div className="min-h-screen flex flex-col bg-background">
          <Header />
          <DashboardContent />
          <Footer />
        </div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
