import React, { createContext, useContext, useState, useEffect } from 'react';
import { en } from '../i18n/en';
import { de } from '../i18n/de';

type Theme = 'light' | 'dark';
type Accent = 'ocean' | 'sunset' | 'forest';
type Lang = 'en' | 'de';

interface AppContextType {
  theme: Theme;
  accent: Accent;
  lang: Lang;
  offline: boolean;
  setTheme: (t: Theme) => void;
  setAccent: (a: Accent) => void;
  setLang: (l: Lang) => void;
  setOffline: (o: boolean) => void;
  t: any;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>((localStorage.getItem('lumen.theme') as Theme) || 'light');
  const [accent, setAccentState] = useState<Accent>((localStorage.getItem('lumen.accent') as Accent) || 'ocean');
  const [lang, setLangState] = useState<Lang>((localStorage.getItem('lumen.lang') as Lang) || 'en');
  const [offline, setOfflineState] = useState<boolean>(localStorage.getItem('lumen.offline') === 'true');

  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem('lumen.theme', t);
  };

  const setAccent = (a: Accent) => {
    setAccentState(a);
    localStorage.setItem('lumen.accent', a);
  };

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem('lumen.lang', l);
  };

  const setOffline = (o: boolean) => {
    setOfflineState(o);
    localStorage.setItem('lumen.offline', String(o));
  };

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);

  const t = lang === 'en' ? en : de;

  return (
    <AppContext.Provider value={{ theme, accent, lang, offline, setTheme, setAccent, setLang, setOffline, t }}>
      <div className={`accent-${accent} min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-white transition-colors duration-300`}>
        {children}
      </div>
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};