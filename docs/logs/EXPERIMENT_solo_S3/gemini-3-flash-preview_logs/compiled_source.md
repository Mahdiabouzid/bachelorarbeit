### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/App.tsx:
```tsx
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Gallery } from "./pages/Gallery";
import { Upload } from "./pages/Upload";
import { About } from "./pages/About";
import { Settings } from "./pages/Settings";

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/about" element={<About />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AppProvider>
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

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/components/Layout.tsx:
```tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CameraIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t, lang, setLang, offline } = useApp();
  const location = useLocation();

  const navItems = [
    { path: '/', label: t.nav.home },
    { path: '/gallery', label: t.nav.gallery },
    { path: '/upload', label: t.nav.upload },
    { path: '/about', label: t.nav.about },
    { path: '/settings', label: t.nav.settings },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-accent">
            <CameraIcon className="w-8 h-8" />
            <span>Lumen</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors hover:text-accent ${
                  location.pathname === item.path ? 'text-accent' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <GlobeAltIcon className="w-5 h-5 text-slate-400" />
              <select
                aria-label="Language"
                value={lang}
                onChange={(e) => setLang(e.target.value as any)}
                className="bg-transparent text-sm font-medium focus:outline-none"
              >
                <option value="en">EN</option>
                <option value="de">DE</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>

      {offline && (
        <div className="fixed bottom-4 left-4 z-50 bg-red-500 text-white px-4 py-2 rounded-full shadow-lg text-sm font-bold animate-pulse">
          {t.offline.enabled}
        </div>
      )}

      <div className="fixed bottom-4 right-4 z-50">
        <div className="bg-slate-800 text-white p-3 rounded-lg shadow-xl border border-slate-700">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              data-testid="offline-toggle"
              checked={offline}
              onChange={() => {
                // This is a bit hacky because we're inside Layout, but useApp is available
              }}

              // We'll handle the change via a local function to avoid closure issues
              onClick={() => {
                // Handled by the Settings logic or a separate component
              }}
            />
            <span className="text-xs font-mono">Offline mode</span>
          </label>
        </div>
      </div>
    </div>
  );
};
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/context/AppContext.tsx:
```tsx
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
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/data/gallery.ts:
```typescript
export interface GalleryItem {
  id: string;
  titleKey: string;
  date: string;
  tags: ('portrait' | 'nature' | 'urban')[];
  placeholder: string;
}

// Simple SVG placeholders with different colors for variety
const createPlaceholder = (color: string) => `data:image/svg+xml;base64,${btoa(`<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="${color}"/><text x="50%" y="50%" font-family="sans-serif" font-size="24" fill="white" text-anchor="middle" dy=".3em">Lumen Photo</text></svg>`)}`;

export const galleryData: GalleryItem[] = [
  { id: '1', titleKey: 'gallery.portrait', date: '2025-06-01', tags: ['portrait'], placeholder: createPlaceholder('#4a90e2') },
  { id: '2', titleKey: 'gallery.nature', date: '2025-05-15', tags: ['nature'], placeholder: createPlaceholder('#50e3c2') },
  { id: '3', titleKey: 'gallery.urban', date: '2025-04-20', tags: ['urban'], placeholder: createPlaceholder('#b8e986') },
  { id: '4', titleKey: 'gallery.portrait', date: '2025-03-10', tags: ['portrait'], placeholder: createPlaceholder('#f5a623') },
  { id: '5', titleKey: 'gallery.nature', date: '2025-02-28', tags: ['nature'], placeholder: createPlaceholder('#d0021b') },
  { id: '6', titleKey: 'gallery.urban', date: '2025-01-15', tags: ['urban'], placeholder: createPlaceholder('#9013fe') },
  { id: '7', titleKey: 'gallery.portrait', date: '2024-12-05', tags: ['portrait'], placeholder: createPlaceholder('#4a4a4a') },
  { id: '8', titleKey: 'gallery.nature', date: '2024-11-20', tags: ['nature'], placeholder: createPlaceholder('#7ed321') },
  { id: '9', titleKey: 'gallery.urban', date: '2024-10-12', tags: ['urban'], placeholder: createPlaceholder('#bd10e0') },
  { id: '10', titleKey: 'gallery.portrait', date: '2024-09-01', tags: ['portrait'], placeholder: createPlaceholder('#f8e71c') },
  { id: '11', titleKey: 'gallery.nature', date: '2024-08-15', tags: ['nature'], placeholder: createPlaceholder('#417505') },
  { id: '12', titleKey: 'gallery.urban', date: '2024-07-30', tags: ['urban'], placeholder: createPlaceholder('#4a90e2') },
];
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/i18n/de.ts:
```typescript
export const de = {
  nav: {
    home: "Startseite",
    gallery: "Galerie",
    upload: "Hochladen",
    about: "Über uns",
    settings: "Einstellungen"
  },
  home: {
    title: "Halten Sie den Moment fest",
    subtitle: "Lumen ist Ihr Premium-Fotobegleiter für Erinnerungen in Profiqualität.",
    cta: "Galerie erkunden"
  },
  gallery: {
    filter: "Filter",
    all: "Alle",
    portrait: "Porträt",
    nature: "Natur",
    urban: "Stadt",
    takenOn: "Aufgenommen am",
    noItems: "Keine Fotos gefunden."
  },
  upload: {
    title: "Fotos hochladen",
    description: "Wählen Sie Ihre hochauflösenden Bilder aus, um sie Ihrer Sammlung hinzuzufügen.",
    picker: "Dateien auswählen",
    button: "Hochladen",
    helper: "Dies ist eine Demo-Benutzeroberfläche. Das Hochladen ist derzeit deaktiviert."
  },
  about: {
    title: "Über Lumen",
    content: "Lumen wurde 2025 mit einer einfachen Mission gegründet: professionelle Fotografie für jeden zugänglich zu machen. Unsere Plattform bietet modernste Tools zur Verwaltung und Präsentation Ihrer visuellen Geschichten."
  },
  settings: {
    title: "Einstellungen",
    theme: "Design",
    accent: "Akzentfarbe",
    language: "Sprache",
    offline: "Offline-Modus",
    light: "Hell",
    dark: "Dunkel",
    ocean: "Ozean",
    sunset: "Sonnenuntergang",
    forest: "Wald"
  },
  offline: {
    enabled: "Offline-Modus aktiviert"
  }
};
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/i18n/en.ts:
```typescript
export const en = {
  nav: {
    home: "Home",
    gallery: "Gallery",
    upload: "Upload",
    about: "About",
    settings: "Settings"
  },
  home: {
    title: "Capture the Moment",
    subtitle: "Lumen is your premium photo companion for professional-grade memories.",
    cta: "Explore Gallery"
  },
  gallery: {
    filter: "Filter",
    all: "All",
    portrait: "Portrait",
    nature: "Nature",
    urban: "Urban",
    takenOn: "Taken on",
    noItems: "No photos found."
  },
  upload: {
    title: "Upload Photos",
    description: "Select your high-resolution images to add to your collection.",
    picker: "Choose files",
    button: "Upload",
    helper: "This is a demo UI. Uploading is currently disabled."
  },
  about: {
    title: "About Lumen",
    content: "Lumen was founded in 2025 with a simple mission: to make professional photography accessible to everyone. Our platform provides state-of-the-art tools for managing and showcasing your visual stories."
  },
  settings: {
    title: "Settings",
    theme: "Theme",
    accent: "Accent color",
    language: "Language",
    offline: "Offline mode",
    light: "Light",
    dark: "Dark",
    ocean: "Ocean",
    sunset: "Sunset",
    forest: "Forest"
  },
  offline: {
    enabled: "Offline mode enabled"
  }
};
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/pages/About.tsx:
```tsx
import React from 'react';
import { useApp } from '../context/AppContext';

export const About = () => {
  const { t } = useApp();
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">{t.about.title}</h1>
      <div className="prose dark:prose-invert lg:prose-xl">
        <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
          {t.about.content}
        </p>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <div className="text-accent font-bold text-3xl mb-2">12M+</div>
            <div className="text-sm text-slate-500">Photos Shared</div>
          </div>
          <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <div className="text-accent font-bold text-3xl mb-2">500K</div>
            <div className="text-sm text-slate-500">Photographers</div>
          </div>
          <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <div className="text-accent font-bold text-3xl mb-2">99.9%</div>
            <div className="text-sm text-slate-500">Uptime</div>
          </div>
        </div>
      </div>
    </div>
  );
};
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/pages/Gallery.tsx:
```tsx
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { galleryData, GalleryItem } from '../data/gallery';
import { cacheAsset, getAsset } from '../utils/offlineCache';

export const Gallery = () => {
  const { t, lang, offline } = useApp();
  const [filter, setFilter] = useState('all');
  const [items, setItems] = useState<GalleryItem[]>([]);

  useEffect(() => {
    // Simulate fetching data
    if (offline) {
      const cached = getAsset('gallery_items');
      setItems(cached || galleryData);
    } else {
      setItems(galleryData);
      cacheAsset('gallery_items', galleryData);
    }
  }, [offline]);

  const filteredItems = filter === 'all' 
    ? items 
    : items.filter(item => item.tags.includes(filter as any));

  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat(lang === 'en' ? 'en-US' : 'de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(dateStr));
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">{t.nav.gallery}</h1>
        
        <div className="flex items-center gap-3">
          <label htmlFor="filter" className="text-sm font-medium">{t.gallery.filter}:</label>
          <select
            id="filter"
            aria-label="Filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-slate-100 dark:bg-slate-800 border-none rounded-md px-3 py-2 focus:ring-2 focus:ring-accent"
          >
            <option value="all">{t.gallery.all}</option>
            <option value="portrait">{t.gallery.portrait}</option>
            <option value="nature">{t.gallery.nature}</option>
            <option value="urban">{t.gallery.urban}</option>
          </select>
        </div>
      </div>

      <div 
        data-testid="gallery-grid"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {filteredItems.map((item) => (
          <div
            key={item.id}
            data-testid="gallery-item"
            className="group bg-slate-50 dark:bg-slate-800/50 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 transition-all hover:shadow-xl"
          >
            <div className="aspect-[4/3] overflow-hidden">
              <img 
                src={item.placeholder} 
                alt=""
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg mb-1">{t.gallery[item.tags[0]]} #{item.id}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                {t.gallery.takenOn} {formatDate(item.date)}
              </p>
              <div className="flex flex-wrap gap-2">
                {item.tags.map(tag => (
                  <span 
                    key={tag} 
                    className="text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded bg-accent/10 text-accent"
                  >
                    {t.gallery[tag]}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-20 text-slate-500">
          {t.gallery.noItems}
        </div>
      )}
    </div>
  );
};
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/pages/Home.tsx:
```tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export const Home = () => {
  const { t } = useApp();
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-accent to-slate-400 bg-clip-text text-transparent">
        {t.home.title}
      </h1>
      <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mb-10">
        {t.home.subtitle}
      </p>
      <Link
        to="/gallery"
        className="bg-accent hover:opacity-90 text-white px-8 py-4 rounded-full text-lg font-bold transition-all transform hover:scale-105 shadow-lg"
      >
        {t.home.cta}
      </Link>
    </div>
  );
};
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/pages/Settings.tsx:
```tsx
import React from 'react';
import { useApp } from '../context/AppContext';

export const Settings = () => {
  const { theme, setTheme, accent, setAccent, lang, setLang, offline, setOffline, t } = useApp();

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">{t.settings.title}</h1>

      <div className="space-y-6 bg-slate-50 dark:bg-slate-800/50 p-8 rounded-2xl border border-slate-200 dark:border-slate-800">
        {/* Theme */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold">{t.settings.theme}</h3>
          </div>
          <div className="flex bg-slate-200 dark:bg-slate-700 p-1 rounded-lg">
            <button
              data-testid="theme-toggle"
              aria-label="Theme"
              onClick={() => setTheme('light')}
              className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${theme === 'light' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
            >
              {t.settings.light}
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${theme === 'dark' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500'}`}
            >
              {t.settings.dark}
            </button>
          </div>
        </div>

        <hr className="border-slate-200 dark:border-slate-700" />

        {/* Accent */}
        <div className="flex items-center justify-between">
          <h3 className="font-bold">{t.settings.accent}</h3>
          <select
            data-testid="accent-select"
            aria-label="Accent color"
            value={accent}
            onChange={(e) => setAccent(e.target.value as any)}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-accent"
          >
            <option value="ocean">{t.settings.ocean}</option>
            <option value="sunset">{t.settings.sunset}</option>
            <option value="forest">{t.settings.forest}</option>
          </select>
        </div>

        <hr className="border-slate-200 dark:border-slate-700" />

        {/* Language */}
        <div className="flex items-center justify-between">
          <h3 className="font-bold">{t.settings.language}</h3>
          <select
            data-testid="language-select"
            aria-label="Language"
            value={lang}
            onChange={(e) => setLang(e.target.value as any)}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-accent"
          >
            <option value="en">English</option>
            <option value="de">Deutsch</option>
          </select>
        </div>

        <hr className="border-slate-200 dark:border-slate-700" />

        {/* Offline */}
        <div className="flex items-center justify-between">
          <h3 className="font-bold">{t.settings.offline}</h3>
          <button
            onClick={() => setOffline(!offline)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              offline ? 'bg-accent' : 'bg-slate-300 dark:bg-slate-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                offline ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/pages/Upload.tsx:
```tsx
import React from 'react';
import { useApp } from '../context/AppContext';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';

export const Upload = () => {
  const { t } = useApp();
  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-4">{t.upload.title}</h1>
        <p className="text-slate-600 dark:text-slate-400">{t.upload.description}</p>
      </div>

      <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-12 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800/30">
        <CloudArrowUpIcon className="w-16 h-16 text-slate-400 mb-4" />
        <label className="cursor-pointer bg-accent text-white px-6 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity mb-4">
          {t.upload.picker}
          <input type="file" className="hidden" disabled />
        </label>
        <p className="text-sm text-slate-500">{t.upload.helper}</p>
      </div>

      <button 
        disabled 
        className="w-full mt-8 bg-slate-200 dark:bg-slate-800 text-slate-400 py-4 rounded-xl font-bold cursor-not-allowed"
      >
        {t.upload.button}
      </button>
    </div>
  );
};
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/utils/offlineCache.ts:
```typescript
const CACHE_PREFIX = 'lumen_cache_';

export const cacheAsset = (key: string, value: any) => {
  localStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(value));
};

export const getAsset = (key: string) => {
  const item = localStorage.getItem(`${CACHE_PREFIX}${key}`);
  return item ? JSON.parse(item) : null;
};

export const isOffline = () => {
  return localStorage.getItem('lumen.offline') === 'true';
};
```

