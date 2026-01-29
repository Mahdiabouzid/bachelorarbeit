import React from 'react';
import { twMerge } from 'tailwind-merge';

interface SectionContainerProps {
  children: React.ReactNode;
  id: string;
  className?: string;
  backgroundColor?: 'black' | 'white' | 'dark-gray';
}

const SectionContainer: React.FC<SectionContainerProps> = ({
  children,
  id,
  className,
  backgroundColor = 'white',
}) => {
  const bgStyles = {
    black: 'bg-black text-white',
    white: 'bg-white text-black',
    'dark-gray': 'bg-[#1a1a1a] text-white',
  };

  return (
    <section
      id={id}
      className={twMerge(
        'py-20 px-6 md:px-12 lg:px-24 min-h-fit',
        bgStyles[backgroundColor],
        className
      )}
    >
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </section>
  );
};

export default SectionContainer;