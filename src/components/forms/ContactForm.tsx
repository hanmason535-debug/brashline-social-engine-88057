import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { analytics } from "@/lib/analytics";
import { useContactForm } from "@/hooks/api";

const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(100, { message: "Name must be less than 100 characters" }),
  email: z
    .string()
    .trim()
    .email({ message: "Invalid email address" })
    .max(255, { message: "Email must be less than 255 characters" }),
  phone: z
    .string()
    .trim()
    .min(10, { message: "Phone must be at least 10 digits" })
    .max(20, { message: "Phone must be less than 20 characters" })
    .optional()
    .or(z.literal("")),
  serviceType: z.string().min(1, { message: "Please select a service type" }),
  message: z
    .string()
    .trim()
    .min(10, { message: "Message must be at least 10 characters" })
    .max(1000, { message: "Message must be less than 1000 characters" }),
  honeypot: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface ContactFormProps {
  lang: "en" | "es";
  onSuccess?: () => void;
}

export const ContactForm = ({ lang, onSuccess }: ContactFormProps) => {
  const { toast } = useToast();
  const { user, isSignedIn } = useUser();
  const submitContactMutation = useContactForm();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      serviceType: "",
      message: "",
    },
  });

  // Pre-fill form with user data if authenticated
  useEffect(() => {
    if (isSignedIn && user) {
      const fullName = user.fullName || `${user.firstName || ""} ${user.lastName || ""}`.trim();
      const email = user.primaryEmailAddress?.emailAddress || "";

      if (fullName) {
        setValue("name", fullName);
      }
      if (email) {
        setValue("email", email);
      }
    }
  }, [isSignedIn, user, setValue]);

  const serviceType = watch("serviceType");

  const isSubmitting = submitContactMutation.isPending;

  const onSubmit = async (data: ContactFormData) => {
    // Bot protection: reject if honeypot field is filled
    if (data.honeypot) {
      console.warn("Bot submission detected");
      return;
    }

    analytics.trackContactFormStart();

    try {
      // Combine service type and message for API (API only accepts name, email, company, message)
      const fullMessage = `Service Type: ${data.serviceType}\n\n${data.message}`;
      const phoneInfo = data.phone ? `Phone: ${data.phone}` : undefined;

      // Save to database via API
      await submitContactMutation.mutateAsync({
        name: data.name,
        email: data.email,
        company: phoneInfo,
        message: fullMessage,
      });

      // Construct WhatsApp message with proper encoding
      const whatsappMessage = encodeURIComponent(
        `New Contact Form Submission:\n\n` +
        `Name: ${data.name}\n` +
        `Email: ${data.email}\n` +
        `Phone: ${data.phone || "Not provided"}\n` +
        `Service: ${data.serviceType}\n` +
        `Message: ${data.message}`
      );

      // Open WhatsApp with pre-filled message
      window.open(
        `https://api.whatsapp.com/send/?phone=19294468440&text=${whatsappMessage}&type=phone_number&app_absent=0`,
        "_blank",
        "noopener,noreferrer"
      );

      analytics.trackContactFormSubmit(data.serviceType);

      toast({
        title: lang === "en" ? "Message sent!" : "¡Mensaje enviado!",
        description:
          lang === "en" ? "We'll get back to you within 1 hour." : "Te responderemos en 1 hora.",
      });

      reset();
      onSuccess?.();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      analytics.trackContactFormError(errorMessage);

      toast({
        title: lang === "en" ? "Error" : "Error",
        description:
          lang === "en"
            ? "Failed to send message. Please try again."
            : "Error al enviar el mensaje. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      });
    }
  };

  const content = {
    en: {
      name: "Full Name",
      email: "Email Address",
      phone: "Phone Number (Optional)",
      serviceType: "Service Type",
      message: "Your Message",
      submit: "Send Message",
      sending: "Sending...",
      selectService: "Select a service",
      services: {
        social: "Social Media Management",
        content: "Content Creation",
        ads: "Paid Advertising",
        consulting: "Strategy Consulting",
        other: "Other",
      },
    },
    es: {
      name: "Nombre Completo",
      email: "Correo Electrónico",
      phone: "Número de Teléfono (Opcional)",
      serviceType: "Tipo de Servicio",
      message: "Tu Mensaje",
      submit: "Enviar Mensaje",
      sending: "Enviando...",
      selectService: "Selecciona un servicio",
      services: {
        social: "Gestión de Redes Sociales",
        content: "Creación de Contenido",
        ads: "Publicidad Pagada",
        consulting: "Consultoría Estratégica",
        other: "Otro",
      },
    },
  };

  const t = content[lang];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="hidden">
        <Label htmlFor="honeypot">Honeypot</Label>
        <Input id="honeypot" {...register("honeypot")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="name">{t.name}</Label>
        <Input
          id="name"
          {...register("name")}
          className={errors.name ? "border-destructive" : ""}
          placeholder={t.name}
        />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">{t.email}</Label>
        <Input
          id="email"
          type="email"
          {...register("email")}
          className={errors.email ? "border-destructive" : ""}
          placeholder={t.email}
        />
        {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">{t.phone}</Label>
        <Input
          id="phone"
          type="tel"
          {...register("phone")}
          className={errors.phone ? "border-destructive" : ""}
          placeholder={t.phone}
        />
        {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="serviceType">{t.serviceType}</Label>
        <Select value={serviceType} onValueChange={(value) => setValue("serviceType", value)}>
          <SelectTrigger
            id="serviceType"
            aria-label={t.serviceType}
            className={errors.serviceType ? "border-destructive" : ""}
          >
            <SelectValue placeholder={t.selectService} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="social">{t.services.social}</SelectItem>
            <SelectItem value="content">{t.services.content}</SelectItem>
            <SelectItem value="ads">{t.services.ads}</SelectItem>
            <SelectItem value="consulting">{t.services.consulting}</SelectItem>
            <SelectItem value="other">{t.services.other}</SelectItem>
          </SelectContent>
        </Select>
        {errors.serviceType && (
          <p className="text-sm text-destructive">{errors.serviceType.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">{t.message}</Label>
        <Textarea
          id="message"
          {...register("message")}
          className={errors.message ? "border-destructive" : ""}
          placeholder={t.message}
          rows={5}
        />
        {errors.message && <p className="text-sm text-destructive">{errors.message.message}</p>}
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t.sending}
          </>
        ) : (
          t.submit
        )}
      </Button>
    </form>
  );
};
