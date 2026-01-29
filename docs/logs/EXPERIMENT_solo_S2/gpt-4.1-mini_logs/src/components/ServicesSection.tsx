import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPalette, faLaptopCode, faPenNib } from '@fortawesome/free-solid-svg-icons';

const services = [
  {
    id: 1,
    title: 'Branding',
    icon: faPalette,
    description: 'Crafting unique brand identities that resonate and inspire.',
  },
  {
    id: 2,
    title: 'UI/UX Design',
    icon: faLaptopCode,
    description: 'Designing intuitive and engaging user interfaces and experiences.',
  },
  {
    id: 3,
    title: 'Illustration',
    icon: faPenNib,
    description: 'Creating custom illustrations to bring your ideas to life.',
  },
];

export const ServicesSection: React.FC = () => {
  return (
    <section
      id="services"
      className="max-w-7xl mx-auto px-6 py-20 text-white"
      aria-labelledby="services-title"
    >
      <h2 id="services-title" className="text-4xl font-bold mb-12 font-sans text-center">
        Services
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
        {services.map(({ id, title, icon, description }) => (
          <div
            key={id}
            className="flex flex-col items-center text-center p-6 bg-black bg-opacity-50 rounded-lg shadow-lg hover:shadow-yellow-400 transition-shadow duration-300"
          >
            <FontAwesomeIcon icon={icon} size="3x" className="text-yellow-400 mb-4" aria-hidden="true" />
            <h3 className="text-2xl font-semibold mb-2">{title}</h3>
            <p className="text-sm leading-relaxed">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
