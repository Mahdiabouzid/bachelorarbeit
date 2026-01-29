import React from 'react';
import { FaReact, FaNodeJs, FaHtml5, FaCss3, FaJs } from 'react-icons/fa';

const About = () => {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto flex flex-col md:flex-row items-center">
        <div className="md:w-1/2">
          <img
            src="https://images.unsplash.com/photo-1580927511526-597e31c53a6b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Alex Rivera" className="rounded-lg shadow-lg" />
        </div>
        <div className="md:w-1/2 mt-8 md:mt-0 md:pl-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">About Me</h2>
          <p className="text-gray-700 mb-6">
            I am a freelance graphic designer with 5+ years of experience in creating stunning visuals for businesses and individuals. I specialize in branding, UI/UX design, and illustration.
          </p>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Skills</h3>
          <div className="flex flex-wrap gap-4">
            <FaHtml5 size={32} className="text-orange-500" />
            <FaCss3 size={32} className="text-blue-500" />
            <FaJs size={32} className="text-yellow-500" />
            <FaReact size={32} className="text-blue-300" />
            <FaNodeJs size={32} className="text-green-500" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
