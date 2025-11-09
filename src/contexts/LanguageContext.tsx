import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "en" | "es";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Language>(() => {
    // Initialize from localStorage or default to "en"
    const stored = localStorage.getItem("brashline-language");
    return (stored === "en" || stored === "es") ? stored : "en";
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("brashline-language", newLang);
  };

  useEffect(() => {
    // Persist language changes to localStorage
    localStorage.setItem("brashline-language", lang);
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
