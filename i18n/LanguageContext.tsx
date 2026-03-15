import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Language, Translations, translationMap, LANGUAGES, LanguageInfo } from "./translations";

const LANGUAGE_KEY = "tek_tus_language";

interface LanguageContextType {
  language: Language;
  t: Translations;
  setLanguage: (lang: Language) => void;
  languages: LanguageInfo[];
  isReady: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  t: translationMap.en,
  setLanguage: () => {},
  languages: LANGUAGES,
  isReady: false,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLang] = useState<Language>("en");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(LANGUAGE_KEY)
      .then((val) => {
        if (val && val in translationMap) {
          setLang(val as Language);
        }
      })
      .catch(() => {})
      .finally(() => setIsReady(true));
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLang(lang);
    AsyncStorage.setItem(LANGUAGE_KEY, lang).catch(() => {});
  }, []);

  const t = translationMap[language];

  return (
    <LanguageContext.Provider
      value={{ language, t, setLanguage, languages: LANGUAGES, isReady }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export function useT() {
  return useContext(LanguageContext).t;
}
