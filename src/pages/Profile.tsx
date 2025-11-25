/**
 * Profile Page
 * User profile management with Clerk's UserProfile component
 */
import { SignedIn, SignedOut, RedirectToSignIn, UserProfile } from "@clerk/clerk-react";
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function ProfilePage() {
  const { lang } = useLanguage();

  return (
    <>
      <SignedIn>
        <div className="min-h-screen flex flex-col bg-background">
          <Header />
          <main className="flex-1 container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <h1 className="text-4xl font-bold font-heading text-foreground mb-2">
                  {lang === "en" ? "Your Profile" : "Tu Perfil"}
                </h1>
                <p className="text-muted-foreground">
                  {lang === "en"
                    ? "Manage your account settings and preferences"
                    : "Administra la configuración y preferencias de tu cuenta"}
                </p>
              </div>
              <UserProfile
                routing="path"
                path="/profile"
              />
            </div>
          </main>
          <Footer />
        </div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
