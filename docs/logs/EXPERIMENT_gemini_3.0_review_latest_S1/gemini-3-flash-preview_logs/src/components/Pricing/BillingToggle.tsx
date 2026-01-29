import React from 'react';

interface BillingToggleProps {
  isYearly: boolean;
  onChange: (isYearly: boolean) => void;
}

const BillingToggle: React.FC<BillingToggleProps> = ({ isYearly, onChange }) => {
  return (
    <div className="flex items-center justify-center gap-4 mb-12">
      <span className={`text-sm font-medium ${!isYearly ? 'text-indigo-600' : 'text-gray-500'}`}>
        Monthly
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={isYearly}
        aria-label="Toggle billing cycle"
        onClick={() => onChange(!isYearly)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 ${
          isYearly ? 'bg-indigo-600' : 'bg-gray-200'
        }`}
      >
        <span
          aria-hidden="true"
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            isYearly ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
      <span className={`text-sm font-medium ${isYearly ? 'text-indigo-600' : 'text-gray-500'}`}>
        Yearly <span className="text-green-500 font-semibold">(Save 20%)</span>
      </span>
    </div>
  );
};

export default BillingToggle;