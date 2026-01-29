import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto py-4 px-6 flex items-center justify-between">
        {/* Logo */}        
        <Link to="/" className="text-2xl font-bold text-black" aria-label="PRIM-Agency">PRIM-Agency</Link>

        {/* Navigation Links (Desktop) */}
        <nav className="hidden md:flex space-x-6">
          <Link to="/" className="hover:text-gray-500">Home</Link>
          <Link to="/pricing" className="hover:text-gray-500">Pricing</Link>
          <Link to="/contact" className="hover:text-gray-500">Contact</Link>
        </nav>

        {/* Hamburger Menu (Mobile) */}
        <button
          className="md:hidden text-black focus:outline-none"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        >
          <Bars3Icon className="h-6 w-6" />
        </button>
      </div>

      {/* Slide-over Menu (Mobile) */}
      <div className={`fixed top-0 right-0 h-full w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between p-4">
          <span className="text-lg font-semibold">Menu</span>
          <button
            className="text-black focus:outline-none"
            onClick={toggleMenu}
            aria-label="Close menu"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <nav className="flex flex-col p-4 space-y-4">
          <Link to="/" className="hover:text-gray-500" onClick={toggleMenu}>Home</Link>
          <Link to="/pricing" className="hover:text-gray-500" onClick={toggleMenu}>Pricing</Link>
          <Link to="/contact" className="hover:text-gray-500" onClick={toggleMenu}>Contact</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
