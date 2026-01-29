import React from 'react';
import { CheckIcon } from '@heroicons/react/24/solid';

interface PricingCardProps {
  name: string;
  price: string;
  description: string;
  features: string[];
  isRecommended?: boolean;
  billingCycle: string;
}

const PricingCard: React.FC<PricingCardProps> = ({ 
  name, 
  price, 
  description, 
  features, 
  isRecommended, 
  billingCycle 
}) => {
  return (
    <div className={`relative flex flex-col p-8 bg-white border rounded-2xl shadow-sm ${
      isRecommended ? 'border-indigo-600 ring-2 ring-indigo-600' : 'border-gray-200'
    }`}>
      {isRecommended && (
        <span className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 px-4 py-1 text-sm font-semibold text-white bg-indigo-600 rounded-full">
          Recommended
        </span>
      )}
      
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-900">{name}</h3>
        <p className="mt-2 text-gray-500">{description}</p>
        <p className="mt-6">
          <span className="text-4xl font-bold tracking-tight text-gray-900">{price}</span>
          <span className="text-base font-medium text-gray-500">/{billingCycle}</span>
        </p>
      </div>

      <ul className="flex-1 space-y-4 mb-8">
        {features.map((feature) => (
          <li key={feature} className="flex items-start">
            <CheckIcon className="h-5 w-5 text-indigo-500 shrink-0" aria-hidden="true" />
            <span className="ml-3 text-sm text-gray-600">{feature}</span>
          </li>
        ))}
      </ul>

      <button
        className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
          isRecommended 
            ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
            : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
        }`}
        aria-label={`Get Started with ${name}`}
      >
        Get Started
      </button>
    </div>
  );
};

export default PricingCard;