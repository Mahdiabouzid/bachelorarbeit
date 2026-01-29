import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import Button from '../components/ui/Button';

const UploadPage: React.FC = () => {
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <main className="flex-1 container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          {t('upload.title')}
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label 
                htmlFor="photo-upload" 
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {t('upload.label')}
              </label>
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                className="block w-full text-sm text-gray-500 dark:text-gray-400
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-[var(--color-accent-primary)] file:text-white
                  hover:file:bg-[var(--color-accent-secondary)]
                  cursor-pointer"
              />
            </div>

            <div className="pt-2">
              <Button 
                type="submit" 
                disabled 
                className="w-full justify-center py-3"
              >
                {t('upload.button')}
              </Button>
            </div>

            <p className="text-sm text-center text-gray-500 dark:text-gray-400 italic">
              {t('upload.demoNote')}
            </p>
          </form>
        </div>
      </div>
    </main>
  );
};

export default UploadPage;