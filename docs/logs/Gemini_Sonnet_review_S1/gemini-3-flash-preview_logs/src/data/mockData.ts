import { faker } from '@faker-js/faker';

export interface PricingPlan {
  id: string;
  name: string;
  monthlyPrice: string;
  yearlyPrice: string;
  features: string[];
  isRecommended?: boolean;
}

const generateFeatures = (count: number) => {
  return Array.from({ length: count }, () => faker.company.catchPhrase());
};

export const pricingPlans: PricingPlan[] = [
  {
    id: 'basic',
    name: 'Basic',
    monthlyPrice: '$10',
    yearlyPrice: '$96',
    features: generateFeatures(3),
    isRecommended: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    monthlyPrice: '$20',
    yearlyPrice: '$192',
    features: generateFeatures(4),
    isRecommended: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    monthlyPrice: '$40',
    yearlyPrice: '$384',
    features: generateFeatures(5),
    isRecommended: false,
  },
];