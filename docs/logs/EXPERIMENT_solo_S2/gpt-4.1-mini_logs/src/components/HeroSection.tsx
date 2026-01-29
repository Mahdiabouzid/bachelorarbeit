import React from 'react';

export const HeroSection: React.FC = () => {
  return (
    <section
      id="hero"
      className="relative h-screen flex items-center justify-center text-center text-white"
      aria-label="Hero Section"
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1470&q=80)' }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-black bg-opacity-60" aria-hidden="true" />
      <div className="relative z-10 max-w-4xl px-6">
        <h1 className="text-6xl md:text-8xl font-extrabold tracking-wide mb-4 font-sans">Alex Rivera</h1>
        <p className="text-2xl md:text-3xl font-light italic tracking-wide">Designing Visual Stories</p>
      </div>
    </section>
  );
};
