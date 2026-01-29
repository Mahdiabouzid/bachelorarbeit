import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const navigation = {
    main: [
      { name: 'Home', href: '/' },
      { name: 'Pricing', href: '/pricing' },
      { name: 'Contact', href: '/contact' },
    ],
    social: [
      { name: 'Twitter', href: '#', icon: Twitter },
      { name: 'GitHub', href: '#', icon: Github },
      { name: 'LinkedIn', href: '#', icon: Linkedin },
    ],
  };

  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="mx-auto max-w-7xl overflow-hidden px-6 py-12 sm:py-16 lg:px-8">
        <nav className="-mb-6 flex flex-wrap justify-center gap-x-12 gap-y-3 text-sm leading-6" aria-label="Footer">
          {navigation.main.map((item) => (
            <Link key={item.name} to={item.href} className="text-gray-600 hover:text-blue-600 transition-colors">
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="mt-10 flex justify-center gap-x-10">
          {navigation.social.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-gray-400 hover:text-gray-500 transition-colors"
              aria-label={item.name}
            >
              <item.icon className="h-6 w-6" aria-hidden="true" />
            </a>
          ))}
        </div>
        <p className="mt-10 text-center text-xs leading-5 text-gray-500">
          &copy; {currentYear} PRIM-Agency, Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;