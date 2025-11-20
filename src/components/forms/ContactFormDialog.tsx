import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ContactForm } from "./ContactForm";
import { MessageSquare } from "lucide-react";
import { analytics } from "@/lib/analytics";

interface ContactFormDialogProps {
  lang: "en" | "es";
  trigger?: React.ReactNode;
}

export const ContactFormDialog = ({ lang, trigger }: ContactFormDialogProps) => {
  const [open, setOpen] = useState(false);

  const content = {
    en: {
      title: "Get in Touch",
      description: "Fill out the form below and we'll get back to you within 1 hour.",
      triggerText: "Contact Us",
    },
    es: {
      title: "Contáctanos",
      description: "Completa el formulario a continuación y te responderemos en 1 hora.",
      triggerText: "Contáctanos",
    },
  };

  const t = content[lang];

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (isOpen) {
          analytics.trackCTA(t.triggerText, "Contact Dialog");
        }
      }}
    >
      <DialogTrigger asChild>
        {trigger || (
          <Button size="lg" className="gap-2">
            <MessageSquare className="w-5 h-5" />
            {t.triggerText}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t.title}</DialogTitle>
          <DialogDescription>{t.description}</DialogDescription>
        </DialogHeader>
        <ContactForm lang={lang} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};
