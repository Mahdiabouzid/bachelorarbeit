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