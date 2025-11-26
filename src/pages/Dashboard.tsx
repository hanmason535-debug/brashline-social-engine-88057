/**
 * User Dashboard Page
 * Beautiful dashboard for authenticated users to view their activity and account information
 */
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Mail,
  Package,
  ShoppingCart,
  User,
  Sparkles,
  TrendingUp,
  Award,
  Heart,
} from "lucide-react";
import { format } from "date-fns";
import { AuthLoadingPage } from "@/components/auth/AuthLoading";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const { lang } = useLanguage();
  const cartContext = useCart();
  const items = cartContext.cart.items;
  const navigate = useNavigate();

  if (!isLoaded) {
    return <AuthLoadingPage />;
  }

  if (!user) {
    navigate("/sign-in");
    return null;
  }

  const content = {
    en: {
      title: "Welcome back",
      subtitle: "Here's what's happening with your account",
      stats: {
        cart: "Cart Items",
        joined: "Member Since",
        status: "Account Status",
        engagement: "Engagement Score",
      },
      sections: {
        activity: "Recent Activity",
        quickActions: "Quick Actions",
      },
      actions: {
        viewProfile: "View Profile",
        browseServices: "Browse Services",
        viewCart: "View Cart",
        contactUs: "Contact Us",
      },
      emptyState: {
        title: "Start Your Journey",
        description: "Explore our services and add items to your cart to get started!",
        cta: "Browse Services",
      },
      accountStatus: {
        active: "Active",
        premium: "Premium",
        verified: "Verified",
      },
    },
    es: {
      title: "Bienvenido de nuevo",
      subtitle: "Esto es lo que está pasando con tu cuenta",
      stats: {
        cart: "Artículos en el Carrito",
        joined: "Miembro Desde",
        status: "Estado de la Cuenta",
        engagement: "Puntuación de Engagement",
      },
      sections: {
        activity: "Actividad Reciente",
        quickActions: "Acciones Rápidas",
      },
      actions: {
        viewProfile: "Ver Perfil",
        browseServices: "Explorar Servicios",
        viewCart: "Ver Carrito",
        contactUs: "Contáctanos",
      },
      emptyState: {
        title: "Comienza tu Viaje",
        description: "¡Explora nuestros servicios y agrega artículos a tu carrito para comenzar!",
        cta: "Explorar Servicios",
      },
      accountStatus: {
        active: "Activo",
        premium: "Premium",
        verified: "Verificado",
      },
    },
  };

  const t = content[lang];
  const joinedDate = user.createdAt ? format(new Date(user.createdAt), "MMMM yyyy") : "Recently";
  const initials = `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() || "U";

  const quickActions = [
    {
      icon: User,
      label: t.actions.viewProfile,
      description: "Manage your profile settings",
      href: "/profile",
      gradient: "from-coral to-coral-light",
    },
    {
      icon: Package,
      label: t.actions.browseServices,
      description: "Explore our service packages",
      href: "/services",
      gradient: "from-accent-purple to-accent-blue",
    },
    {
      icon: ShoppingCart,
      label: t.actions.viewCart,
      description: `${items.length} item${items.length !== 1 ? "s" : ""} in cart`,
      href: "/cart",
      gradient: "from-accent-success to-accent-blue",
      badge: items.length > 0 ? items.length : null,
    },
    {
      icon: Mail,
      label: t.actions.contactUs,
      description: "Get in touch with our team",
      href: "/contact",
      gradient: "from-coral-dark to-accent-warning",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-accent-blue/5">
      <Header />
      
      <main id="main-content" className="flex-1 container mx-auto px-4 py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto space-y-8"
        >
          {/* Hero Section */}
          <motion.div variants={itemVariants} className="relative overflow-hidden">
            <div className="absolute inset-0 diagonal-pattern opacity-30" />
            <Card className="relative border-2 border-coral/20 bg-gradient-to-br from-background to-coral/5 shadow-glow">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  <Avatar className="h-24 w-24 ring-4 ring-coral/20 ring-offset-4 ring-offset-background">
                    <AvatarImage src={user.imageUrl} alt={user.fullName || "User"} />
                    <AvatarFallback className="bg-gradient-coral text-white text-2xl font-bold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h1 className="text-4xl font-bold font-heading bg-gradient-to-r from-foreground via-coral to-coral-light bg-clip-text text-transparent">
                        {t.title}, {user.firstName || "Friend"}!
                      </h1>
                      <Badge variant="secondary" className="bg-coral/10 text-coral border-coral/20">
                        <Sparkles className="w-3 h-3 mr-1" />
                        {t.accountStatus.active}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-lg">{t.subtitle}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="w-4 h-4" />
                      {user.primaryEmailAddress?.emailAddress}
                    </div>
                  </div>

                  <Button
                    onClick={() => navigate("/profile")}
                    size="lg"
                    className="bg-gradient-coral text-white hover:opacity-90 shadow-coral-glow"
                  >
                    <User className="w-4 h-4 mr-2" />
                    {t.actions.viewProfile}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            <Card className="border-coral/20 hover:shadow-coral-glow transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {t.stats.cart}
                  </CardTitle>
                  <ShoppingCart className="w-4 h-4 text-coral" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold bg-gradient-coral bg-clip-text text-transparent">
                  {items.length}
                </div>
              </CardContent>
            </Card>

            <Card className="border-accent-blue/20 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {t.stats.joined}
                  </CardTitle>
                  <Calendar className="w-4 h-4 text-accent-blue" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{joinedDate}</div>
              </CardContent>
            </Card>

            <Card className="border-accent-success/20 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {t.stats.status}
                  </CardTitle>
                  <Award className="w-4 h-4 text-accent-success" />
                </div>
              </CardHeader>
              <CardContent>
                <Badge className="bg-accent-success/10 text-accent-success border-accent-success/20 text-lg px-3 py-1">
                  {t.accountStatus.verified}
                </Badge>
              </CardContent>
            </Card>

            <Card className="border-accent-purple/20 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {t.stats.engagement}
                  </CardTitle>
                  <TrendingUp className="w-4 h-4 text-accent-purple" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">100%</div>
                <p className="text-xs text-muted-foreground mt-1">Outstanding!</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-heading flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-coral" />
                  {t.sections.quickActions}
                </CardTitle>
                <CardDescription>Explore what you can do with your account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {quickActions.map((action, index) => (
                    <motion.div
                      key={action.label}
                      variants={itemVariants}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate(action.href)}
                      className="relative group cursor-pointer"
                    >
                      <Card className="border-2 border-border hover:border-coral transition-all duration-300 overflow-hidden h-full">
                        <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                        <CardContent className="p-6 relative">
                          <div className="flex items-start gap-4">
                            <div className={`p-3 rounded-xl bg-gradient-to-br ${action.gradient} shadow-lg`}>
                              <action.icon className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-foreground group-hover:text-coral transition-colors">
                                  {action.label}
                                </h3>
                                {action.badge && (
                                  <Badge className="bg-coral text-white">{action.badge}</Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                {action.description}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Empty State / Activity Section */}
          {items.length === 0 ? (
            <motion.div variants={itemVariants}>
              <Card className="border-dashed border-2 border-coral/30 bg-coral/5">
                <CardContent className="py-16 text-center">
                  <div className="max-w-md mx-auto space-y-6">
                    <div className="flex justify-center">
                      <div className="relative">
                        <div className="absolute inset-0 animate-ping opacity-20">
                          <Heart className="w-16 h-16 text-coral" />
                        </div>
                        <Heart className="w-16 h-16 text-coral relative" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold font-heading text-foreground">
                        {t.emptyState.title}
                      </h3>
                      <p className="text-muted-foreground">{t.emptyState.description}</p>
                    </div>
                    <Button
                      size="lg"
                      onClick={() => navigate("/services")}
                      className="bg-gradient-coral text-white hover:opacity-90 shadow-coral-glow"
                    >
                      <Package className="w-4 h-4 mr-2" />
                      {t.emptyState.cta}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : null}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
