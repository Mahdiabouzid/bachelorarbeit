import React from 'react';
import { FaLaptopCode, FaPalette, FaPencilRuler } from 'react-icons/fa';

const Services = () => {
  return (
    <section id="services" className="py-20 bg-white">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <FaPalette size={64} className="mx-auto text-gold mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Branding</h3>
            <p className="text-gray-700">Creating unique and memorable brand identities.</p>
          </div>
          <div className="text-center">
            <FaLaptopCode size={64} className="mx-auto text-gold mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">UI/UX Design</h3>
            <p className="text-gray-700">Designing intuitive and user-friendly interfaces.</p>
          </div>
          <div className="text-center">
            <FaPencilRuler size={64} className="mx-auto text-gold mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Illustration</h3>
            <p className="text-gray-700">Creating custom illustrations for various purposes.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
