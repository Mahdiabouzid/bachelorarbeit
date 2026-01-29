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