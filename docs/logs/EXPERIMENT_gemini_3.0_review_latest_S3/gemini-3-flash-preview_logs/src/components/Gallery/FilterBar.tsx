import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { en } from '../../i18n/en';
import { de } from '../../i18n/de';


interface FilterBarProps {
  currentFilter: string;
  onFilterChange: (filter: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ currentFilter, onFilterChange }) => {
  const { language } = useAppContext();
  const t = language === 'en' ? en : de;

  const categories = ['All', 'Portrait', 'Nature', 'Urban'];

  return (
    <div className="mb-8 flex items-center gap-4">
      <label htmlFor="category-filter" className="font-medium text-gray-700 dark:text-gray-300">
        Filter:
      </label>
      <select
        id="category-filter"
        aria-label="Filter"
        value={currentFilter}
        onChange={(e) => onFilterChange(e.target.value)}
        className="rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-accent-primary focus:outline-none focus:ring-accent-primary sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
      >
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterBar;