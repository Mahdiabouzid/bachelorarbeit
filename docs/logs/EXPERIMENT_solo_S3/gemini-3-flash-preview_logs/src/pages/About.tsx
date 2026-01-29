import React from 'react';
import { useApp } from '../context/AppContext';

export const About = () => {
  const { t } = useApp();
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">{t.about.title}</h1>
      <div className="prose dark:prose-invert lg:prose-xl">
        <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
          {t.about.content}
        </p>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <div className="text-accent font-bold text-3xl mb-2">12M+</div>
            <div className="text-sm text-slate-500">Photos Shared</div>
          </div>
          <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <div className="text-accent font-bold text-3xl mb-2">500K</div>
            <div className="text-sm text-slate-500">Photographers</div>
          </div>
          <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <div className="text-accent font-bold text-3xl mb-2">99.9%</div>
            <div className="text-sm text-slate-500">Uptime</div>
          </div>
        </div>
      </div>
    </div>
  );
};