### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/App.tsx:
```tsx
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import PricingPage from "./pages/PricingPage";
import ContactPage from "./pages/ContactPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </BrowserRouter>
  );
}

```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/main.tsx:
```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <App />
  </StrictMode>
)
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/components/Button.tsx:
```tsx
import React from 'react';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  className, 
  variant = 'primary', 
  size = 'md', 
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-md';
  
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-800 text-white hover:bg-gray-900 focus:ring-gray-700',
    outline: 'border-2 border-gray-300 bg-transparent hover:bg-gray-50 focus:ring-gray-500 text-gray-700',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={twMerge(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/components/Footer.tsx:
```tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">PRIM-Agency</h3>
            <p className="text-gray-400">
              Delivering premium digital solutions for modern businesses.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Sitemap</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" aria-label="Follow us on Twitter" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" aria-label="Follow us on LinkedIn" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="h-6 w-6" />
              </a>
              <a href="#" aria-label="Follow us on GitHub" className="text-gray-400 hover:text-white transition-colors">
                <Github className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} PRIM-Agency. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/components/FormInput.tsx:
```tsx
import React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

interface FormInputProps {
  label: string;
  name: string;
  type?: string;
  error?: string;
  placeholder?: string;
  register: UseFormRegisterReturn;
  isTextArea?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({ 
  label, 
  name, 
  type = 'text', 
  error, 
  placeholder, 
  register, 
  isTextArea = false 
}) => {
  const id = `input-${name}`;
  const errorId = `${name}-error`;
  const inputClasses = `w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${error ? 'border-red-500' : 'border-gray-300'}`;


  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      {isTextArea ? (
        <textarea
          id={id}
          placeholder={placeholder}
          className={inputClasses}
          rows={4}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? errorId : undefined}
          {...register}
        />
      ) : (
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          className={inputClasses}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? errorId : undefined}
          {...register}
        />
      )}
      {error && (
        <p id={errorId} role="alert" className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormInput;
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/components/Header.tsx:
```tsx
import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-blue-600" aria-label="PRIM-Agency">
              PRIM-Agency
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors hover:text-blue-600 ${isActive ? 'text-blue-600' : 'text-gray-600'}`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-gray-600 hover:text-gray-900"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open menu"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Slide-over Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[60] md:hidden" role="dialog" aria-modal="true">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsMenuOpen(false)} />
          <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-white shadow-xl transform transition-transform duration-300">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <span className="text-xl font-bold text-blue-600">Menu</span>
              <button
                type="button"
                className="text-gray-600 hover:text-gray-900"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Close menu"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="px-6 py-6 space-y-4">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `block text-lg font-medium ${isActive ? 'text-blue-600' : 'text-gray-900'}`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/components/PricingCard.tsx:
```tsx
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
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/data/mockData.ts:
```typescript
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
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/pages/ContactPage.tsx:
```tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Header from '../components/Header';
import Footer from '../components/Footer';
import FormInput from '../components/FormInput';
import Button from '../components/Button';

// Define validation schema
const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email format'),
  message: z.string().min(10, 'Message must be at least 10 characters long'),
});

type ContactFormData = z.infer<typeof contactSchema>;

const ContactPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    // Simulate API call
    console.log('Form Data:', data);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    toast.success('Message sent successfully', {
      position: 'top-right',

      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    
    reset();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Contact Us</h1>
            <p className="text-lg text-gray-600">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          <div className="bg-white shadow-sm rounded-lg p-8 border border-gray-200">
            <form 
              onSubmit={handleSubmit(onSubmit)} 
              aria-label="Contact form" 
              noValidate
            >
              <FormInput
                label="Name"
                name="name"
                placeholder="Your full name"
                register={register('name')}
                error={errors.name?.message}
              />

              <FormInput
                label="Email"
                name="email"
                type="email"
                placeholder="your.email@example.com"
                register={register('email')}
                error={errors.email?.message}
              />

              <FormInput
                label="Message"
                name="message"
                isTextArea
                placeholder="How can we help you?"
                register={register('message')}
                error={errors.message?.message}
              />

              <div className="mt-6">
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
      <ToastContainer />
    </div>
  );
};

export default ContactPage;
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/pages/HomePage.tsx:
```tsx
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { faker } from '@faker-js/faker';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Button from '../components/Button';

const HomePage: React.FC = () => {
  // Generate 3 features using faker
  const features = useMemo(() => 
    Array.from({ length: 3 }).map(() => ({
      id: faker.string.uuid(),
      title: faker.commerce.productName(),
      description: faker.lorem.sentence(12),
    })), 
  []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-blue-600 to-indigo-700 py-20 px-4 sm:px-6 lg:px-8 text-white">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
              Welcome to PRIM-Agency
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-10 text-blue-100">
              We provide premium digital solutions to help your business scale, 
              innovate, and dominate the modern market with cutting-edge technology.
            </p>
            <div className="flex justify-center">
              <Link to="/pricing">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 border-none shadow-lg">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Our Core Features
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Discover why industry leaders choose PRIM-Agency for their most ambitious projects.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature) => (
                <div 
                  key={feature.id} 
                  className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md hover:-translate-y-1"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                    <div className="w-6 h-6 bg-blue-600 rounded-full" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/pages/PricingPage.tsx:
```tsx
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
```

