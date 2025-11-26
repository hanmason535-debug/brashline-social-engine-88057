// API Hooks barrel export
export { useContactForm, useContactSubmissions, useUpdateContactStatus, useApiSetup } from "./useContactForm";
export { useNewsletterSubscribe, useNewsletterUnsubscribe } from "./useNewsletter";
export { useUserProfile, useUpdatePreferences } from "./useUserProfile";

// Alias for backward compatibility
export { useContactForm as useSubmitContact } from "./useContactForm";
