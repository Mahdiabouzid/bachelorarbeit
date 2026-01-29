import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { en } from '../i18n/en';
import { de } from '../i18n/de';

const Header: React.FC = () => {
  const { language } = useAppContext();
  const t = language === 'en' ? en : de;

  const navItems = [
    { path: '/', label: t.nav.home },
    { path: '/gallery', label: t.nav.gallery },
    { path: '/upload', label: t.nav.upload },
    { path: '/about', label: t.nav.about },
    { path: '/settings', label: t.nav.settings },
  ];

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <span className="text-2xl font-bold text-[var(--accent-primary)]">Lumen</span>
          </div>
          <nav className="hidden sm:flex space-x-8">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'border-[var(--accent-primary)] text-gray-900 dark:text-white'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          {/* Mobile menu button could go here, but keeping it simple per requirements */}
        </div>
      </div>
    </header>
  );
};

export default Header;