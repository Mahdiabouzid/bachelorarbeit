import { useState } from 'react';
import PricingCard from '../components/PricingCard';

const PricingPage = () => {
  const [isMonthly, setIsMonthly] = useState(true);

  const toggleBillingPeriod = () => {
    setIsMonthly(!isMonthly);
  };

  const basicPriceMonthly = 10;
  const basicPriceYearly = 96;
  const proPriceMonthly = 20;
  const proPriceYearly = 192;
  const enterprisePriceMonthly = 40;
  const enterprisePriceYearly = 384;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Pricing Plans</h1>

      {/* Billing Period Toggle */}
      <div className="flex justify-center mb-6">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            className="form-checkbox h-5 w-5 text-black"
            checked={!isMonthly}
            onChange={toggleBillingPeriod}
            aria-label="Billing: Monthly/Yearly"
          />
          <span className="ml-2">Yearly Billing</span>
        </label>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PricingCard
          planName="Basic"
          price={isMonthly ? basicPriceMonthly : basicPriceYearly}
          billingPeriod={isMonthly ? 'month' : 'year'}
          ctaLabel="Get Started with Basic"
          isRecommended={false}
        />
        <PricingCard

          planName="Pro"
          price={isMonthly ? proPriceMonthly : proPriceYearly}
          billingPeriod={isMonthly ? 'month' : 'year'}
          ctaLabel="Get Started with Pro"
          isRecommended={true}
        />
        <PricingCard

          planName="Enterprise"
          price={isMonthly ? enterprisePriceMonthly : enterprisePriceYearly}
          billingPeriod={isMonthly ? 'month' : 'year'}
          ctaLabel="Get Started with Enterprise"
          isRecommended={false}
        />
      </div>
    </div>

  );
};

export default PricingPage;
