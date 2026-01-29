import { UserCircleIcon } from '@heroicons/react/24/solid';
import { useLanguage } from '../contexts/LanguageContext';

const AboutPage = () => {
  const { t } = useLanguage();

  const teamMembers = [
    { id: 'ceo', key: 'about.members.ceo' },
    { id: 'cto', key: 'about.members.cto' },
    { id: 'design', key: 'about.members.design' },
  ];

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-12 text-gray-800 dark:text-gray-200">
      <section className="space-y-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          {t('about.title')}
        </h1>
        <p className="text-lg leading-relaxed">
          {t('about.mission')}
        </p>
        <p className="text-lg leading-relaxed">
          {t('about.values')}
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          {t('about.story')}
        </h2>
        <p className="text-lg leading-relaxed">
          {t('about.storyContent')}
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          {t('about.team')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {teamMembers.map((member) => (
            <div 
              key={member.id} 
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center border border-gray-100 dark:border-gray-700 transition-transform hover:scale-105"
            >
              <UserCircleIcon className="w-20 h-20 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {t(`${member.key}.name`)}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {t(`${member.key}.role`)}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default AboutPage;