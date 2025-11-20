/**
 * File overview: src/contexts/LanguageContext.tsx
 *
 * React context/provider responsible for shared application state.
 * Behavior:
 * - Owns the shape of the context value and update surface.
 * - Coordinates state changes that span multiple feature areas.
 * Assumptions:
 * - Consumers are mounted beneath this provider in the component tree.
 * Performance:
 * - Be mindful when extending the context value to avoid broad re-renders.
 */
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { STORAGE_KEYS, SUPPORTED_LANGUAGES, type SupportedLanguage } from "@/lib/constants";
import { analytics } from "@/lib/analytics";

type Language = SupportedLanguage;

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Language>(() => {
    // Initialize from localStorage with error handling
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
      return SUPPORTED_LANGUAGES.includes(stored as Language) ? (stored as Language) : "en";
    } catch {
      return "en";
    }
  });

  const setLang = (newLang: Language) => {
    const previousLang = lang;
    setLangState(newLang);
    try {
      localStorage.setItem(STORAGE_KEYS.LANGUAGE, newLang);
      analytics.trackLanguageSwitch(previousLang, newLang);
    } catch (error) {
      console.error("Failed to save language preference:", error);
    }
  };

  useEffect(() => {
    // Persist language changes to localStorage
    try {
      localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
    } catch (error) {
      console.error("Failed to persist language:", error);
    }
  }, [lang]);

  return <LanguageContext.Provider value={{ lang, setLang }}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export { LanguageContext };
