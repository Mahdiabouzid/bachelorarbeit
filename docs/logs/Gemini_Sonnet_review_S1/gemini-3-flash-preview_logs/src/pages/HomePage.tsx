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