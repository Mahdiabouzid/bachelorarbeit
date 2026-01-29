import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black py-8 px-4 sm:px-6 lg:px-8 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-gray-400 text-sm">
          © {currentYear} Alex Rivera. All rights reserved.
        </p>
        <p className="text-gray-500 text-xs mt-2">
          Designed with <span className="text-gold">♥</span> and passion
        </p>
      </div>
    </footer>
  );
};

export default Footer;
