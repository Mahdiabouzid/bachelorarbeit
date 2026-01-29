import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Theme, Accent, Language } from '../types';

interface AppContextType {
  theme: Theme;
  accent: Accent;
  language: Language;
  isOffline: boolean;
  setTheme: (theme: Theme) => void;
  setAccent: (accent: Accent) => void;
  setLanguage: (lang: Language) => void;
  setIsOffline: (isOffline: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  THEME: 'lumen.theme',
  ACCENT: 'lumen.accent',
  LANG: 'lumen.lang',
};

export const AppContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize state from localStorage or defaults
  const [theme, setTheme] = useState<Theme>(() => 
    (localStorage.getItem(STORAGE_KEYS.THEME) as Theme) || 'light'
  );
  const [accent, setAccent] = useState<Accent>(() => 
    (localStorage.getItem(STORAGE_KEYS.ACCENT) as Accent) || 'ocean'
  );
  const [language, setLanguage] = useState<Language>(() => 
    (localStorage.getItem(STORAGE_KEYS.LANG) as Language) || 'en'
  );
  const [isOffline, setIsOffline] = useState<boolean>(false);

  // Persist and apply Theme
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(theme);
  }, [theme]);

  // Persist and apply Accent
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACCENT, accent);
    document.body.dataset.accent = accent;
  }, [accent]);

  // Persist and apply Language
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LANG, language);
    document.documentElement.lang = language;
  }, [language]);

  const value = {
    theme,
    accent,
    language,
    isOffline,
    setTheme,
    setAccent,
    setLanguage,
    setIsOffline,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
};

export default AppContext;