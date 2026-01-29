import React, { useEffect, useRef, useState } from 'react';
import {
  SiAdobe,
  SiFigma,
  SiSketch
} from '@icons-pack/react-simple-icons';

import { aboutText } from '../utils/data';

const About: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const tools = [
    { name: 'Adobe Illustrator', Icon: SiAdobe },
    { name: 'Adobe Photoshop', Icon: SiAdobe },
    { name: 'Figma', Icon: SiFigma },
    { name: 'Adobe XD', Icon: SiAdobe },
    { name: 'InDesign', Icon: SiAdobe },
    { name: 'Sketch', Icon: SiSketch }
  ];


  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-black"
    >
      <div className="max-w-7xl mx-auto">
        <h2
          className={`text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-16 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          About <span className="text-gold">Me</span>
        </h2>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Photo */}
          <div
            className={`transition-all duration-1000 delay-200 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
            }`}
          >
            <div className="relative w-full max-w-md mx-auto">
              <div className="aspect-square rounded-full overflow-hidden border-4 border-gold shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=600&fit=crop"
                  alt="Alex Rivera"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Decorative element */}
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gold/20 rounded-full blur-3xl" />
            </div>
          </div>

          {/* Bio and Tools */}
          <div
            className={`transition-all duration-1000 delay-400 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
            }`}
          >
            <div className="space-y-6">
              {aboutText.split('\n\n').map((paragraph, index) => (
                <p key={index} className="text-gray-300 text-base md:text-lg leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Tools & Technologies */}
            <div className="mt-10">
              <h3 className="text-2xl font-semibold mb-6 text-gold">Tools & Technologies</h3>
              <div className="grid grid-cols-3 gap-6">
                {tools.map(({ name, Icon }, index) => (
                  <div
                    key={name}
                    className="flex flex-col items-center group cursor-pointer"
                    style={{
                      animation: isVisible ? `fadeInUp 0.6s ease-out ${0.6 + index * 0.1}s forwards` : 'none',
                      opacity: isVisible ? 1 : 0
                    }}
                  >
                    <div className="w-16 h-16 flex items-center justify-center bg-white/5 rounded-lg group-hover:bg-gold/20 transition-all duration-300 group-hover:scale-110">
                      <Icon className="w-8 h-8 text-white group-hover:text-gold transition-colors" />
                    </div>
                    <span className="text-xs text-gray-400 mt-2 text-center group-hover:text-gold transition-colors">
                      {name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
