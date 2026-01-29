import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark';
type Accent = 'ocean' | 'sunset' | 'forest';

interface ThemeContextType {
  theme: Theme;
  accent: Accent;
  toggleTheme: () => void;
  setAccent: (accent: Accent) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const accentColors = {
  ocean: { primary: '#0ea5e9', secondary: '#38bdf8' },
  sunset: { primary: '#f43f5e', secondary: '#fb7185' },
  forest: { primary: '#10b981', secondary: '#34d399' },
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('lumen.theme') as Theme) || 'light');
  const [accent, setAccentState] = useState<Accent>(() => (localStorage.getItem('lumen.accent') as Accent) || 'ocean');

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('lumen.theme', theme);
  }, [theme]);

  useEffect(() => {
    const root = window.document.documentElement;
    const colors = accentColors[accent];
    root.style.setProperty('--color-accent-primary', colors.primary);
    root.style.setProperty('--color-accent-secondary', colors.secondary);
    localStorage.setItem('lumen.accent', accent);
  }, [accent]);

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  const setAccent = (a: Accent) => setAccentState(a);

  return (
    <ThemeContext.Provider value={{ theme, accent, toggleTheme, setAccent }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};

export default ThemeProvider;