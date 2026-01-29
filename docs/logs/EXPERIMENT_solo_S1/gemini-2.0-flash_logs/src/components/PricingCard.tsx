interface PricingCardProps {
  planName: string;
  price: number;
  billingPeriod: string;
  ctaLabel: string;
  isRecommended?: boolean;
}

const PricingCard: React.FC<PricingCardProps> = ({ planName, price, billingPeriod, ctaLabel, isRecommended }) => {

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{planName}</h3>
        {isRecommended && <div className="bg-green-100 text-green-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">Recommended</div>}
        <div className="text-5xl font-bold">${price}</div>
        <div className="text-gray-500">per {billingPeriod}</div>
        <button className="mt-4 bg-black text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" aria-label={ctaLabel}>{ctaLabel}</button>
      </div>
    </div>
  );
};

export default PricingCard;
