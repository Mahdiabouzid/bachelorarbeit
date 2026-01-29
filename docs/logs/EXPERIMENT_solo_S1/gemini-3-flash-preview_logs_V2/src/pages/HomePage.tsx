import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="bg-white">
      <section className="relative py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">
              Elevate Your Digital <span className="text-blue-600">Presence</span>
            </h1>
            <p className="mt-6 text-xl text-gray-500 max-w-2xl mx-auto">
              We build high-performance web applications and digital strategies that help your business scale and succeed in the modern era.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <Link
                to="/pricing"
                className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
              >
                View Pricing
              </Link>
              <Link
                to="/contact"
                className="px-8 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[ 
              { title: 'Strategy', desc: 'Data-driven approaches to market dominance.' },
              { title: 'Design', desc: 'User-centric interfaces that convert visitors.' },
              { title: 'Development', desc: 'Robust, scalable code built for the future.' }
            ].map((feature) => (
              <div key={feature.title} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <CheckCircle className="h-8 w-8 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;