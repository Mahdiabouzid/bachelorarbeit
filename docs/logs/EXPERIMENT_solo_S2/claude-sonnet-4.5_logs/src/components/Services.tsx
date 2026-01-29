import React, { useEffect, useRef, useState } from 'react';
import { Palette, Layout, PenTool } from 'lucide-react';
import { services } from '../utils/data';

const Services: React.FC = () => {
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

  const iconMap: { [key: string]: React.ReactNode } = {
    palette: <Palette size={40} />,
    layout: <Layout size={40} />,
    'pen-tool': <PenTool size={40} />
  };

  return (
    <section
      id="services"
      ref={sectionRef}
      className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-black"
    >
      <div className="max-w-7xl mx-auto">
        <h2
          className={`text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-16 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          My <span className="text-gold">Services</span>
        </h2>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {services.map((service, index) => (
            <div
              key={service.id}
              className={`group relative bg-zinc-900 rounded-lg p-8 hover:bg-zinc-800 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-gold/20 cursor-pointer ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 0.2}s` }}
            >
              {/* Icon */}
              <div className="w-20 h-20 flex items-center justify-center bg-gold/10 rounded-lg mb-6 group-hover:bg-gold/20 transition-colors">
                <div className="text-gold group-hover:scale-110 transition-transform">
                  {iconMap[service.icon]}
                </div>
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-gold transition-colors">
                {service.title}
              </h3>

              {/* Description */}
              <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                {service.description}
              </p>

              {/* Decorative element */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gold/5 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
