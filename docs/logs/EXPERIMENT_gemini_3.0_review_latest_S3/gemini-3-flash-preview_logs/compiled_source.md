### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/App.tsx:
```tsx
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppContextProvider } from './context/AppContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import About from './pages/About';
import Upload from './pages/Upload';
import Settings from './pages/Settings';

export default function App() {
  return (
    <AppContextProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/about" element={<About />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AppContextProvider>
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
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { en } from '../i18n/en';
import { de } from '../i18n/de';

const DevToolbar: React.FC = () => {
  const { isOffline, setIsOffline, language } = useAppContext();
  const t = language === 'en' ? en : de;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-2 text-xs flex items-center justify-between z-50 opacity-90 hover:opacity-100 transition-opacity">
      <div className="flex items-center space-x-4">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            data-testid="offline-toggle"
            checked={isOffline}
            onChange={(e) => setIsOffline(e.target.checked)}
            className="mr-2 h-4 w-4 rounded border-gray-300 text-[var(--accent-primary)] focus:ring-[var(--accent-primary)]"
          />
          <span>Offline mode</span>
        </label>
        {isOffline && (
          <span className="bg-orange-500 text-white px-2 py-0.5 rounded-full font-bold animate-pulse">
            {t.common.offlineEnabled}
          </span>
        )}
      </div>
      <div className="hidden md:block text-gray-400">
        Dev Toolbar | Language: {language.toUpperCase()}
      </div>
    </div>
  );
};

export default DevToolbar;
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/components/Header.tsx:
```tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { en } from '../i18n/en';
import { de } from '../i18n/de';

const Header: React.FC = () => {
  const { language } = useAppContext();
  const t = language === 'en' ? en : de;

  const navItems = [
    { path: '/', label: t.nav.home },
    { path: '/gallery', label: t.nav.gallery },
    { path: '/upload', label: t.nav.upload },
    { path: '/about', label: t.nav.about },
    { path: '/settings', label: t.nav.settings },
  ];

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <span className="text-2xl font-bold text-[var(--accent-primary)]">Lumen</span>
          </div>
          <nav className="hidden sm:flex space-x-8">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'border-[var(--accent-primary)] text-gray-900 dark:text-white'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          {/* Mobile menu button could go here, but keeping it simple per requirements */}
        </div>
      </div>
    </header>
  );
};

export default Header;
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/components/Layout.tsx:
```tsx
import React, { ReactNode } from 'react';
import Header from './Header';
import DevToolbar from './DevToolbar';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <Header />
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>

      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-8 mb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Lumen Photo Service. All rights reserved.</p>
        </div>
      </footer>

      <DevToolbar />
    </div>
  );
};

export default Layout;
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/components/Gallery/FilterBar.tsx:
```tsx
import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { en } from '../../i18n/en';
import { de } from '../../i18n/de';


interface FilterBarProps {
  currentFilter: string;
  onFilterChange: (filter: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ currentFilter, onFilterChange }) => {
  const { language } = useAppContext();
  const t = language === 'en' ? en : de;

  const categories = ['All', 'Portrait', 'Nature', 'Urban'];

  return (
    <div className="mb-8 flex items-center gap-4">
      <label htmlFor="category-filter" className="font-medium text-gray-700 dark:text-gray-300">
        Filter:
      </label>
      <select
        id="category-filter"
        aria-label="Filter"
        value={currentFilter}
        onChange={(e) => onFilterChange(e.target.value)}
        className="rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-accent-primary focus:outline-none focus:ring-accent-primary sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
      >
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterBar;
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/components/Gallery/GalleryTile.tsx:
```tsx
import React from 'react';
import { GalleryItem } from '../../types';
import { useAppContext } from '../../context/AppContext';

interface GalleryTileProps {
  item: GalleryItem;
}

const GalleryTile: React.FC<GalleryTileProps> = ({ item }) => {
  const { language } = useAppContext();

  const formattedDate = new Intl.DateTimeFormat(language === 'en' ? 'en-US' : 'de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(item.date));

  return (
    <div
      data-testid="gallery-item"
      className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
    >
      <div className="aspect-h-3 aspect-w-4 overflow-hidden bg-gray-200">
        <img
          src={item.imageUrl}
          alt={item.titleKey}
          className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {item.titleKey}
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {formattedDate}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-200"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GalleryTile;
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/context/AppContext.tsx:
```tsx
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
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/data/gallery.ts:
```typescript
import { GalleryItem } from '../types';

export const galleryData: GalleryItem[] = [
  {
    id: '1',
    titleKey: 'Golden Hour',
    date: '2025-06-01',
    category: 'Nature',
    imageUrl: 'https://picsum.photos/400/300?random=1',
    tags: ['nature', 'sun', 'landscape']
  },
  {
    id: '2',
    titleKey: 'City Lights',
    date: '2024-12-15',
    category: 'Urban',
    imageUrl: 'https://picsum.photos/400/300?random=2',
    tags: ['urban', 'night', 'city']
  },
  {
    id: '3',
    titleKey: 'Serenity',
    date: '2025-01-10',
    category: 'Portrait',
    imageUrl: 'https://picsum.photos/400/300?random=3',
    tags: ['portrait', 'calm']
  },
  {
    id: '4',
    titleKey: 'Mountain Peak',
    date: '2024-11-20',
    category: 'Nature',
    imageUrl: 'https://picsum.photos/400/300?random=4',
    tags: ['nature', 'mountain']
  },
  {
    id: '5',
    titleKey: 'Street Art',
    date: '2025-02-05',
    category: 'Urban',
    imageUrl: 'https://picsum.photos/400/300?random=5',
    tags: ['urban', 'art']
  },
  {
    id: '6',
    titleKey: 'The Look',
    date: '2025-03-12',
    category: 'Portrait',
    imageUrl: 'https://picsum.photos/400/300?random=6',
    tags: ['portrait', 'fashion']
  },
  {
    id: '7',
    titleKey: 'Forest Path',
    date: '2024-10-05',
    category: 'Nature',
    imageUrl: 'https://picsum.photos/400/300?random=7',
    tags: ['nature', 'forest']
  },
  {
    id: '8',
    titleKey: 'Skyscraper',
    date: '2025-04-01',
    category: 'Urban',
    imageUrl: 'https://picsum.photos/400/300?random=8',
    tags: ['urban', 'architecture']
  },
  {
    id: '9',
    titleKey: 'Smile',
    date: '2025-05-15',
    category: 'Portrait',
    imageUrl: 'https://picsum.photos/400/300?random=9',
    tags: ['portrait', 'happy']
  },
  {
    id: '10',
    titleKey: 'Ocean Breeze',
    date: '2024-09-22',
    category: 'Nature',
    imageUrl: 'https://picsum.photos/400/300?random=10',
    tags: ['nature', 'ocean']
  },
  {
    id: '11',
    titleKey: 'Subway Station',
    date: '2025-01-25',
    category: 'Urban',
    imageUrl: 'https://picsum.photos/400/300?random=11',
    tags: ['urban', 'transit']
  },
  {
    id: '12',
    titleKey: 'Profile',
    date: '2024-08-30',
    category: 'Portrait',
    imageUrl: 'https://picsum.photos/400/300?random=12',
    tags: ['portrait', 'bw']
  }
];
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/i18n/de.ts:
```typescript
export const de = {
  nav: {
    home: 'Startseite',
    gallery: 'Galerie',
    upload: 'Hochladen',
    about: 'Über uns',
    settings: 'Einstellungen',
  },
  home: {
    title: 'Willkommen bei Lumen',
    subtitle: 'Licht einfangen, Momente bewahren.',
    cta: 'Galerie erkunden',
  },
  gallery: {
    title: 'Fotogalerie',
    filter: 'Filter',
    categories: {
      all: 'Alle',
      portrait: 'Porträt',
      nature: 'Natur',
      urban: 'Städtisch',
    },
    empty: 'Keine Fotos gefunden.',
  },
  upload: {
    title: 'Foto hochladen',
    dropzone: 'Klicken oder ziehen Sie ein Foto in diesen Bereich',
    submit: 'Hochladen',
    helper: 'Unterstützte Formate: JPG, PNG. Max. Größe: 5MB.',
  },
  about: {
    title: 'Über Lumen',
    description: 'Lumen ist ein Premium-Fotoservice, der sich dem hochwertigen visuellen Storytelling widmet.',
  },
  settings: {
    title: 'Einstellungen',
    theme: 'Design',
    accent: 'Akzentfarbe',
    language: 'Sprache',
    offline: 'Offline-Modus',
    accents: {
      ocean: 'Ozean',
      sunset: 'Sonnenuntergang',
      forest: 'Wald',
    },
  },
  common: {
    offlineEnabled: 'Offline-Modus aktiviert',
  }
};
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/i18n/en.ts:
```typescript
export const en = {
  nav: {
    home: 'Home',
    gallery: 'Gallery',
    upload: 'Upload',
    about: 'About',
    settings: 'Settings',
  },
  home: {
    title: 'Welcome to Lumen',
    subtitle: 'Capturing light, preserving moments.',
    cta: 'Explore Gallery',
  },
  gallery: {
    title: 'Photo Gallery',
    filter: 'Filter',
    categories: {
      all: 'All',
      portrait: 'Portrait',
      nature: 'Nature',
      urban: 'Urban',
    },
    empty: 'No photos found.',
  },
  upload: {
    title: 'Upload Photo',
    dropzone: 'Click or drag photo to this area to upload',
    submit: 'Upload',
    helper: 'Supported formats: JPG, PNG. Max size: 5MB.',
  },
  about: {
    title: 'About Lumen',
    description: 'Lumen is a premium photo service dedicated to high-quality visual storytelling.',
  },
  settings: {
    title: 'Settings',
    theme: 'Theme',
    accent: 'Accent Color',
    language: 'Language',
    offline: 'Offline Mode',
    accents: {
      ocean: 'Ocean',
      sunset: 'Sunset',
      forest: 'Forest',
    },
  },
  common: {
    offlineEnabled: 'Offline mode enabled',
  }
};
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/pages/About.tsx:
```tsx
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { en } from '../i18n/en';
import { de } from '../i18n/de';

const About: React.FC = () => {
  const { language } = useAppContext();
  const t = language === 'en' ? en : de;

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        {t.about.title}
      </h1>
      <div className="prose dark:prose-invert">
        <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
          {t.about.description}
        </p>
      </div>
    </div>
  );
};

export default About;
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/pages/Gallery.tsx:
```tsx
import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { galleryData } from '../data/gallery';
import FilterBar from '../components/Gallery/FilterBar';
import GalleryTile from '../components/Gallery/GalleryTile';
import { en } from '../i18n/en';
import { de } from '../i18n/de';


const Gallery: React.FC = () => {
  const { language, isOffline } = useAppContext();
  const [filter, setFilter] = useState('All');
  const t = language === 'en' ? en : de;

  const filteredItems = useMemo(() => {
    // In a real app, if isOffline is true, we might fetch from a different source
    // or show a banner. Here we simulate by using the same data but acknowledging the state.
    if (filter === 'All') return galleryData;
    return galleryData.filter((item) => item.category === filter);
  }, [filter]);

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {language === 'en' ? 'Our Gallery' : 'Unsere Galerie'}
        </h1>
        {isOffline && (
          <div className="mb-4 rounded-md bg-yellow-50 p-4 dark:bg-yellow-900/20">
            <p className="text-sm text-yellow-700 dark:text-yellow-400">
              {language === 'en' 
                ? 'Viewing in offline mode. Some high-res images may be unavailable.' 
                : 'Anzeige im Offline-Modus. Einige hochauflösende Bilder sind möglicherweise nicht verfügbar.'}
            </p>
          </div>
        )}
        <FilterBar currentFilter={filter} onFilterChange={setFilter} />
      </header>

      <div
        data-testid="gallery-grid"
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {filteredItems.map((item) => (
          <GalleryTile key={item.id} item={item} />
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-xl text-gray-500">
            {language === 'en' ? 'No photos found.' : 'Keine Fotos gefunden.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default Gallery;
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/pages/Home.tsx:
```tsx
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { en } from '../i18n/en';
import { de } from '../i18n/de';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const { language } = useAppContext();
  const t = language === 'en' ? en : de;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
        {t.home.title}
      </h1>
      <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl">
        {t.home.subtitle}
      </p>
      <Link
        to="/gallery"
        className="px-8 py-3 bg-[var(--accent-primary, #0ea5e9)] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
      >
        {t.home.cta}
      </Link>
    </div>
  );
};

export default Home;
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/pages/Settings.tsx:
```tsx
import { useAppContext } from '../context/AppContext';
import { en } from '../i18n/en';
import { de } from '../i18n/de';
import { Theme, Accent, Language } from '../types';


const Settings = () => {
  const { 
    theme, setTheme, 
    accent, setAccent, 
    language, setLanguage, 
    isOffline, setIsOffline 
  } = useAppContext();

  const t = language === 'en' ? en : de;

  const handleThemeToggle = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
        {t.nav.settings}
      </h1>

      <div className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        {/* Language Selection */}
        <div className="flex flex-col space-y-2">
          <label htmlFor="language-select" className="font-medium text-gray-700 dark:text-gray-300">
            {language === 'en' ? 'Language' : 'Sprache'}
          </label>
          <select
            id="language-select"
            data-testid="language-select"
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="block w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-accent-primary focus:border-accent-primary dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
          >
            <option value="en">English</option>
            <option value="de">Deutsch</option>
          </select>
        </div>

        {/* Theme Toggle */}
        <div className="flex items-center justify-between py-4 border-t border-gray-100 dark:border-gray-700">
          <div>
            <p className="font-medium text-gray-700 dark:text-gray-300">
              {language === 'en' ? 'Dark Mode' : 'Dunkelmodus'}
            </p>
            <p className="text-sm text-gray-500">
              {language === 'en' ? 'Switch between light and dark themes' : 'Zwischen hellem und dunklem Design wechseln'}
            </p>
          </div>
          <button
            type="button"
            data-testid="theme-toggle"
            onClick={handleThemeToggle}
            aria-label="Toggle Theme"
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 ${
              theme === 'dark' ? 'bg-accent-primary' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Accent Selection */}
        <div className="flex flex-col space-y-2 py-4 border-t border-gray-100 dark:border-gray-700">
          <label htmlFor="accent-select" className="font-medium text-gray-700 dark:text-gray-300">
            {language === 'en' ? 'Accent Color' : 'Akzentfarbe'}
          </label>
          <select
            id="accent-select"
            data-testid="accent-select"
            value={accent}
            onChange={(e) => setAccent(e.target.value as Accent)}
            className="block w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-accent-primary focus:border-accent-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="ocean">Ocean</option>
            <option value="sunset">Sunset</option>
            <option value="forest">Forest</option>
          </select>
        </div>

        {/* Offline Mode Toggle */}
        <div className="flex items-center justify-between py-4 border-t border-gray-100 dark:border-gray-700">
          <div>
            <p className="font-medium text-gray-700 dark:text-gray-300">
              {language === 'en' ? 'Simulate Offline Mode' : 'Offline-Modus simulieren'}
            </p>
            <p className="text-sm text-gray-500">
              {language === 'en' ? 'Test app behavior without connection' : 'App-Verhalten ohne Verbindung testen'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsOffline(!isOffline)}
            aria-label="Toggle Offline Mode"
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 ${
              isOffline ? 'bg-red-500' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isOffline ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          {language === 'en' 
            ? 'Settings are automatically saved to your browser storage.' 
            : 'Einstellungen werden automatisch im Browser gespeichert.'}
        </p>
      </div>
    </div>
  );
};

export default Settings;
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/pages/Upload.tsx:
```tsx
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { en } from '../i18n/en';
import { de } from '../i18n/de';
import { CloudArrowUpIcon } from '@heroicons/react/24/solid';

const Upload: React.FC = () => {
  const { language } = useAppContext();
  const t = language === 'en' ? en : de;

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        {t.upload.title}
      </h1>
      
      <div className="space-y-6">
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-12 text-center hover:border-[var(--accent-primary)] transition-colors">
          <input
            type="file"
            id="photo-upload"
            className="hidden"
            accept="image/png, image/jpeg"
          />
          <label
            htmlFor="photo-upload"
            className="cursor-pointer flex flex-col items-center"
          >
            <CloudArrowUpIcon className="w-12 h-12 text-gray-400 mb-4" />
            <span className="text-lg font-medium text-gray-700 dark:text-gray-200">
              {t.upload.dropzone}
            </span>
            <span className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {t.upload.helper}
            </span>
          </label>
        </div>

        <button
          disabled
          className="w-full py-3 px-4 bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-600 font-semibold rounded-lg cursor-not-allowed"
        >
          {t.upload.submit}
        </button>
      </div>
    </div>
  );
};

export default Upload;
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/types/index.ts:
```typescript
export type Theme = 'light' | 'dark';
export type Accent = 'ocean' | 'sunset' | 'forest';
export type Language = 'en' | 'de';
export type Category = 'Portrait' | 'Nature' | 'Urban';

export interface GalleryItem {
  id: string;
  titleKey: string;
  date: string;
  category: Category;
  imageUrl: string;
  tags: string[];
}

export interface AppState {
  theme: Theme;
  accent: Accent;
  language: Language;
  isOffline: boolean;
}
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/utils/offlineCache.ts:
```typescript
const CACHE_KEY = 'lumen.offlineCache';

export const cacheAsset = (key: string, data: string): void => {
  try {
    const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
    cache[key] = data;
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (error) {
    console.error('Failed to cache asset:', error);
  }
};

export const getAsset = (key: string): string | null => {
  try {
    const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
    return cache[key] || null;
  } catch (error) {
    console.error('Failed to retrieve asset:', error);
    return null;
  }
};
```

