import { Instagram, Linkedin, Dribbble } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white py-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-8 md:mb-0">
          <a href="#" className="text-2xl font-bold tracking-tighter">
            ALEX<span className="text-amber-500">RIVERA</span>
          </a>
          <p className="mt-2 text-gray-500 text-sm">
            Crafting digital experiences with precision and soul.
          </p>
        </div>

        <div className="flex flex-col items-center md:items-end">
          <div className="flex space-x-6 mb-4">
            <a href="#" className="text-gray-400 hover:text-amber-500 transition-colors">
              <Instagram size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-amber-500 transition-colors">
              <Linkedin size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-amber-500 transition-colors">
              <Dribbble size={20} />
            </a>
          </div>
          <p className="text-gray-600 text-xs">
            © {currentYear} Alex Rivera. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;