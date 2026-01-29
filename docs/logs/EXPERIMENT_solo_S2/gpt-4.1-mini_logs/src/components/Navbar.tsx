import React, { useState, useEffect } from 'react';

const navLinks = [
  { name: 'Home', href: '#hero' },
  { name: 'About', href: '#about' },
  { name: 'Portfolio', href: '#portfolio' },
  { name: 'Services', href: '#services' },
  { name: 'Contact', href: '#contact' },
];

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, href: string) => {
    e.preventDefault();
    const id = href.replace('#', '');
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-colors duration-500 ${
        scrolled ? 'bg-black bg-opacity-90 shadow-lg' : 'bg-transparent'
      }`}
      aria-label="Primary Navigation"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-center space-x-8">
        {navLinks.map(({ name, href }) => (
          <a
            key={name}
            href={href}
            onClick={(e) => handleClick(e, href)}
            className="text-white uppercase font-semibold tracking-wide hover:text-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            {name}
          </a>
        ))}
      </div>
    </nav>
  );
};
