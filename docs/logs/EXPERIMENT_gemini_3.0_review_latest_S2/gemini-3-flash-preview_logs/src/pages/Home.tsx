import React from 'react';
import Hero from '../components/home/Hero';
import About from '../components/home/About';
import Portfolio from '../components/home/Portfolio';
import Services from '../components/home/Services';
import Contact from '../components/home/Contact';

const Home: React.FC = () => {
  return (
    <main className="bg-black">
      <div className="animate-fade-in">
        <Hero />
      </div>
      <div className="reveal">
        <About />
      </div>
      <div className="reveal">
        <Portfolio />
      </div>
      <div className="reveal">
        <Services />
      </div>
      <div className="reveal">
        <Contact />
      </div>
    </main>
  );
};

export default Home;