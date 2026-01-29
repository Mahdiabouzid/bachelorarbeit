import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export const Home = () => {
  const { t } = useApp();
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-accent to-slate-400 bg-clip-text text-transparent">
        {t.home.title}
      </h1>
      <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mb-10">
        {t.home.subtitle}
      </p>
      <Link
        to="/gallery"
        className="bg-accent hover:opacity-90 text-white px-8 py-4 rounded-full text-lg font-bold transition-all transform hover:scale-105 shadow-lg"
      >
        {t.home.cta}
      </Link>
    </div>
  );
};