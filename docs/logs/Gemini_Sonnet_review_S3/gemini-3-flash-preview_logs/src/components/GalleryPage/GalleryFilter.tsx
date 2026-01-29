import { useLanguage } from '../../contexts/LanguageContext';

interface GalleryFilterProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const GalleryFilter = ({ activeFilter, onFilterChange }: GalleryFilterProps) => {
  const { t } = useLanguage();

  const filters = [
    { id: 'all', label: t('gallery.tags.all') },
    { id: 'portrait', label: t('gallery.tags.portrait') },
    { id: 'nature', label: t('gallery.tags.nature') },
    { id: 'urban', label: t('gallery.tags.urban') },
  ];

  return (
    <nav className="flex flex-wrap gap-2 mb-8" aria-label={t('gallery.filterLabel')}>
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeFilter === filter.id
              ? 'bg-[var(--color-accent-primary)] text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          {filter.label}
        </button>
      ))}
    </nav>
  );
};

export default GalleryFilter;