import React from 'react';
import { useAppContext } from '../context/AppContext';
import { en } from '../i18n/en';
import { de } from '../i18n/de';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const { language } = useAppContext();
  const t = language === 'en' ? en : de;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
        {t.home.title}
      </h1>
      <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl">
        {t.home.subtitle}
      </p>
      <Link
        to="/gallery"
        className="px-8 py-3 bg-[var(--accent-primary, #0ea5e9)] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
      >
        {t.home.cta}
      </Link>
    </div>
  );
};

export default Home;