### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/App.tsx:
```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ThemeProvider from './contexts/ThemeContext';
import LanguageProvider from './contexts/LanguageContext';
import OfflineProvider from './contexts/OfflineContext';

import Header from './components/Header';
import DevToolbar from './components/DevToolbar';

import HomePage from './pages/HomePage';
import GalleryPage from './pages/GalleryPage';
import UploadPage from './pages/UploadPage';
import AboutPage from './pages/AboutPage';
import SettingsPage from './pages/SettingsPage';

import './App.css';

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <OfflineProvider>
          <BrowserRouter>
            <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
              <Header />
              
              <div className="flex-1">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/gallery" element={<GalleryPage />} />
                  <Route path="/upload" element={<UploadPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Routes>
              </div>

              <DevToolbar />
            </div>
          </BrowserRouter>
        </OfflineProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/main.tsx:
```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <App />
  </StrictMode>
)
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/components/DevToolbar.tsx:
```tsx
import { useOffline } from '../contexts/OfflineContext';
import { useLanguage } from '../contexts/LanguageContext';
import Toggle from './ui/Toggle';

const DevToolbar = () => {
  const { isOffline, setIsOffline } = useOffline();
  const { t } = useLanguage();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900/80 backdrop-blur-sm text-white p-2 flex items-center justify-center gap-6 z-50">
      <Toggle
        label={t('settings.offlineLabel')}
        checked={isOffline}
        onChange={setIsOffline}
        data-testid="offline-toggle"
        aria-label="Offline mode"
      />

      {isOffline && (
        <span className="text-xs font-bold uppercase tracking-wider text-red-400">
          {t('common.offlineEnabled')}
        </span>
      )}
    </div>
  );
};

export default DevToolbar;
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/components/Header.tsx:
```tsx
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import Select from './ui/Select';

const Header = () => {
  const { t, language, setLanguage } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const hamburgerButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  useTheme();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }

      if (e.key === 'Tab' && isMobileMenuOpen && drawerRef.current) {
        const focusableElements = drawerRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
      // Small timeout to ensure the element is visible before focusing
      setTimeout(() => closeButtonRef.current?.focus(), 0);
    } else {
      document.body.style.overflow = 'unset';
      hamburgerButtonRef.current?.focus();
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileMenuOpen]);




  const navItems = [
    { path: '/', label: t('nav.home') },
    { path: '/gallery', label: t('nav.gallery') },
    { path: '/upload', label: t('nav.upload') },
    { path: '/about', label: t('nav.about') },
    { path: '/settings', label: t('nav.settings') },
  ];

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-2xl font-bold text-[var(--color-accent-primary)]">
            Lumen
          </Link>
          <div className="hidden md:flex gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="text-gray-600 dark:text-gray-300 hover:text-[var(--color-accent-primary)] transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Select
            label=""

            aria-label="Language"
            value={language}
            onChange={(e) => setLanguage(e.target.value as 'en' | 'de')}
            options={[
              { value: 'en', label: 'English' },
              { value: 'de', label: 'Deutsch' },
            ]}
            className="w-28"
          />
          <button
            ref={hamburgerButtonRef}
            type="button"
            className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={isMobileMenuOpen}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>

        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu Drawer */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-menu-title"
        className={`fixed top-0 right-0 h-full w-64 bg-white dark:bg-gray-900 z-50 shadow-xl transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <h2 id="mobile-menu-title" className="sr-only">
            Mobile Navigation Menu
          </h2>
          <div className="flex items-center justify-end p-4">
            <button
              ref={closeButtonRef}
              type="button"
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <nav className="flex flex-col gap-4 p-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="text-lg font-medium text-gray-600 dark:text-gray-300 hover:text-[var(--color-accent-primary)] transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};


export default Header;
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/components/GalleryPage/GalleryFilter.tsx:
```tsx
import { useLanguage } from '../../contexts/LanguageContext';

interface GalleryFilterProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const GalleryFilter = ({ activeFilter, onFilterChange }: GalleryFilterProps) => {
  const { t } = useLanguage();

  const filters = [
    { id: 'all', label: t('gallery.tags.all') },
    { id: 'portrait', label: t('gallery.tags.portrait') },
    { id: 'nature', label: t('gallery.tags.nature') },
    { id: 'urban', label: t('gallery.tags.urban') },
  ];

  return (
    <nav className="flex flex-wrap gap-2 mb-8" aria-label={t('gallery.filterLabel')}>
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeFilter === filter.id
              ? 'bg-[var(--color-accent-primary)] text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          {filter.label}
        </button>
      ))}
    </nav>
  );
};

export default GalleryFilter;
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/components/GalleryPage/GalleryGrid.tsx:
```tsx
import { GalleryItem as GalleryItemType } from '../../data/gallery';
import GalleryItem from './GalleryItem';

interface GalleryGridProps {
  items: GalleryItemType[];
}

const GalleryGrid = ({ items }: GalleryGridProps) => {
  return (
    <div 
      data-testid="gallery-grid"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {items.map((item) => (
        <GalleryItem key={item.id} item={item} />
      ))}
    </div>
  );
};

export default GalleryGrid;
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/components/GalleryPage/GalleryItem.tsx:
```tsx
import { GalleryItem as GalleryItemType } from '../../data/gallery';
import { useLanguage } from '../../contexts/LanguageContext';

interface GalleryItemProps {
  item: GalleryItemType;
}

const GalleryItem = ({ item }: GalleryItemProps) => {
  const { t, formatDate } = useLanguage();

  return (
    <article 
      data-testid="gallery-item"
      className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
    >
      <div className="aspect-[4/3] overflow-hidden bg-gray-200 dark:bg-gray-700">
        <img
          src={item.placeholder}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
          {item.title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
          {t('gallery.takenOn')} {formatDate(item.date)}
        </p>
        <div className="flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded"
            >
              {t(`gallery.tags.${tag}`)}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
};

export default GalleryItem;
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/components/ui/Button.tsx:
```tsx
import { ButtonHTMLAttributes, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  children: ReactNode;
}

const Button = ({ variant = 'primary', children, className, ...props }: ButtonProps) => {
  const baseStyles = 'px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-[var(--color-accent-primary)] text-white hover:bg-[var(--color-accent-secondary)] focus:ring-[var(--color-accent-primary)]',
    outline: 'border-2 border-[var(--color-accent-primary)] text-[var(--color-accent-primary)] hover:bg-[var(--color-accent-primary)] hover:text-white',
    ghost: 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
  };

  return (
    <button 
      className={twMerge(baseStyles, variants[variant], className)} 
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/components/ui/Select.tsx:
```tsx
import { SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
  'aria-label'?: string;
}

const Select = ({ label, options, className, 'aria-label': ariaLabel, ...props }: SelectProps) => {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <select
        aria-label={ariaLabel}
        className={`block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-[var(--color-accent-primary)] focus:ring-[var(--color-accent-primary)] sm:text-sm ${className}`}
        {...props}
      >

        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/components/ui/Toggle.tsx:
```tsx
interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (val: boolean) => void;
  'data-testid'?: string;
  'aria-label'?: string;
}

const Toggle = ({ label, checked, onChange, 'data-testid': testId, 'aria-label': ariaLabel }: ToggleProps) => {
  return (
    <label className="flex items-center cursor-pointer">
      <span className="mr-3 text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          data-testid={testId}
          aria-label={ariaLabel || label}
        />

        <div className={`block w-10 h-6 rounded-full transition-colors ${checked ? 'bg-[var(--color-accent-primary)]' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
        <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${checked ? 'transform translate-x-4' : ''}`}></div>
      </div>
    </label>
  );
};

export default Toggle;
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/contexts/LanguageContext.tsx:
```tsx
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
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/contexts/OfflineContext.tsx:
```tsx
import { createContext, useContext, useState, ReactNode } from 'react';

interface OfflineContextType {
  isOffline: boolean;
  setIsOffline: (val: boolean) => void;
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined);

export const OfflineProvider = ({ children }: { children: ReactNode }) => {
  const [isOffline, setIsOffline] = useState(false);

  return (
    <OfflineContext.Provider value={{ isOffline, setIsOffline }}>
      {children}
    </OfflineContext.Provider>
  );
};

export const useOffline = () => {
  const context = useContext(OfflineContext);
  if (!context) throw new Error('useOffline must be used within OfflineProvider');
  return context;
};

export default OfflineProvider;
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/contexts/ThemeContext.tsx:
```tsx
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
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/data/gallery.ts:
```typescript
import { faker } from '@faker-js/faker';

export interface GalleryItem {
  id: string;
  title: string;
  date: string;
  tags: ('portrait' | 'nature' | 'urban')[];
  placeholder: string;
}

const tags: ('portrait' | 'nature' | 'urban')[] = ['portrait', 'nature', 'urban'];

const generatePlaceholder = (color: string) => `data:image/svg+xml;base64,${btoa(`
  <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="${color}"/>
    <text x="50%" y="50%" font-family="Arial" font-size="20" fill="white" text-anchor="middle" dy=".3em">Lumen Photo</text>
  </svg>
`)}`;

export const galleryData: GalleryItem[] = [
  {
    id: '1',
    title: 'Golden Hour',
    date: '2025-06-01T00:00:00Z',
    tags: ['nature'],
    placeholder: generatePlaceholder('#f59e0b')
  },
  ...Array.from({ length: 11 }).map((_, i) => ({
    id: (i + 2).toString(),
    title: faker.commerce.productName(),
    date: faker.date.past().toISOString(),
    tags: [tags[Math.floor(Math.random() * tags.length)]],
    placeholder: generatePlaceholder(faker.color.rgb())
  }))
];
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/i18n/de.ts:
```typescript
export default {
  nav: {
    home: 'Startseite',
    gallery: 'Galerie',
    upload: 'Hochladen',
    about: 'Über uns',
    settings: 'Einstellungen'
  },
  home: {
    welcome: 'Willkommen bei Lumen',
    subheading: 'Ihr Premium-Fotospeicher- und Freigabedienst.',
    cta: 'Galerie erkunden',
    features: {
      quality: 'Hohe Qualität',
      qualityDesc: 'Kristallklare Auflösung für all Ihre Erinnerungen.',
      upload: 'Einfacher Upload',
      uploadDesc: 'Ziehen Sie Ihre Fotos ganz einfach per Drag & Drop.',
      secure: 'Sicherer Speicher',
      secureDesc: 'Ihre Daten sind bei uns verschlüsselt und sicher.'
    }
  },
  gallery: {
    title: 'Galerie',
    filterLabel: 'Filter',
    takenOn: 'Aufgenommen am',
    tags: {
      all: 'Alle',
      portrait: 'Porträt',
      nature: 'Natur',
      urban: 'Städtisch'
    }
  },
  upload: {
    title: 'Foto hochladen',
    label: 'Fotodatei auswählen',
    button: 'Hochladen',
    demoNote: 'Dies ist eine Demo - Uploads sind nicht funktionsfähig'
  },
  about: {
    title: 'Über Lumen',
    mission: 'Unsere Mission ist es, Ihre kostbarsten Momente durch hochwertige digitale Speicherung und nahtlose Sharing-Erlebnisse zu bewahren.',
    values: 'Wir schätzen Privatsphäre, künstlerische Integrität und die Kraft des visuellen Geschichtenerzählens. Jedes Pixel ist uns wichtig, weil jede Erinnerung Ihnen wichtig ist.',
    story: 'Unsere Geschichte',
    storyContent: 'Lumen wurde 2023 als kleines Projekt von Fotografen gegründet, die ihre Arbeit besser präsentieren wollten, ohne Kompromisse bei der Qualität einzugehen. Heute bedienen wir Tausende von Nutzern weltweit.',
    team: 'Unser Team',
    members: {
      ceo: { name: 'Sarah Jenkins', role: 'Gründerin & CEO' },
      cto: { name: 'Marcus Chen', role: 'Technischer Leiter' },
      design: { name: 'Elena Rodriguez', role: 'Design-Leiterin' }
    }
  },

  settings: {
    title: 'Einstellungen',
    themeLabel: 'Thema',
    accentLabel: 'Akzentfarbe',
    languageLabel: 'Sprache',
    offlineLabel: 'Offline-Simulation',
    light: 'Hell',
    dark: 'Dunkel',
    accents: {
      ocean: 'Ozean',
      sunset: 'Sonnenuntergang',
      forest: 'Wald'
    }
  },
  common: {
    offlineEnabled: 'Offline-Modus aktiviert'
  }
};
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/i18n/en.ts:
```typescript
export default {
  nav: {
    home: 'Home',
    gallery: 'Gallery',
    upload: 'Upload',
    about: 'About',
    settings: 'Settings'
  },
  home: {
    welcome: 'Welcome to Lumen',
    subheading: 'Your premium photo storage and sharing service.',
    cta: 'Explore Gallery',
    features: {
      quality: 'High Quality',
      qualityDesc: 'Crystal clear resolution for all your memories.',
      upload: 'Easy Upload',
      uploadDesc: 'Drag and drop your photos with ease.',
      secure: 'Secure Storage',
      secureDesc: 'Your data is encrypted and safe with us.'
    }
  },
  gallery: {
    title: 'Gallery',
    filterLabel: 'Filter',
    takenOn: 'Taken on',
    tags: {
      all: 'All',
      portrait: 'Portrait',
      nature: 'Nature',
      urban: 'Urban'
    }
  },
  upload: {
    title: 'Upload Photo',
    label: 'Choose photo file',
    button: 'Upload',
    demoNote: 'This is a demo - uploads are not functional'
  },
  about: {
    title: 'About Lumen',
    mission: 'Our mission is to preserve your most precious moments through high-quality digital storage and seamless sharing experiences.',
    values: 'We value privacy, artistic integrity, and the power of visual storytelling. Every pixel matters to us because every memory matters to you.',
    story: 'Our Story',
    storyContent: 'Founded in 2023, Lumen started as a small project among photographers who wanted a better way to showcase their work without compromising on quality. Today, we serve thousands of users worldwide.',
    team: 'Meet the Team',
    members: {
      ceo: { name: 'Sarah Jenkins', role: 'Founder & CEO' },
      cto: { name: 'Marcus Chen', role: 'Chief Technology Officer' },
      design: { name: 'Elena Rodriguez', role: 'Head of Design' }
    }
  },

  settings: {
    title: 'Settings',
    themeLabel: 'Theme',
    accentLabel: 'Accent color',
    languageLabel: 'Language',
    offlineLabel: 'Offline simulation',
    light: 'Light',
    dark: 'Dark',
    accents: {
      ocean: 'Ocean',
      sunset: 'Sunset',
      forest: 'Forest'
    }
  },
  common: {
    offlineEnabled: 'Offline mode enabled'
  }
};
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/pages/AboutPage.tsx:
```tsx
import { UserCircleIcon } from '@heroicons/react/24/solid';
import { useLanguage } from '../contexts/LanguageContext';

const AboutPage = () => {
  const { t } = useLanguage();

  const teamMembers = [
    { id: 'ceo', key: 'about.members.ceo' },
    { id: 'cto', key: 'about.members.cto' },
    { id: 'design', key: 'about.members.design' },
  ];

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-12 text-gray-800 dark:text-gray-200">
      <section className="space-y-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          {t('about.title')}
        </h1>
        <p className="text-lg leading-relaxed">
          {t('about.mission')}
        </p>
        <p className="text-lg leading-relaxed">
          {t('about.values')}
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          {t('about.story')}
        </h2>
        <p className="text-lg leading-relaxed">
          {t('about.storyContent')}
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          {t('about.team')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {teamMembers.map((member) => (
            <div 
              key={member.id} 
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center border border-gray-100 dark:border-gray-700 transition-transform hover:scale-105"
            >
              <UserCircleIcon className="w-20 h-20 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {t(`${member.key}.name`)}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {t(`${member.key}.role`)}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/pages/GalleryPage.tsx:
```tsx
import { useState, useEffect, useMemo } from 'react';
import { galleryData, GalleryItem } from '../data/gallery';
import { useLanguage } from '../contexts/LanguageContext';
import { useOffline } from '../contexts/OfflineContext';
import * as offlineCache from '../utils/offlineCache';
import GalleryFilter from '../components/GalleryPage/GalleryFilter';
import GalleryGrid from '../components/GalleryPage/GalleryGrid';

const GalleryPage = () => {
  const { t } = useLanguage();
  const { isOffline } = useOffline();
  const [activeFilter, setActiveFilter] = useState('all');
  const [items, setItems] = useState<GalleryItem[]>([]);

  useEffect(() => {
    if (isOffline) {
      const cachedData = offlineCache.getAsset('gallery-data');
      if (cachedData) {
        setItems(cachedData);
      }
    } else {
      setItems(galleryData);
      offlineCache.cacheAsset('gallery-data', galleryData);
    }
  }, [isOffline]);

  const filteredItems = useMemo(() => {
    if (activeFilter === 'all') return items;
    return items.filter(item => item.tags.includes(activeFilter as any));
  }, [items, activeFilter]);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t('gallery.title')}
        </h1>
        {isOffline && (
          <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">
            {t('common.offlineEnabled')}
          </p>
        )}
      </div>

      <GalleryFilter 
        activeFilter={activeFilter} 
        onFilterChange={setActiveFilter} 
      />

      {filteredItems.length > 0 ? (
        <GalleryGrid items={filteredItems} />
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-500 dark:text-gray-400">
            No photos found for this filter.
          </p>
        </div>
      )}
    </main>
  );
};

export default GalleryPage;
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/pages/HomePage.tsx:
```tsx
import { Link } from 'react-router-dom';
import { 
  PhotoIcon, 
  CloudArrowUpIcon, 
  ShieldCheckIcon 
} from '@heroicons/react/24/solid';
import { useLanguage } from '../contexts/LanguageContext';
import Button from '../components/ui/Button';

const HomePage = () => {
  const { t } = useLanguage();

  const features = [
    {
      title: t('home.features.quality'),
      description: t('home.features.qualityDesc'),
      icon: PhotoIcon,
    },
    {
      title: t('home.features.upload'),
      description: t('home.features.uploadDesc'),
      icon: CloudArrowUpIcon,
    },
    {
      title: t('home.features.secure'),
      description: t('home.features.secureDesc'),
      icon: ShieldCheckIcon,
    },
  ];

  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 text-center bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6">
            {t('home.welcome')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
            {t('home.subheading')}
          </p>
          <Link to="/gallery">
            <Button className="text-lg px-8 py-4">
              {t('home.cta')}
            </Button>
          </Link>

        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="sr-only">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-[var(--color-accent-primary)]/10 rounded-lg flex items-center justify-center mb-6">
                <feature.icon className="w-6 h-6 text-[var(--color-accent-primary)]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default HomePage;
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/pages/SettingsPage.tsx:
```tsx
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useOffline } from '../contexts/OfflineContext';
import Toggle from '../components/ui/Toggle';
import Select from '../components/ui/Select';

const SettingsPage = () => {
  const { theme, accent, toggleTheme, setAccent } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { isOffline, setIsOffline } = useOffline();

  const accentOptions = [
    { value: 'ocean', label: t('settings.accents.ocean') },
    { value: 'sunset', label: t('settings.accents.sunset') },
    { value: 'forest', label: t('settings.accents.forest') },
  ];

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'de', label: 'Deutsch' },
  ];

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        {t('settings.title')}
      </h1>

      <div className="space-y-4">
        {/* Theme Setting */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('settings.themeLabel')}
          </span>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-500 uppercase">
              {theme === 'light' ? t('settings.light') : t('settings.dark')}
            </span>
            <Toggle
              label=""
              checked={theme === 'dark'}
              onChange={toggleTheme}
              data-testid="theme-toggle"
              aria-label="Theme"
            />
          </div>
        </section>

        {/* Accent Color Setting */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-center justify-between">
          <label htmlFor="accent-select" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('settings.accentLabel')}
          </label>
          <Select
            id="accent-select"
            data-testid="accent-select"
            aria-label="Accent color"
            value={accent}
            onChange={(e) => setAccent(e.target.value as 'ocean' | 'sunset' | 'forest')}
            options={accentOptions}
            className="w-32"
          />
        </section>

        {/* Language Setting */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-center justify-between">
          <label htmlFor="language-select" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('settings.languageLabel')}
          </label>
          <Select
            id="language-select"
            data-testid="language-select"
            aria-label="Language"
            value={language}
            onChange={(e) => setLanguage(e.target.value as 'en' | 'de')}
            options={languageOptions}
            className="w-32"
          />
        </section>

        {/* Offline Simulation Setting */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {t('settings.offlineLabel')}
          </span>
          <Toggle
            label=""
            checked={isOffline}
            onChange={setIsOffline}
            aria-label="Offline simulation"
          />
        </section>
      </div>
    </main>
  );
};

export default SettingsPage;
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/pages/UploadPage.tsx:
```tsx
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import Button from '../components/ui/Button';

const UploadPage: React.FC = () => {
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <main className="flex-1 container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          {t('upload.title')}
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label 
                htmlFor="photo-upload" 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {t('upload.label')}
              </label>
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                className="block w-full text-sm text-gray-500 dark:text-gray-400
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-[var(--color-accent-primary)] file:text-white
                  hover:file:bg-[var(--color-accent-secondary)]
                  cursor-pointer"
              />
            </div>

            <div className="pt-2">
              <Button 
                type="submit" 
                disabled 
                className="w-full justify-center py-3"
              >
                {t('upload.button')}
              </Button>
            </div>

            <p className="text-sm text-center text-gray-500 dark:text-gray-400 italic">
              {t('upload.demoNote')}
            </p>
          </form>
        </div>
      </div>
    </main>
  );
};

export default UploadPage;
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/utils/offlineCache.ts:
```typescript
export const cacheAsset = (key: string, value: any) => {
  sessionStorage.setItem(`lumen.cache.${key}`, JSON.stringify(value));
};

export const getAsset = (key: string) => {
  const item = sessionStorage.getItem(`lumen.cache.${key}`);
  return item ? JSON.parse(item) : null;
};

export const isOffline = () => {
  return sessionStorage.getItem('lumen.offline') === 'true';
};
```

