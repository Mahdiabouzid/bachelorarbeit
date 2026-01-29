import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black py-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <p className="text-gray-500 text-sm tracking-widest uppercase">
          &copy; {new Date().getFullYear()} Alex Rivera. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;