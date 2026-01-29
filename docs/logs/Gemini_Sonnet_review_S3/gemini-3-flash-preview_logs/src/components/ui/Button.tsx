import { ButtonHTMLAttributes, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  children: ReactNode;
}

const Button = ({ variant = 'primary', children, className, ...props }: ButtonProps) => {
  const baseStyles = 'px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-[var(--color-accent-primary)] text-white hover:bg-[var(--color-accent-secondary)] focus:ring-[var(--color-accent-primary)]',
    outline: 'border-2 border-[var(--color-accent-primary)] text-[var(--color-accent-primary)] hover:bg-[var(--color-accent-primary)] hover:text-white',
    ghost: 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
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

export default Button;