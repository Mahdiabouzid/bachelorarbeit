import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PricingCard from '../components/PricingCard';
import { pricingPlans } from '../data/mockData';

const PricingPage: React.FC = () => {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
              Pricing Plans
            </h1>
            <p className="mt-4 text-xl text-gray-600">
              Choose the perfect plan for your business needs.
            </p>

            {/* Billing Toggle */}
            <div className="mt-8 flex justify-center">
              <div 
                className="relative flex bg-gray-200 rounded-lg p-1"
                role="group" 
                aria-label="Billing period toggle"
              >
                <button
                  type="button"
                  onClick={() => setBillingPeriod('monthly')}
                  aria-pressed={billingPeriod === 'monthly'}
                  className={`relative w-28 py-2 text-sm font-medium rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    billingPeriod === 'monthly'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() => setBillingPeriod('yearly')}
                  aria-pressed={billingPeriod === 'yearly'}
                  className={`relative w-28 py-2 text-sm font-medium rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    billingPeriod === 'yearly'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  Yearly
                </button>
              </div>
            </div>
            {billingPeriod === 'yearly' && (
              <p className="mt-2 text-sm text-green-600 font-medium">
                Save up to 20% with yearly billing!
              </p>
            )}
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-12">
            {pricingPlans.map((plan) => (
              <PricingCard
                key={plan.id}
                plan={plan.name}
                price={billingPeriod === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                period={billingPeriod}
                features={plan.features}
                isRecommended={plan.isRecommended}
                onCTAClick={() => console.log(`Selected ${plan.name} plan`)}
                ctaAriaLabel={`Get Started with ${plan.name}`}
              />

            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PricingPage;
