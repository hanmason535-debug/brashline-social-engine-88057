import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail, CheckCircle } from "lucide-react";
import { useNewsletterSubscribe } from "@/hooks/api";

interface NewsletterFormProps {
  lang?: "en" | "es";
  source?: string;
  className?: string;
  compact?: boolean;
}

export const NewsletterForm = ({ 
  lang = "en", 
  source = "website",
  className = "",
  compact = false,
}: NewsletterFormProps) => {
  const { toast } = useToast();
  const { user, isSignedIn } = useUser();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  
  const subscribeMutation = useNewsletterSubscribe();

  // Pre-fill email if user is signed in
  const userEmail = isSignedIn && user?.primaryEmailAddress?.emailAddress;
  const userName = isSignedIn && user?.fullName;

  const content = {
    en: {
      title: "Stay Updated",
      description: "Get the latest marketing tips and insights delivered to your inbox.",
      namePlaceholder: "Your name",
      emailPlaceholder: "Enter your email",
      subscribe: "Subscribe",
      subscribing: "Subscribing...",
      successTitle: "Welcome aboard!",
      successDescription: "You've been successfully subscribed to our newsletter.",
      errorTitle: "Subscription failed",
      errorDescription: "Unable to subscribe. Please try again later.",
      alreadySubscribed: "You're already subscribed!",
      invalidEmail: "Please enter a valid email address",
      subscribed: "You're subscribed!",
      subscribedMessage: "Thanks for joining our newsletter.",
    },
    es: {
      title: "Mantente Actualizado",
      description: "Recibe los últimos consejos de marketing directamente en tu correo.",
      namePlaceholder: "Tu nombre",
      emailPlaceholder: "Ingresa tu correo",
      subscribe: "Suscribirse",
      subscribing: "Suscribiendo...",
      successTitle: "¡Bienvenido!",
      successDescription: "Te has suscrito exitosamente a nuestro boletín.",
      errorTitle: "Error de suscripción",
      errorDescription: "No se pudo suscribir. Por favor, inténtalo más tarde.",
      alreadySubscribed: "¡Ya estás suscrito!",
      invalidEmail: "Por favor ingresa un correo válido",
      subscribed: "¡Estás suscrito!",
      subscribedMessage: "Gracias por unirte a nuestro boletín.",
    },
  };

  const t = content[lang];

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailToSubmit = userEmail || email;
    const nameToSubmit = userName || name;

    if (!validateEmail(emailToSubmit)) {
      toast({
        title: t.errorTitle,
        description: t.invalidEmail,
        variant: "destructive",
      });
      return;
    }

    try {
      await subscribeMutation.mutateAsync({
        email: emailToSubmit,
        name: nameToSubmit || undefined,
        source,
        metadata: {
          lang,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
        },
      });

      setIsSubscribed(true);
      setEmail("");
      setName("");

      toast({
        title: t.successTitle,
        description: t.successDescription,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "";
      
      if (errorMessage.includes("already subscribed")) {
        toast({
          title: t.successTitle,
          description: t.alreadySubscribed,
        });
        setIsSubscribed(true);
      } else {
        toast({
          title: t.errorTitle,
          description: t.errorDescription,
          variant: "destructive",
        });
      }
    }
  };

  const isSubmitting = subscribeMutation.isPending;

  if (isSubscribed) {
    return (
      <div className={`flex items-center gap-2 text-green-600 dark:text-green-400 ${className}`}>
        <CheckCircle className="h-5 w-5" />
        <span className="font-medium">{t.subscribed}</span>
      </div>
    );
  }

  if (compact) {
    return (
      <form onSubmit={handleSubmit} className={`flex gap-2 ${className}`}>
        <div className="relative flex-1">
          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="email"
            value={userEmail || email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.emailPlaceholder}
            className="pl-10"
            disabled={isSubmitting || !!userEmail}
            required
          />
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            t.subscribe
          )}
        </Button>
      </form>
    );
  }

  return (
    <div className={className}>
      <h3 className="text-lg font-semibold mb-2">{t.title}</h3>
      <p className="text-muted-foreground text-sm mb-4">{t.description}</p>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        {!isSignedIn && (
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t.namePlaceholder}
            disabled={isSubmitting}
          />
        )}
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="email"
            value={userEmail || email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.emailPlaceholder}
            className="pl-10"
            disabled={isSubmitting || !!userEmail}
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t.subscribing}
            </>
          ) : (
            t.subscribe
          )}
        </Button>
      </form>
    </div>
  );
};
