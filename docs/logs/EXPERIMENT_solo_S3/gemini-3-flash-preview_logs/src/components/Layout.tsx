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