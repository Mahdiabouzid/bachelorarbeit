import React from 'react';
import { twMerge } from 'tailwind-merge';

interface GoldButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'solid' | 'outline';
  children: React.ReactNode;
}

const GoldButton: React.FC<GoldButtonProps> = ({ 
  variant = 'solid', 
  children, 
  className, 
  ...props 
}) => {
  const baseStyles = "px-6 py-3 font-medium transition-all duration-300 uppercase tracking-widest text-sm";
  const variants = {
    solid: "bg-[#D4AF37] text-black hover:bg-[#C5A028] border border-[#D4AF37]",
    outline: "bg-transparent text-[#D4AF37] border border-[#D4AF37] hover:bg-[#D4AF37] hover:text-black"
  };

  return (
    <button 
      className={twMerge(baseStyles, variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
};

export default GoldButton;