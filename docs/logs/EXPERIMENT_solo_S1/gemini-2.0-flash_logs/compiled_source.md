### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/App.tsx:
```tsx
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import PricingPage from "./pages/PricingPage";
import ContactPage from "./pages/ContactPage";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
      <Footer />
      <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light"/>
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

export interface ButtonProps {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ label, onClick, disabled }) => {
  return (
    <button
      className="bg-black text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
};
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/components/Footer.tsx:
```tsx
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-100 py-6">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Sitemap */}
          <div>
            <h6 className="font-semibold">Sitemap</h6>
            <ul className="mt-2 space-y-1">
              <li>
                <Link to="/" className="hover:text-gray-500">Home</Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-gray-500">Pricing</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-gray-500">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h6 className="font-semibold">Social</h6>
            <ul className="mt-2 space-y-1">
              <li>
                <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Twitter">Twitter</a>
              </li>
              <li>
                <a href="#" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">LinkedIn</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="text-center mt-4">
          <p className="text-gray-500">© {new Date().getFullYear()} PRIM-Agency. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/components/Header.tsx:
```tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto py-4 px-6 flex items-center justify-between">
        {/* Logo */}        
        <Link to="/" className="text-2xl font-bold text-black" aria-label="PRIM-Agency">PRIM-Agency</Link>

        {/* Navigation Links (Desktop) */}
        <nav className="hidden md:flex space-x-6">
          <Link to="/" className="hover:text-gray-500">Home</Link>
          <Link to="/pricing" className="hover:text-gray-500">Pricing</Link>
          <Link to="/contact" className="hover:text-gray-500">Contact</Link>
        </nav>

        {/* Hamburger Menu (Mobile) */}
        <button
          className="md:hidden text-black focus:outline-none"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        >
          <FontAwesomeIcon icon={faBars} size="lg" />
        </button>
      </div>

      {/* Slide-over Menu (Mobile) */}
      <div className={`fixed top-0 right-0 h-full w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between p-4">
          <span className="text-lg font-semibold">Menu</span>
          <button
            className="text-black focus:outline-none"
            onClick={toggleMenu}
            aria-label="Close menu"
          >
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </div>
        <nav className="flex flex-col p-4 space-y-4">
          <Link to="/" className="hover:text-gray-500" onClick={toggleMenu}>Home</Link>
          <Link to="/pricing" className="hover:text-gray-500" onClick={toggleMenu}>Pricing</Link>
          <Link to="/contact" className="hover:text-gray-500" onClick={toggleMenu}>Contact</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/components/PricingCard.tsx:
```tsx
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
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/pages/ContactPage.tsx:
```tsx
import { useForm, FieldError } from 'react-hook-form';
import { ReactNode } from 'react';

import { toast } from 'react-toastify';

interface FormData {
  name: string;
  email: string;
  message: string;
}

const ContactPage = () => {

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    console.log(data);
    toast.success('Message sent successfully');

  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg">
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Name</label>
          <input
            type="text"
            id="name"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            {...register('name', { required: 'Name is required' })}
            aria-invalid={errors.name ? 'true' : 'false'}
          />
          {errors.name && <p className="text-red-500 text-xs italic">{errors.name.message as ReactNode}</p>}
        </div>
        <div className="mb-4">

          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
          <input
            type="email"
            id="email"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, message: 'Invalid email format' },
            })}
            aria-invalid={errors.email ? 'true' : 'false'}
          />
          {errors.email && <p className="text-red-500 text-xs italic">{errors.email.message as ReactNode}</p>}
        </div>
        <div className="mb-6">

          <label htmlFor="message" className="block text-gray-700 text-sm font-bold mb-2">Message</label>
          <textarea
            id="message"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            {...register('message', { required: 'Message is required', minLength: { value: 10, message: 'Message must be at least 10 characters' } })}
            aria-invalid={errors.message ? 'true' : 'false'}
          />
          {errors.message && <p className="text-red-500 text-xs italic">{errors.message.message as ReactNode}</p>}
        </div>
        <button className="bg-black text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">Submit</button>

      </form>
    </div>
  );
};

export default ContactPage;
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/pages/HomePage.tsx:
```tsx
const HomePage = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Welcome to PRIM-Agency</h1>
      <p className="text-gray-700">This is the home page of our website.</p>
    </div>
  );
};

export default HomePage;
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/pages/PricingPage.tsx:
```tsx
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
```

