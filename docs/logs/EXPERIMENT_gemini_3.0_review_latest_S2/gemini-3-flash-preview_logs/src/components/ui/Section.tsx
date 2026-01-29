import React from 'react';
import { twMerge } from 'tailwind-merge';

interface SectionProps {
  id?: string;
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
}

const Section: React.FC<SectionProps> = ({ 
  id, 
  children, 
  className, 
  containerClassName 
}) => {
  return (
    <section 
      id={id} 
      className={twMerge("py-20 px-4 sm:px-6 lg:px-8 bg-black text-white", className)}
    >
      <div className={twMerge("max-w-7xl mx-auto", containerClassName)}>
        {children}
      </div>
    </section>
  );
};

export default Section;