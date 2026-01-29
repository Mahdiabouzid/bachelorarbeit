import React from 'react';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

const Contact = () => {
  return (
    <section id="contact" className="py-20 bg-gray-100">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Contact</h2>
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2">
            <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                  Name
                </label>
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" placeholder="Your Name" />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                  Email
                </label>
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="email" placeholder="Your Email" />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="message">
                  Message
                </label>
                <textarea className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="message" placeholder="Your Message" rows="4"></textarea>
              </div>
              <div className="flex items-center justify-between">
                <button className="bg-gold hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
                  Send
                </button>
              </div>
            </form>
          </div>
          <div className="md:w-1/2 mt-8 md:mt-0 md:pl-10 flex flex-col items-center">
            <div className="flex space-x-6">
              <a href="#" className="text-gray-500 hover:text-gold transition-colors"><FaGithub size={32 as number} /></a>
              <a href="#" className="text-gray-500 hover:text-gold transition-colors"><FaLinkedin size={32 as number} /></a>
              <a href="#" className="text-gray-500 hover:text-gold transition-colors"><FaTwitter size={32 as number} /></a>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default Contact;
