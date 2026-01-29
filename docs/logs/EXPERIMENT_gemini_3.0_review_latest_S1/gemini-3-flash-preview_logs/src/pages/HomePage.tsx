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