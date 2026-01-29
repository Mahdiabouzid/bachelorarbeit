import React from 'react';
import { ChevronDown } from 'lucide-react';

const Hero: React.FC = () => {
  const handleScrollDown = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="home"
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1920&h=1080&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-4 animate-fadeInUp">
          <span className="text-white">Alex </span>
          <span className="text-gold">Rivera</span>
        </h1>
        <p
          className="text-xl sm:text-2xl md:text-3xl text-gray-300 italic font-light animate-fadeInUp"
          style={{ animationDelay: '0.2s', opacity: 0 }}
        >
          Designing Visual Stories
        </p>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={handleScrollDown}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 text-gold animate-bounce-slow cursor-pointer hover:opacity-80 transition-opacity"
        aria-label="Scroll down"
      >
        <ChevronDown size={40} />
      </button>
    </section>
  );
};

export default Hero;
