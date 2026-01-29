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