import React from 'react';
import SectionContainer from './SectionContainer';
import { bio, tools } from '../data/portfolioData';
import useScrollAnimation from '../hooks/useScrollAnimation';

const AboutSection: React.FC = () => {
  const { elementRef: imgRef, isVisible: imgVisible } = useScrollAnimation(0.2);
  const { elementRef: textRef, isVisible: textVisible } = useScrollAnimation(0.2);

  return (
    <SectionContainer id="about" backgroundColor="white">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        <div 
          ref={imgRef}
          className={`relative transition-all duration-1000 transform ${imgVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >

          <div className="aspect-square rounded-full overflow-hidden border-8 border-[#D4AF37]/20">
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800" 
              alt="Alex Rivera Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-[#D4AF37] rounded-full -z-10 hidden md:block" />
        </div>

        <div 
          ref={textRef}
          className={`transition-all duration-1000 delay-300 transform ${textVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <h2 className="text-[#D4AF37] text-sm font-bold tracking-widest uppercase mb-4">About Me</h2>

          <h3 className="text-4xl font-bold mb-8">Crafting identities through thoughtful design.</h3>
          
          <div className="space-y-6 text-gray-600 leading-relaxed">
            {bio.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-12">
            <h4 className="text-lg font-bold mb-6">My Toolkit</h4>
            <div className="flex flex-wrap gap-3">
              {tools.map((tool) => (
                <span 
                  key={tool} 
                  className="px-4 py-2 border-2 border-[#D4AF37] text-black text-sm font-medium rounded-full"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
};

export default AboutSection;