import React from 'react';
import Section from '../ui/Section';
import Heading from '../ui/Heading';
import GoldButton from '../ui/GoldButton';
import { Mail, MapPin, Github, Twitter, Linkedin } from 'lucide-react';

const Contact: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission logic would go here
    console.log('Form submitted');
  };

  return (
    <Section id="contact">
      <Heading 
        title="Get In Touch" 
        subtitle="Have a project in mind? Let's create something extraordinary together."
        centered
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mt-12">
        {/* Contact Info */}
        <div className="space-y-8">
          <div>
            <h3 className="text-2xl font-bold uppercase tracking-tighter mb-6">Contact Information</h3>
            <p className="text-gray-400 mb-8 max-w-md">
              I'm currently available for freelance work and full-time opportunities. 
              Reach out and I'll get back to you within 24 hours.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full border border-[#D4AF37]/30 flex items-center justify-center">
                <Mail className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-500">Email</p>
                <p className="text-white">hello@alexrivera.com</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full border border-[#D4AF37]/30 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-500">Location</p>
                <p className="text-white">New York, NY / Remote</p>
              </div>
            </div>
          </div>

          <div className="pt-8">
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-4">Follow Me</p>
            <div className="flex space-x-4">
              {[Github, Twitter, Linkedin].map((Icon, i) => (
                <a 
                  key={i} 
                  href="#" 
                  className="w-10 h-10 border border-white/10 flex items-center justify-center hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-xs uppercase tracking-widest text-gray-400">Full Name</label>
              <input
                type="text"
                id="name"
                required
                className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-xs uppercase tracking-widest text-gray-400">Email Address</label>
              <input
                type="email"
                id="email"
                required
                className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                placeholder="john@example.com"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="subject" className="text-xs uppercase tracking-widest text-gray-400">Subject</label>
            <input
              type="text"
              id="subject"
              className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
              placeholder="Project Inquiry"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="text-xs uppercase tracking-widest text-gray-400">Message</label>
            <textarea
              id="message"
              required
              rows={5}
              className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all resize-none"
              placeholder="Tell me about your project..."
            ></textarea>
          </div>

          <GoldButton type="submit" className="w-full md:w-auto">
            Send Message
          </GoldButton>
        </form>
      </div>
    </Section>
  );
};

export default Contact;