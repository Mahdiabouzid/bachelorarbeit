import React from 'react';
import { useAppContext } from '../context/AppContext';
import { en } from '../i18n/en';
import { de } from '../i18n/de';
import { CloudArrowUpIcon } from '@heroicons/react/24/solid';

const Upload: React.FC = () => {
  const { language } = useAppContext();
  const t = language === 'en' ? en : de;

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        {t.upload.title}
      </h1>
      
      <div className="space-y-6">
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-12 text-center hover:border-[var(--accent-primary)] transition-colors">
          <input
            type="file"
            id="photo-upload"
            className="hidden"
            accept="image/png, image/jpeg"
          />
          <label
            htmlFor="photo-upload"
            className="cursor-pointer flex flex-col items-center"
          >
            <CloudArrowUpIcon className="w-12 h-12 text-gray-400 mb-4" />
            <span className="text-lg font-medium text-gray-700 dark:text-gray-200">
              {t.upload.dropzone}
            </span>
            <span className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {t.upload.helper}
            </span>
          </label>
        </div>

        <button
          disabled
          className="w-full py-3 px-4 bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-600 font-semibold rounded-lg cursor-not-allowed"
        >
          {t.upload.submit}
        </button>
      </div>
    </div>
  );
};

export default Upload;