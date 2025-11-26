/**
 * Sign In Page
 * Renders Clerk's SignIn component with custom styling
 */
import { SignIn } from "@clerk/clerk-react";
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function SignInPage() {
  const { lang } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-coral/5">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-16 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 diagonal-pattern opacity-20" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-coral/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-accent-blue/10 rounded-full blur-3xl animate-pulse delay-1000" />
        
        <div className="w-full max-w-md relative z-10">
          <div className="text-center mb-8 space-y-4 animate-fade-in">
            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-coral shadow-coral-glow mb-4">
              <img src="/logo.png" alt="Brashline" className="h-12 w-auto" />
            </div>
            <h1 className="text-4xl font-bold font-heading bg-gradient-to-r from-foreground via-coral to-coral-light bg-clip-text text-transparent">
              {lang === "en" ? "Welcome Back" : "Bienvenido de Nuevo"}
            </h1>
            <p className="text-muted-foreground text-lg">
              {lang === "en"
                ? "Sign in to access your dashboard and services"
                : "Inicia sesión para acceder a tu panel y servicios"}
            </p>
          </div>
          
          <div className="animate-scale-in">
            <SignIn
              routing="path"
              path="/sign-in"
              signUpUrl="/sign-up"
              forceRedirectUrl="/dashboard"
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
