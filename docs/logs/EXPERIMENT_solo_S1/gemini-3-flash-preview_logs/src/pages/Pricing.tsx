import React, { useState } from 'react';
import { Check } from 'lucide-react';

const Pricing: React.FC = () => {
  const [isYearly, setIsYearly] = useState(false);

  const plans = [
    {
      name: 'Basic',
      monthlyPrice: 10,
      yearlyPrice: 96,
      features: ['5 Projects', 'Basic Analytics', 'Email Support'],
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
      features: ['Dedicated Manager', 'Custom Integration', '24/7 Phone Support', 'SLA Guarantee'],
      recommended: false,
    },
  ];

  return (
    <div className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">Simple, Transparent Pricing</h2>
          <p className="mt-4 text-xl text-slate-600">Choose the plan that works best for your team.</p>

          {/* Toggle */}
          <div className="mt-12 flex justify-center items-center space-x-4">
            <span className={`text-sm font-medium ${!isYearly ? 'text-slate-900' : 'text-slate-500'}`}>Monthly</span>
            <button
              type="button"
              onClick={() => setIsYearly(!isYearly)}
              className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 bg-indigo-600"
              role="switch"
              aria-checked={isYearly}
              aria-label="Billing Pricing period toggle"
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isYearly ? 'translate-x-5' : 'translate-x-0'}`}
              />
            </button>
            <span className={`text-sm font-medium ${isYearly ? 'text-slate-900' : 'text-slate-500'}`}>Yearly (Save 20%)</span>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative p-8 bg-white border rounded-2xl shadow-sm flex flex-col ${
                plan.recommended ? 'border-indigo-600 ring-2 ring-indigo-600 ring-opacity-50' : 'border-slate-200'
              }`}
            >
              {plan.recommended && (
                <span className="absolute top-0 right-8 -translate-y-1/2 bg-indigo-600 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                  Recommended
                </span>
              )}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                <p className="mt-4 flex items-baseline">
                  <span className="text-4xl font-extrabold tracking-tight text-slate-900">
                    ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                  </span>
                  <span className="ml-1 text-xl font-semibold text-slate-500">/{isYearly ? 'year' : 'month'}</span>
                </p>
              </div>
              <ul className="mb-8 space-y-4 flex-grow">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <Check className="h-5 w-5 text-indigo-500 shrink-0 mr-3" />
                    <span className="text-slate-600">{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                  plan.recommended
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                }`}
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

export default Pricing;