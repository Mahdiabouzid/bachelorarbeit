import React, { useState } from 'react';
import { Check } from 'lucide-react';

const PricingPage: React.FC = () => {
  const [isYearly, setIsYearly] = useState(false);

  const plans = [
    {
      name: 'Basic',
      monthlyPrice: 10,
      yearlyPrice: 96,
      features: ['5 Projects', 'Basic Analytics', 'Community Support'],
      recommended: false,
    },
    {
      name: 'Pro',
      monthlyPrice: 20,
      yearlyPrice: 192,
      features: ['Unlimited Projects', 'Advanced Analytics', 'Priority Support', 'Custom Domains'],
      recommended: true,
    },
    {
      name: 'Enterprise',
      monthlyPrice: 40,
      yearlyPrice: 384,
      features: ['Dedicated Manager', 'Custom Integration', 'SLA Guarantee', 'On-premise Option'],
      recommended: false,
    },
  ];

  return (
    <div className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Simple, Transparent Pricing</h2>
          <p className="mt-4 text-xl text-gray-600">Choose the plan that's right for your business.</p>

          {/* Toggle */}
          <div className="mt-8 flex justify-center items-center space-x-4">
            <span className={`text-sm font-medium ${!isYearly ? 'text-gray-900' : 'text-gray-500'}`}>Monthly</span>
            <button
              type="button"
              role="switch"
              aria-checked={isYearly}
              aria-label="Billing Pricing period toggle"
              onClick={() => setIsYearly(!isYearly)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${isYearly ? 'bg-blue-600' : 'bg-gray-200'}`}
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isYearly ? 'translate-x-5' : 'translate-x-0'}`}
              />
            </button>
            <span className={`text-sm font-medium ${isYearly ? 'text-gray-900' : 'text-gray-500'}`}>Yearly (Save 20%)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-2xl shadow-lg p-8 border ${plan.recommended ? 'border-blue-600 ring-2 ring-blue-600 ring-opacity-50' : 'border-gray-200'}`}
            >
              {plan.recommended && (
                <span className="absolute top-0 right-8 -translate-y-1/2 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  Recommended
                </span>
              )}
              <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-extrabold text-gray-900">${isYearly ? plan.yearlyPrice : plan.monthlyPrice}</span>
                <span className="ml-1 text-xl text-gray-500">/{isYearly ? 'year' : 'month'}</span>
              </div>
              <ul className="mt-8 space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center text-gray-600">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                className={`mt-8 w-full py-3 px-4 rounded-lg font-semibold transition-colors ${plan.recommended ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}
                aria-label={`Get Started with ${plan.name}`}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingPage;