import React from 'react';
import { twMerge } from 'tailwind-merge';

interface HeadingProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

const Heading: React.FC<HeadingProps> = ({ 
  title, 
  subtitle, 
  centered = false, 
  className 
}) => {
  return (
    <div className={twMerge("mb-12", centered ? "text-center" : "text-left", className)}>
      <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-tighter mb-4">
        {title}
        <span className="block h-1 w-12 bg-[#D4AF37] mt-2" style={{ margin: centered ? '0.5rem auto 0' : '0.5rem 0 0' }}></span>
      </h2>
      {subtitle && (
        <p className="text-gray-400 max-w-2xl mt-4 text-lg">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default Heading;