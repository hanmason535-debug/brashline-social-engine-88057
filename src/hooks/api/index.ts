// API Hooks barrel export
export { 
  useContactForm, 
  useContactForm as useSubmitContact, // Alias for ContactForm.tsx compatibility
  useContactSubmissions, 
  useUpdateContactStatus, 
  useApiSetup 
} from "./useContactForm";
export { useNewsletterSubscribe, useNewsletterUnsubscribe } from "./useNewsletter";
export { useUserProfile, useUpdatePreferences } from "./useUserProfile";
