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
