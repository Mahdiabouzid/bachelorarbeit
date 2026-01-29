import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="py-12 border-t border-gray-900 bg-black">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
        <p className="text-gray-500 text-sm uppercase tracking-widest">
          © {new Date().getFullYear()} Alex Rivera. All Rights Reserved.
        </p>
        <div className="mt-4 md:mt-0">
          <p className="text-gray-500 text-xs uppercase tracking-[0.2em]">
            Designed with <span className="text-[#D4AF37]">Precision</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;