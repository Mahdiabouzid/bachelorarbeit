import React from 'react';

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 bg-black-rgba text-white py-4">
      <div className="container mx-auto flex items-center justify-between">
        <a href="#home" className="text-2xl font-bold">Alex Rivera</a>
        <ul className="flex space-x-6">
          <li><a href="#home" className="hover:text-gold transition-colors">Home</a></li>
          <li><a href="#about" className="hover:text-gold transition-colors">About</a></li>
          <li><a href="#portfolio" className="hover:text-gold transition-colors">Portfolio</a></li>
          <li><a href="#services" className="hover:text-gold transition-colors">Services</a></li>
          <li><a href="#contact" className="hover:text-gold transition-colors">Contact</a></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
