### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/App.tsx:
```tsx
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import HomePage from './pages/HomePage';
import PricingPage from './pages/PricingPage';
import ContactPage from './pages/ContactPage';
import Layout from './components/Layout';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <HomePage />
            </Layout>
          }
        />
        <Route
          path="/pricing"
          element={
            <Layout>
              <PricingPage />
            </Layout>
          }
        />
        <Route
          path="/contact"
          element={
            <Layout>
              <ContactPage />
            </Layout>
          }
        />
      </Routes>

      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
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

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/components/Footer.tsx:
```tsx
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const navigation = {
    main: [
      { name: 'Home', href: '/' },
      { name: 'Pricing', href: '/pricing' },
      { name: 'Contact', href: '/contact' },
    ],
    social: [
      { name: 'Twitter', href: '#', icon: Twitter },
      { name: 'GitHub', href: '#', icon: Github },
      { name: 'LinkedIn', href: '#', icon: Linkedin },
    ],
  };

  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="mx-auto max-w-7xl overflow-hidden px-6 py-12 sm:py-16 lg:px-8">
        <nav className="-mb-6 flex flex-wrap justify-center gap-x-12 gap-y-3 text-sm leading-6" aria-label="Footer">
          {navigation.main.map((item) => (
            <Link key={item.name} to={item.href} className="text-gray-600 hover:text-blue-600 transition-colors">
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="mt-10 flex justify-center gap-x-10">
          {navigation.social.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-gray-400 hover:text-gray-500 transition-colors"
              aria-label={item.name}
            >
              <item.icon className="h-6 w-6" aria-hidden="true" />
            </a>
          ))}
        </div>
        <p className="mt-10 text-center text-xs leading-5 text-gray-500">
          &copy; {currentYear} PRIM-Agency, Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/components/Header.tsx:
```tsx
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Contact', href: '/contact' },
];

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeClassName = "text-blue-600 font-semibold";
  const inactiveClassName = "text-gray-700 hover:text-blue-600 transition-colors";

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link to="/" className="-m-1.5 p-1.5 text-2xl font-bold tracking-tight text-blue-600">
            PRIM-Agency
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={mobileMenuOpen}
          >
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) => (isActive ? activeClassName : inactiveClassName)}
            >
              {item.name}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Mobile menu slide-over */}
      <div className={`lg:hidden ${mobileMenuOpen ? 'fixed inset-0 z-50' : 'hidden'}`} role="dialog" aria-modal="true">
        {/* Background backdrop */}
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm" 
          onClick={() => setMobileMenuOpen(false)} 
          aria-hidden="true" 
        />
        
        <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link to="/" className="-m-1.5 p-1.5 text-2xl font-bold text-blue-600" onClick={() => setMobileMenuOpen(false)}>
              PRIM-Agency
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 ${isActive ? 'bg-gray-50 text-blue-600' : 'text-gray-900 hover:bg-gray-50'}`
                    }
                  >
                    {item.name}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/components/Layout.tsx:
```tsx
import React from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/components/Pricing/BillingToggle.tsx:
```tsx
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
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/components/Pricing/PricingCard.tsx:
```tsx
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
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/pages/ContactPage.tsx:
```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-toastify';

const contactSchema = z.object({

  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters long'),
});

type ContactFormData = z.infer<typeof contactSchema>;

const ContactPage = () => {
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
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('Form Data:', data);
    toast.success('Message sent successfully!');
    reset();
  };

  return (
    <div className="bg-white py-24 sm:py-32">

        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Contact Us</h2>
            <p className="mt-2 text-lg leading-8 text-gray-600">
              Have a project in mind? We'd love to hear from you. Fill out the form below and we'll get back to you as soon as possible.
            </p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="mx-auto mt-16 max-w-xl sm:mt-20">
            <div className="grid grid-cols-1 gap-x-8 gap-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold leading-6 text-gray-900">
                  Name
                </label>
                <div className="mt-2.5">
                  <input
                    type="text"
                    id="name"
                    {...register('name')}
                    aria-invalid={errors.name ? 'true' : 'false'}
                    className={`block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                      errors.name ? 'ring-red-500 focus:ring-red-500' : ''
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-2 text-sm text-red-600" id="name-error">
                      {errors.name.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold leading-6 text-gray-900">
                  Email
                </label>
                <div className="mt-2.5">
                  <input
                    type="email"
                    id="email"
                    {...register('email')}
                    aria-invalid={errors.email ? 'true' : 'false'}
                    className={`block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                      errors.email ? 'ring-red-500 focus:ring-red-500' : ''
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600" id="email-error">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold leading-6 text-gray-900">
                  Message
                </label>
                <div className="mt-2.5">
                  <textarea
                    id="message"
                    rows={4}
                    {...register('message')}
                    aria-invalid={errors.message ? 'true' : 'false'}
                    className={`block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                      errors.message ? 'ring-red-500 focus:ring-red-500' : ''
                    }`}
                  />
                  {errors.message && (
                    <p className="mt-2 text-sm text-red-600" id="message-error">
                      {errors.message.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-10">
              <button
                type="submit"
                disabled={isSubmitting}
                className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </form>
        </div>
      </div>
  );
};


export default ContactPage;
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/pages/HomePage.tsx:
```tsx
import React from 'react';
import { ArrowRightIcon, RocketLaunchIcon, DevicePhoneMobileIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  const services = [
    {
      title: 'Digital Strategy',
      description: 'We craft data-driven strategies to help your business grow in the digital landscape.',
      icon: ChartBarIcon,
    },
    {
      title: 'Web Development',
      description: 'High-performance, responsive websites built with the latest modern technologies.',
      icon: RocketLaunchIcon,
    },
    {
      title: 'Mobile Solutions',
      description: 'Custom mobile applications designed for seamless user experiences across all devices.',
      icon: DevicePhoneMobileIcon,
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white py-24 sm:py-32">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.100),white)] opacity-20" />
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Elevate Your Brand with <span className="text-indigo-600">PRIM-Agency</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              We are a full-service digital agency dedicated to building beautiful, functional, and scalable digital products that drive results.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                to="/contact"
                className="rounded-md bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors"
              >
                Get Started
              </Link>
              <Link to="/pricing" className="text-sm font-semibold leading-6 text-gray-900 flex items-center gap-1 group">
                View Pricing <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">Deploy faster</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to scale your business
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Our expert team provides comprehensive solutions tailored to your specific business needs and goals.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {services.map((service) => (
                <div key={service.title} className="flex flex-col bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                    <service.icon className="h-6 w-6 flex-none text-indigo-600" aria-hidden="true" />
                    {service.title}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto">{service.description}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="relative isolate overflow-hidden bg-gray-900 px-6 py-24 shadow-2xl rounded-3xl sm:px-24 xl:py-32">
            <h2 className="mx-auto max-w-2xl text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to start your next project?
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-center text-lg leading-8 text-gray-300">
              Join hundreds of successful companies that have grown their digital presence with us.
            </p>
            <div className="mt-10 flex justify-center">
              <Link
                to="/contact"
                className="rounded-md bg-white px-6 py-3 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-colors"
              >
                Contact Us Today
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/pages/PricingPage.tsx:
```tsx
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
```

