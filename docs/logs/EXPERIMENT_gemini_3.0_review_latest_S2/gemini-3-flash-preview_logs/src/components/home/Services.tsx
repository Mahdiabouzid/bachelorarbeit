import React from 'react';
import { Palette, Layers, PenTool } from 'lucide-react';
import Section from '../ui/Section';
import Heading from '../ui/Heading';

const services = [
  {
    title: 'Branding',
    description: 'Crafting unique visual identities that resonate with your audience and stand the test of time.',
    icon: Palette,
  },
  {
    title: 'UI/UX Design',
    description: 'Designing intuitive, user-centric interfaces that provide seamless digital experiences across all devices.',
    icon: Layers,
  },
  {
    title: 'Illustration',
    description: 'Creating bespoke digital illustrations and assets that bring personality and depth to your brand.',
    icon: PenTool,
  },
];

const Services: React.FC = () => {
  return (
    <Section id="services" className="bg-[#0a0a0a]">
      <Heading 
        title="Services" 
        subtitle="Specialized solutions tailored to elevate your digital presence and brand identity."
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <div 
            key={index} 
            className="group p-8 border border-white/10 bg-black hover:border-[#D4AF37]/50 transition-all duration-500"
          >
            <div className="mb-6 inline-block">
              <service.icon className="w-10 h-10 text-[#D4AF37]" />
            </div>
            <h3 className="text-xl font-bold uppercase tracking-wider mb-4 group-hover:text-[#D4AF37] transition-colors">
              {service.title}
            </h3>
            <p className="text-gray-400 leading-relaxed">
              {service.description}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
};

export default Services;