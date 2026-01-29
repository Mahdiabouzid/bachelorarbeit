import React from 'react';
import { useAppContext } from '../context/AppContext';
import { en } from '../i18n/en';
import { de } from '../i18n/de';

const About: React.FC = () => {
  const { language } = useAppContext();
  const t = language === 'en' ? en : de;

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        {t.about.title}
      </h1>
      <div className="prose dark:prose-invert">
        <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
          {t.about.description}
        </p>
      </div>
    </div>
  );
};

export default About;