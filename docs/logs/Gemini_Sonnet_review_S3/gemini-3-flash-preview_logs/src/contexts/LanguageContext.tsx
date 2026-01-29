import { createContext, useContext, useState, ReactNode } from 'react';
import en from '../i18n/en';
import de from '../i18n/de';

type Language = 'en' | 'de';
const translations = { en, de };

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  formatDate: (isoString: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLang] = useState<Language>(() => (localStorage.getItem('lumen.lang') as Language) || 'en');

  const setLanguage = (lang: Language) => {
    setLang(lang);
    localStorage.setItem('lumen.lang', lang);
  };

  const t = (key: string) => {
    const keys = key.split('.');
    let value: any = translations[language];
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };

  const formatDate = (isoString: string) => {
    return new Intl.DateTimeFormat(language === 'en' ? 'en-US' : 'de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(isoString));
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, formatDate }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};

export default LanguageProvider;