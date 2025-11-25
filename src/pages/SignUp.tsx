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
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold font-heading text-foreground mb-2">
              {lang === "en" ? "Create Your Account" : "Crea Tu Cuenta"}
            </h1>
            <p className="text-muted-foreground">
              {lang === "en"
                ? "Join Brashline to start growing your social presence"
                : "Únete a Brashline para empezar a crecer tu presencia social"}
            </p>
          </div>
          <SignUp
            routing="path"
            path="/sign-up"
            signInUrl="/sign-in"
            forceRedirectUrl="/dashboard"
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
