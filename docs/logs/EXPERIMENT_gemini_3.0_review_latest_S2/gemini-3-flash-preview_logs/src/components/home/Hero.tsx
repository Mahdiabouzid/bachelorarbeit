import React from 'react';
import GoldButton from '../ui/GoldButton';

const Hero: React.FC = () => {
  return (
    <section 
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black"
    >
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=2070")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl">
        <h1 className="text-5xl md:text-8xl font-bold text-white uppercase tracking-tighter mb-6">
          Alex <span className="text-[#D4AF37]">Rivera</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 font-light tracking-widest uppercase mb-10">
          Visual Designer & Digital Architect
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <GoldButton onClick={() => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })}>
            View Portfolio
          </GoldButton>
          <GoldButton 
            variant="outline" 
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Get In Touch
          </GoldButton>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-[1px] h-12 bg-gradient-to-b from-[#D4AF37] to-transparent"></div>
      </div>
    </section>
  );
};

export default Hero;