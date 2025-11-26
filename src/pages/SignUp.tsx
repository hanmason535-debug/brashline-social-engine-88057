/**
 * Sign Up Page
 * Renders Clerk's SignUp component with custom styling
 */
import { SignUp } from "@clerk/clerk-react";
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function SignUpPage() {
  const { lang } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-accent-purple/5">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-16 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 diagonal-pattern opacity-20" />
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-accent-purple/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-coral/10 rounded-full blur-3xl animate-pulse delay-1000" />
        
        <div className="w-full max-w-md relative z-10">
          <div className="text-center mb-8 space-y-4 animate-fade-in">
            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-br from-accent-purple to-coral shadow-lg mb-4">
              <img src="/logo.png" alt="Brashline" className="h-12 w-auto" />
            </div>
            <h1 className="text-4xl font-bold font-heading bg-gradient-to-r from-foreground via-accent-purple to-coral bg-clip-text text-transparent">
              {lang === "en" ? "Create Your Account" : "Crea Tu Cuenta"}
            </h1>
            <p className="text-muted-foreground text-lg">
              {lang === "en"
                ? "Join Brashline to start growing your social presence"
                : "Únete a Brashline para empezar a crecer tu presencia social"}
            </p>
          </div>
          
          <div className="animate-scale-in">
            <SignUp
              routing="path"
              path="/sign-up"
              signInUrl="/sign-in"
              forceRedirectUrl="/dashboard"
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
