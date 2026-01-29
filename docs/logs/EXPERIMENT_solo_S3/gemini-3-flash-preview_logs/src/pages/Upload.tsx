import React from 'react';
import { useApp } from '../context/AppContext';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';

export const Upload = () => {
  const { t } = useApp();
  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-4">{t.upload.title}</h1>
        <p className="text-slate-600 dark:text-slate-400">{t.upload.description}</p>
      </div>

      <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-12 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800/30">
        <CloudArrowUpIcon className="w-16 h-16 text-slate-400 mb-4" />
        <label className="cursor-pointer bg-accent text-white px-6 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity mb-4">
          {t.upload.picker}
          <input type="file" className="hidden" disabled />
        </label>
        <p className="text-sm text-slate-500">{t.upload.helper}</p>
      </div>

      <button 
        disabled 
        className="w-full mt-8 bg-slate-200 dark:bg-slate-800 text-slate-400 py-4 rounded-xl font-bold cursor-not-allowed"
      >
        {t.upload.button}
      </button>
    </div>
  );
};