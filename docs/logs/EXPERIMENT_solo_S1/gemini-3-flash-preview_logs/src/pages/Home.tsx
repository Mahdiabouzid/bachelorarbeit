import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
            Elevate Your Digital <span className="text-indigo-600">Presence</span>
          </h1>
          <p className="mt-6 text-xl text-slate-600 max-w-2xl mx-auto">
            PRIM-Agency delivers cutting-edge solutions for modern businesses. From design to deployment, we've got you covered.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link
              to="/pricing"
              className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
            >
              View Pricing <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/contact"
              className="px-8 py-3 bg-white text-indigo-600 font-semibold rounded-lg border border-indigo-100 hover:bg-indigo-50 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[ 
            { title: 'Strategy', desc: 'Data-driven approaches to scale your brand.' },
            { title: 'Design', desc: 'Beautiful, accessible interfaces that convert.' },
            { title: 'Growth', desc: 'Optimized performance for maximum reach.' }
          ].map((feature) => (
            <div key={feature.title} className="p-8 bg-slate-50 rounded-2xl border border-slate-100">
              <CheckCircle className="h-8 w-8 text-indigo-600 mb-4" />
              <h3 className="text-xl font-bold text-slate-900">{feature.title}</h3>
              <p className="mt-2 text-slate-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;