import { Link } from 'react-router-dom';
import { 
  PhotoIcon, 
  CloudArrowUpIcon, 
  ShieldCheckIcon 
} from '@heroicons/react/24/solid';
import { useLanguage } from '../contexts/LanguageContext';
import Button from '../components/ui/Button';

const HomePage = () => {
  const { t } = useLanguage();

  const features = [
    {
      title: t('home.features.quality'),
      description: t('home.features.qualityDesc'),
      icon: PhotoIcon,
    },
    {
      title: t('home.features.upload'),
      description: t('home.features.uploadDesc'),
      icon: CloudArrowUpIcon,
    },
    {
      title: t('home.features.secure'),
      description: t('home.features.secureDesc'),
      icon: ShieldCheckIcon,
    },
  ];

  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 text-center bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6">
            {t('home.welcome')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
            {t('home.subheading')}
          </p>
          <Link to="/gallery">
            <Button className="text-lg px-8 py-4">
              {t('home.cta')}
            </Button>
          </Link>

        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="sr-only">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-[var(--color-accent-primary)]/10 rounded-lg flex items-center justify-center mb-6">
                <feature.icon className="w-6 h-6 text-[var(--color-accent-primary)]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default HomePage;