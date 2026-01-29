import React from 'react';
import { Instagram, Twitter, Linkedin, Mail } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <section id="contact" className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16">
          <div>
            <h2 className="text-4xl font-bold uppercase tracking-tighter mb-6">Let's Create <br /> Something Great</h2>
            <p className="text-gray-400 mb-8 max-w-md">
              Currently accepting new projects and collaborations. If you have an idea you'd like to bring to life, feel free to reach out.
            </p>
            
            <div className="space-y-4">
              <a href="mailto:hello@alexrivera.com" className="flex items-center space-x-4 text-xl hover:text-[#D4AF37] transition-colors">
                <Mail className="w-6 h-6" />
                <span>hello@alexrivera.com</span>
              </a>
              <div className="flex space-x-6 pt-6">
                <a href="#" className="hover:text-[#D4AF37] transition-colors"><Instagram /></a>
                <a href="#" className="hover:text-[#D4AF37] transition-colors"><Twitter /></a>
                <a href="#" className="hover:text-[#D4AF37] transition-colors"><Linkedin /></a>
              </div>
            </div>
          </div>

          <form className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-bold">Name</label>
                <input type="text" className="w-full bg-transparent border-b border-gray-800 py-3 focus:border-[#D4AF37] outline-none transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-bold">Email</label>
                <input type="email" className="w-full bg-transparent border-b border-gray-800 py-3 focus:border-[#D4AF37] outline-none transition-colors" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest font-bold">Message</label>
              <textarea rows={4} className="w-full bg-transparent border-b border-gray-800 py-3 focus:border-[#D4AF37] outline-none transition-colors resize-none"></textarea>
            </div>
            <button className="px-12 py-4 bg-[#D4AF37] text-black font-bold uppercase tracking-widest text-sm hover:bg-white transition-colors">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;