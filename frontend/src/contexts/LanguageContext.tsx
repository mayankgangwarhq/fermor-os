import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type { Language, LanguageMeta } from '../types';
import { translate, getLanguageMeta, isRTL, getDirection, SUPPORTED_LANGUAGES } from '../i18n';
import { translations } from '../i18n/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
  dir: 'ltr' | 'rtl';
  isRtl: boolean;
  currentMeta: LanguageMeta;
  supportedLanguages: LanguageMeta[];
  isLanguageModalOpen: boolean;
  openLanguageModal: () => void;
  closeLanguageModal: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('agrinext_language') || localStorage.getItem('agrinext_lang');
    return (saved as Language) || 'en';
  });

  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);

  const applyDocumentSettings = (lang: Language) => {
    const direction = getDirection(lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = direction;
    if (direction === 'rtl') {
      document.documentElement.classList.add('rtl');
      document.body.classList.add('rtl');
    } else {
      document.documentElement.classList.remove('rtl');
      document.body.classList.remove('rtl');
    }
  };

  useEffect(() => {
    applyDocumentSettings(language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('agrinext_language', lang);
    localStorage.setItem('agrinext_lang', lang);
    applyDocumentSettings(lang);
  };

  const openLanguageModal = () => setIsLanguageModalOpen(true);
  const closeLanguageModal = () => setIsLanguageModalOpen(false);

  const t = (key: string, fallback?: string): string => {
    return translate(language, key, fallback);
  };

  const currentMeta = useMemo(() => getLanguageMeta(language), [language]);
  const dir = currentMeta.dir;
  const isRtl = isRTL(language);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        dir,
        isRtl,
        currentMeta,
        supportedLanguages: SUPPORTED_LANGUAGES,
        isLanguageModalOpen,
        openLanguageModal,
        closeLanguageModal,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
