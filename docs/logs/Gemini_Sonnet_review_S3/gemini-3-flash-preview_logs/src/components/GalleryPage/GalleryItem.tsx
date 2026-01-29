import { GalleryItem as GalleryItemType } from '../../data/gallery';
import { useLanguage } from '../../contexts/LanguageContext';

interface GalleryItemProps {
  item: GalleryItemType;
}

const GalleryItem = ({ item }: GalleryItemProps) => {
  const { t, formatDate } = useLanguage();

  return (
    <article 
      data-testid="gallery-item"
      className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
    >
      <div className="aspect-[4/3] overflow-hidden bg-gray-200 dark:bg-gray-700">
        <img
          src={item.placeholder}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
          {item.title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
          {t('gallery.takenOn')} {formatDate(item.date)}
        </p>
        <div className="flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded"
            >
              {t(`gallery.tags.${tag}`)}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
};

export default GalleryItem;