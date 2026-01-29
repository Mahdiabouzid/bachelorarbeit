import React, { useState } from 'react';
import BillingToggle from '../components/Pricing/BillingToggle';

import PricingCard from '../components/Pricing/PricingCard';

const PricingPage: React.FC = () => {
  const [isYearly, setIsYearly] = useState(false);

  const plans = [
    {
      name: 'Basic',
      monthlyPrice: '$10',
      yearlyPrice: '$96',
      description: 'Essential features for small projects.',
      features: [
        'Up to 5 projects',
        'Basic analytics',
        'Community support',
        '1GB Storage'
      ]
    },
    {
      name: 'Pro',
      monthlyPrice: '$20',
      yearlyPrice: '$192',
      description: 'Advanced tools for growing agencies.',
      isRecommended: true,
      features: [
        'Unlimited projects',
        'Advanced analytics',
        'Priority email support',
        '10GB Storage',
        'Custom domains'
      ]
    },
    {
      name: 'Enterprise',
      monthlyPrice: '$40',
      yearlyPrice: '$384',
      description: 'Full-scale solutions for large teams.',
      features: [
        'Everything in Pro',
        'Dedicated account manager',
        '24/7 Phone support',
        'Unlimited Storage',
        'SSO & Security'
      ]
    }
  ];

  return (
    <div className="bg-gray-50 py-24 sm:py-32">

        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">Pricing</h2>
            <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Choose the right plan for your business
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Transparent pricing that scales with you. No hidden fees, cancel anytime.
            </p>
          </div>

          <div className="mt-16">
            <BillingToggle isYearly={isYearly} onChange={setIsYearly} />
            
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {plans.map((plan) => (
                <PricingCard
                  key={plan.name}
                  name={plan.name}
                  price={isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                  description={plan.description}
                  features={plan.features}
                  isRecommended={plan.isRecommended}
                  billingCycle={isYearly ? 'yr' : 'mo'}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
  );
};


export default PricingPage;