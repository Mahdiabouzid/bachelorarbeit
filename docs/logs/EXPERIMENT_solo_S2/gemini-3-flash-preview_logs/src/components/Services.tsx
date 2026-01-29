import React from 'react';
import { Palette, Layout, PenTool } from 'lucide-react';

const services = [
  {
    title: "Branding",
    description: "Crafting unique visual identities that resonate with your audience and stand the test of time.",
    icon: <Palette className="w-12 h-12 text-[#D4AF37]" />
  },
  {
    title: "UI/UX Design",
    description: "Designing intuitive digital interfaces that prioritize user experience and business goals.",
    icon: <Layout className="w-12 h-12 text-[#D4AF37]" />
  },
  {
    title: "Illustration",
    description: "Bespoke digital and traditional illustrations that add a unique touch to any project.",
    icon: <PenTool className="w-12 h-12 text-[#D4AF37]" />
  }
];

const Services: React.FC = () => {
  return (
    <section id="services" className="py-24 bg-white text-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold uppercase tracking-tighter">Services</h2>
          <div className="h-1 w-12 bg-[#D4AF37] mx-auto mt-4"></div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-12">
          {services.map((service) => (
            <div key={service.title} className="p-8 border border-gray-100 hover:border-[#D4AF37] transition-colors group">
              <div className="mb-6">{service.icon}</div>
              <h3 className="text-2xl font-bold uppercase mb-4">{service.title}</h3>
              <p className="text-gray-600 leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;