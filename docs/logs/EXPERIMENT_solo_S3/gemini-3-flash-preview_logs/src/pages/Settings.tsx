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
            data-testid="offline-toggle"
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