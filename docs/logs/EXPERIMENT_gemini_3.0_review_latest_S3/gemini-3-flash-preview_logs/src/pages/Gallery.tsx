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