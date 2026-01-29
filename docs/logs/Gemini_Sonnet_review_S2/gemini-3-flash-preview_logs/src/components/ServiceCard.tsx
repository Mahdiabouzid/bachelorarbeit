import React from 'react';
import * as LucideIcons from 'lucide-react';
import { Service } from '../data/portfolioData';

interface ServiceCardProps {
  service: Service;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  // Dynamically get the icon component
  const IconComponent = (LucideIcons as any)[service.iconName];

  return (
    <article className="group p-8 bg-black border border-gray-800 transition-all duration-500 hover:border-[#D4AF37] hover:-translate-y-2">
      <div className="mb-6 inline-block p-4 bg-[#1a1a1a] rounded-lg text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-black transition-colors duration-500">
        {IconComponent && <IconComponent size={32} />}
      </div>
      <h3 className="text-xl font-bold text-white mb-4 group-hover:text-[#D4AF37] transition-colors">
        {service.title}
      </h3>
      <p className="text-gray-400 leading-relaxed">
        {service.description}
      </p>
    </article>
  );
};

export default ServiceCard;