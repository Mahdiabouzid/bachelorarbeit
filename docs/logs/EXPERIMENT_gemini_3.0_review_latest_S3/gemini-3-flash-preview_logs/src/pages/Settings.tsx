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