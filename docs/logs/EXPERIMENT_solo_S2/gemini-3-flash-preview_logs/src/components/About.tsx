import React from 'react';

const About: React.FC = () => {
  const skills = ['Adobe Creative Suite', 'Figma', 'Brand Strategy', 'Typography', 'UI/UX Design', 'Motion Graphics'];

  return (
    <section id="about" className="py-24 bg-white text-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-full h-full border-2 border-[#D4AF37] z-0"></div>
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800" 
              alt="Alex Rivera" 
              className="relative z-10 w-full grayscale hover:grayscale-0 transition-all duration-700"
            />
          </div>
          
          <div>
            <h2 className="text-4xl font-bold mb-6 uppercase tracking-tighter">About Me</h2>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              I am a freelance graphic designer based in New York, specializing in creating cohesive brand identities and digital experiences. With over 8 years of experience, I blend artistic intuition with strategic thinking to help brands tell their unique stories.
            </p>
            
            <h3 className="text-xl font-bold mb-4 text-[#D4AF37] uppercase tracking-widest">Expertise</h3>
            <div className="grid grid-cols-2 gap-4">
              {skills.map((skill) => (
                <div key={skill} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-[#D4AF37]"></div>
                  <span className="text-sm font-medium uppercase tracking-tight">{skill}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;