import React from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';

const HeroSection: React.FC = () => {
  return (
    <header 
      id="hero" 
      className="relative h-screen w-full flex items-center justify-center overflow-hidden"
    >
      {/* Background Image with Parallax Effect */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=1920")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="relative z-10 text-center px-6">
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-[#D4AF37] mb-4 tracking-tighter">
          Alex Rivera
        </h1>
        <p className="text-xl md:text-2xl text-white font-light tracking-[0.2em] uppercase">
          Designing Visual Stories
        </p>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <a 
          href="#about" 
          aria-label="Scroll down to about section"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <ChevronDownIcon className="w-8 h-8 text-[#D4AF37]" />
        </a>
      </div>
    </header>
  );
};

export default HeroSection;