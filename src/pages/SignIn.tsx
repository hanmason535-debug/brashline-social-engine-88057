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
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold font-heading text-foreground mb-2">
              {lang === "en" ? "Welcome Back" : "Bienvenido de Nuevo"}
            </h1>
            <p className="text-muted-foreground">
              {lang === "en"
                ? "Sign in to access your dashboard and services"
                : "Inicia sesión para acceder a tu panel y servicios"}
            </p>
          </div>
          <SignIn
            routing="path"
            path="/sign-in"
            signUpUrl="/sign-up"
            forceRedirectUrl="/dashboard"
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
