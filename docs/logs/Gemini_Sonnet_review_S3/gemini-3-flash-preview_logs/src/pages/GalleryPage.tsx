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