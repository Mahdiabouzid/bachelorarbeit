import React from 'react';
import * as LucideIcons from 'lucide-react';
import { SocialLink } from '../data/portfolioData';

const SocialIcon: React.FC<SocialLink> = ({ platform, url, iconName }) => {
  const IconComponent = (LucideIcons as any)[iconName];

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-[#D4AF37] text-white hover:bg-[#D4AF37] hover:text-black transition-all duration-300"
      aria-label={`Follow Alex Rivera on ${platform}`}
    >
      {IconComponent && <IconComponent size={20} />}
    </a>
  );
};

export default SocialIcon;