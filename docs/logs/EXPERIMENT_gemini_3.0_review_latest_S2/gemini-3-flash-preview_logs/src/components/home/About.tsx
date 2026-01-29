import React from 'react';
import Section from '../ui/Section';
import Heading from '../ui/Heading';

const skills = [
  'Adobe Creative Suite', 'Figma', 'React / Next.js', 
  'Tailwind CSS', 'Brand Identity', 'UI/UX Design', 
  '3D Modeling', 'Motion Graphics', 'Typography'
];

const About: React.FC = () => {
  return (
    <Section id="about" className="bg-[#0a0a0a]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Image Column */}
        <div className="relative group">
          <div className="absolute -inset-4 border border-[#D4AF37]/30 translate-x-2 translate-y-2 transition-transform group-hover:translate-x-0 group-hover:translate-y-0"></div>
          <img 
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800"
            alt="Alex Rivera Professional Portrait"
            className="relative z-10 w-full grayscale hover:grayscale-0 transition-all duration-700 object-cover aspect-[4/5]"
          />
        </div>

        {/* Text Column */}
        <div>
          <Heading 
            title="About Me" 
            subtitle="Crafting digital experiences that blend artistic vision with technical precision."
          />
          
          <div className="space-y-6 text-gray-400 text-lg leading-relaxed">
            <p>
              With over a decade of experience in the design industry, I've helped brands transform their digital presence through thoughtful aesthetics and user-centric solutions.
            </p>
            <p>
              My approach is rooted in the belief that great design is not just how it looks, but how it functions and feels. I specialize in creating high-end visual identities and seamless digital interfaces for luxury brands and innovative startups.
            </p>
          </div>

          <div className="mt-12">
            <h3 className="text-[#D4AF37] uppercase tracking-widest text-sm font-bold mb-6">Tools & Expertise</h3>
            <div className="flex flex-wrap gap-3">
              {skills.map((skill) => (
                <span 
                  key={skill}
                  className="px-4 py-2 border border-white/10 bg-white/5 text-white text-xs uppercase tracking-widest hover:border-[#D4AF37] transition-colors cursor-default"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default About;