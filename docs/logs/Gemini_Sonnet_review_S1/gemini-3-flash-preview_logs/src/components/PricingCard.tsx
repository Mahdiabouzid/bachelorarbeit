import React from 'react';
import Button from './Button';
import { CheckIcon } from '@heroicons/react/24/solid';

interface PricingCardProps {
  plan: string;
  price: string;
  period: 'monthly' | 'yearly';
  features: string[];
  isRecommended?: boolean;
  onCTAClick?: () => void;
  ctaAriaLabel?: string;
}

const PricingCard: React.FC<PricingCardProps> = ({ 
  plan, 
  price, 
  period, 
  features, 
  isRecommended, 
  onCTAClick,
  ctaAriaLabel
}) => {

  return (
    <div className={`relative flex flex-col p-8 bg-white border rounded-2xl shadow-sm transition-transform hover:scale-105 ${isRecommended ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-50' : 'border-gray-200'}`}>
      {isRecommended && (
        <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
          Recommended
        </span>
      )}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-900">{plan}</h3>
        <div className="mt-4 flex items-baseline">
          <span className="text-4xl font-extrabold tracking-tight text-gray-900">{price}</span>
          <span className="ml-1 text-xl font-semibold text-gray-500">/{period === 'monthly' ? 'mo' : 'yr'}</span>
        </div>
      </div>
      <ul className="flex-1 space-y-4 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <CheckIcon className="h-5 w-5 text-green-500 shrink-0 mr-3" />
            <span className="text-gray-600">{feature}</span>
          </li>
        ))}
      </ul>
      <Button 
        variant={isRecommended ? 'primary' : 'outline'} 
        className="w-full" 
        onClick={onCTAClick}
        aria-label={ctaAriaLabel || `Get Started with ${plan}`}
      >

        Get Started
      </Button>
    </div>
  );
};

export default PricingCard;