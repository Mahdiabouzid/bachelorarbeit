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