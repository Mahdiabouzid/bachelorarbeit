import React from 'react';

const Hero = () => {
  return (
    <section id="home" className="relative h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url('https://images.unsplash.com/photo-1607704273424-c49e3739dd7f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')` }}>
      <div className="absolute inset-0 bg-black-rgba"></div>
      <div className="container mx-auto text-center relative z-10">
        <h1 className="text-5xl font-bold text-white">Alex Rivera</h1>
        <p className="text-2xl text-gold mt-4">Designing Visual Stories</p>
      </div>
    </section>
  );
};

export default Hero;
