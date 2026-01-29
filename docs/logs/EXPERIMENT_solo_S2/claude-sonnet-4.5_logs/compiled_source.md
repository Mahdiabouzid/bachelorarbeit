### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/App.tsx:
```tsx
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PortfolioPage from './pages/PortfolioPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PortfolioPage />} />
      </Routes>
    </BrowserRouter>
  );
}

```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/main.tsx:
```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <App />
  </StrictMode>
)
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/components/About.tsx:
```tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  SiAdobe,
  SiFigma,
  SiSketch
} from '@icons-pack/react-simple-icons';

import { aboutText } from '../utils/data';

const About: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const tools = [
    { name: 'Adobe Illustrator', Icon: SiAdobe },
    { name: 'Adobe Photoshop', Icon: SiAdobe },
    { name: 'Figma', Icon: SiFigma },
    { name: 'Adobe XD', Icon: SiAdobe },
    { name: 'InDesign', Icon: SiAdobe },
    { name: 'Sketch', Icon: SiSketch }
  ];


  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-black"
    >
      <div className="max-w-7xl mx-auto">
        <h2
          className={`text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-16 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          About <span className="text-gold">Me</span>
        </h2>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Photo */}
          <div
            className={`transition-all duration-1000 delay-200 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
            }`}
          >
            <div className="relative w-full max-w-md mx-auto">
              <div className="aspect-square rounded-full overflow-hidden border-4 border-gold shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=600&fit=crop"
                  alt="Alex Rivera"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Decorative element */}
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gold/20 rounded-full blur-3xl" />
            </div>
          </div>

          {/* Bio and Tools */}
          <div
            className={`transition-all duration-1000 delay-400 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
            }`}
          >
            <div className="space-y-6">
              {aboutText.split('\n\n').map((paragraph, index) => (
                <p key={index} className="text-gray-300 text-base md:text-lg leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Tools & Technologies */}
            <div className="mt-10">
              <h3 className="text-2xl font-semibold mb-6 text-gold">Tools & Technologies</h3>
              <div className="grid grid-cols-3 gap-6">
                {tools.map(({ name, Icon }, index) => (
                  <div
                    key={name}
                    className="flex flex-col items-center group cursor-pointer"
                    style={{
                      animation: isVisible ? `fadeInUp 0.6s ease-out ${0.6 + index * 0.1}s forwards` : 'none',
                      opacity: isVisible ? 1 : 0
                    }}
                  >
                    <div className="w-16 h-16 flex items-center justify-center bg-white/5 rounded-lg group-hover:bg-gold/20 transition-all duration-300 group-hover:scale-110">
                      <Icon className="w-8 h-8 text-white group-hover:text-gold transition-colors" />
                    </div>
                    <span className="text-xs text-gray-400 mt-2 text-center group-hover:text-gold transition-colors">
                      {name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/components/Contact.tsx:
```tsx
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaLinkedin, FaDribbble, FaBehance, FaInstagram } from 'react-icons/fa';
import { socialLinks } from '../utils/data';

interface FormData {
  name: string;
  email: string;
  message: string;
}

const Contact: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormData>();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const onSubmit = (data: FormData) => {
    // Simulate form submission
    console.log('Form submitted:', data);
    toast.success('Message sent successfully! I\'ll get back to you soon.', {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: 'dark'
    });
    reset();
  };

  const socialIconMap: { [key: string]: React.ReactNode } = {
    linkedin: <FaLinkedin size={24} />,
    dribbble: <FaDribbble size={24} />,
    behance: <FaBehance size={24} />,
    instagram: <FaInstagram size={24} />
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-zinc-950"
    >
      <div className="max-w-7xl mx-auto">
        <h2
          className={`text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-16 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          Get In <span className="text-gold">Touch</span>
        </h2>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
          {/* Contact Form */}
          <div
            className={`transition-all duration-1000 delay-200 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
            }`}
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  {...register('name', { required: 'Name is required' })}
                  className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
                  placeholder="Your name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors"
                  placeholder="your.email@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              {/* Message Field */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={6}
                  {...register('message', {
                    required: 'Message is required',
                    minLength: {
                      value: 10,
                      message: 'Message must be at least 10 characters'
                    }
                  })}
                  className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors resize-none"
                  placeholder="Tell me about your project..."
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full px-8 py-4 bg-gold text-black font-semibold rounded-lg hover:bg-gold/90 transition-all duration-300 hover:shadow-lg hover:shadow-gold/50 hover:-translate-y-1"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info & Social Links */}
          <div
            className={`transition-all duration-1000 delay-400 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
            }`}
          >
            <div className="space-y-8">
              {/* Contact Info */}
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">Let's Create Together</h3>
                <p className="text-gray-400 leading-relaxed mb-6">
                  I'm always excited to work on new projects and collaborate with creative minds.
                  Whether you have a specific project in mind or just want to chat about design,
                  feel free to reach out!
                </p>
                <p className="text-gray-400 leading-relaxed">
                  I typically respond within 24 hours. Looking forward to hearing from you!
                </p>
              </div>

              {/* Social Links */}
              <div>
                <h4 className="text-xl font-semibold text-gold mb-4">Connect With Me</h4>
                <div className="flex space-x-4">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 flex items-center justify-center bg-zinc-900 rounded-lg text-white hover:bg-gold hover:text-black transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-gold/50"
                      aria-label={social.name}
                    >
                      {socialIconMap[social.icon]}
                    </a>
                  ))}
                </div>
              </div>

              {/* Decorative Quote */}
              <div className="mt-12 p-6 bg-zinc-900 rounded-lg border-l-4 border-gold">
                <p className="text-gray-300 italic text-lg">
                  "Design is not just what it looks like and feels like. Design is how it works."
                </p>
                <p className="text-gold mt-2 font-semibold">— Steve Jobs</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer />
    </section>
  );
};

export default Contact;
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/components/Footer.tsx:
```tsx
import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black py-8 px-4 sm:px-6 lg:px-8 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-gray-400 text-sm">
          © {currentYear} Alex Rivera. All rights reserved.
        </p>
        <p className="text-gray-500 text-xs mt-2">
          Designed with <span className="text-gold">♥</span> and passion
        </p>
      </div>
    </footer>
  );
};

export default Footer;
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/components/Hero.tsx:
```tsx
import React from 'react';
import { ChevronDown } from 'lucide-react';

const Hero: React.FC = () => {
  const handleScrollDown = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="home"
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1920&h=1080&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-4 animate-fadeInUp">
          <span className="text-white">Alex </span>
          <span className="text-gold">Rivera</span>
        </h1>
        <p
          className="text-xl sm:text-2xl md:text-3xl text-gray-300 italic font-light animate-fadeInUp"
          style={{ animationDelay: '0.2s', opacity: 0 }}
        >
          Designing Visual Stories
        </p>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={handleScrollDown}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 text-gold animate-bounce-slow cursor-pointer hover:opacity-80 transition-opacity"
        aria-label="Scroll down"
      >
        <ChevronDown size={40} />
      </button>
    </section>
  );
};

export default Hero;
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/components/Navbar.tsx:
```tsx
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Portfolio', href: '#portfolio' },
    { name: 'Services', href: '#services' },
    { name: 'Contact', href: '#contact' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Determine active section
      const sections = ['home', 'about', 'portfolio', 'services', 'contact'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/90 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('#home');
            }}
            className="text-xl md:text-2xl font-bold text-gold hover:opacity-80 transition-opacity"
          >
            AR
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className={`text-sm lg:text-base font-medium transition-colors relative group ${
                  activeSection === link.href.substring(1)
                    ? 'text-gold'
                    : 'text-white hover:text-gold'
                }`}
              >
                {link.name}
                <span
                  className={`absolute -bottom-1 left-0 w-full h-0.5 bg-gold transform origin-left transition-transform ${
                    activeSection === link.href.substring(1)
                      ? 'scale-x-100'
                      : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                />
              </a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white hover:text-gold transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-black/95 backdrop-blur-md px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(link.href);
              }}
              className={`block py-2 text-base font-medium transition-colors ${
                activeSection === link.href.substring(1)
                  ? 'text-gold'
                  : 'text-white hover:text-gold'
              }`}
            >
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/components/Portfolio.tsx:
```tsx
import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { projects, Project } from '../utils/data';

const Portfolio: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedProject]);

  return (
    <section
      id="portfolio"
      ref={sectionRef}
      className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-zinc-950"
    >
      <div className="max-w-7xl mx-auto">
        <h2
          className={`text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-16 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          My <span className="text-gold">Portfolio</span>
        </h2>

        {/* Masonry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className={`group relative overflow-hidden rounded-lg cursor-pointer transition-all duration-1000 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{
                transitionDelay: `${index * 0.1}s`,
                gridRow: index % 3 === 1 ? 'span 2' : 'span 1'
              }}
              onClick={() => setSelectedProject(project)}
            >
              <div className="relative aspect-square md:aspect-auto md:h-full">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <span className="text-gold text-sm font-semibold mb-2">{project.category}</span>
                  <h3 className="text-white text-xl font-bold mb-2">{project.title}</h3>
                  <p className="text-gray-300 text-sm line-clamp-2">{project.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fadeIn"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="relative bg-zinc-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-fadeInUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-black/50 hover:bg-gold rounded-full transition-colors"
              aria-label="Close modal"
            >
              <X size={24} className="text-white" />
            </button>

            {/* Project Image */}
            <div className="relative w-full h-64 md:h-96">
              <img
                src={selectedProject.image}
                alt={selectedProject.title}
                className="w-full h-full object-cover rounded-t-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent" />
            </div>

            {/* Project Details */}
            <div className="p-6 md:p-8">
              <span className="inline-block px-3 py-1 bg-gold/20 text-gold text-sm font-semibold rounded-full mb-4">
                {selectedProject.category}
              </span>
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {selectedProject.title}
              </h3>
              <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-6">
                {selectedProject.description}
              </p>

              {/* Tools Used */}
              <div>
                <h4 className="text-xl font-semibold text-gold mb-3">Tools Used</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.tools.map((tool) => (
                    <span
                      key={tool}
                      className="px-4 py-2 bg-white/5 text-white text-sm rounded-full border border-white/10 hover:border-gold hover:text-gold transition-colors"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Portfolio;
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/components/Services.tsx:
```tsx
import React, { useEffect, useRef, useState } from 'react';
import { Palette, Layout, PenTool } from 'lucide-react';
import { services } from '../utils/data';

const Services: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const iconMap: { [key: string]: React.ReactNode } = {
    palette: <Palette size={40} />,
    layout: <Layout size={40} />,
    'pen-tool': <PenTool size={40} />
  };

  return (
    <section
      id="services"
      ref={sectionRef}
      className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-black"
    >
      <div className="max-w-7xl mx-auto">
        <h2
          className={`text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-16 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          My <span className="text-gold">Services</span>
        </h2>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {services.map((service, index) => (
            <div
              key={service.id}
              className={`group relative bg-zinc-900 rounded-lg p-8 hover:bg-zinc-800 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-gold/20 cursor-pointer ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 0.2}s` }}
            >
              {/* Icon */}
              <div className="w-20 h-20 flex items-center justify-center bg-gold/10 rounded-lg mb-6 group-hover:bg-gold/20 transition-colors">
                <div className="text-gold group-hover:scale-110 transition-transform">
                  {iconMap[service.icon]}
                </div>
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-gold transition-colors">
                {service.title}
              </h3>

              {/* Description */}
              <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                {service.description}
              </p>

              {/* Decorative element */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gold/5 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/pages/PortfolioPage.tsx:
```tsx
import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Portfolio from '../components/Portfolio';
import Services from '../components/Services';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

const PortfolioPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <Hero />
      <About />
      <Portfolio />
      <Services />
      <Contact />
      <Footer />
    </div>
  );
};

export default PortfolioPage;
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/utils/data.ts:
```typescript
export interface Project {
  id: number;
  title: string;
  description: string;
  tools: string[];
  image: string;
  category: string;
}

export interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
}

export interface Tool {
  name: string;
  icon: string;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

export const projects: Project[] = [
  {
    id: 1,
    title: "Luxe Fashion Brand Identity",
    description: "Complete brand identity design for a high-end fashion label including logo, color palette, typography, and brand guidelines. The design emphasizes elegance and sophistication with a modern twist.",
    tools: ["Adobe Illustrator", "Photoshop", "InDesign"],
    image: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&h=600&fit=crop",
    category: "Branding"
  },
  {
    id: 2,
    title: "Artisan Coffee Mobile App",
    description: "UI/UX design for a specialty coffee ordering app featuring intuitive navigation, custom illustrations, and a warm, inviting color scheme that reflects the artisanal nature of the brand.",
    tools: ["Figma", "Adobe XD", "Illustrator"],
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=1000&fit=crop",
    category: "UI/UX"
  },
  {
    id: 3,
    title: "Urban Architecture Magazine",
    description: "Editorial design for a quarterly architecture magazine featuring bold typography, striking layouts, and a sophisticated grid system that showcases contemporary urban design.",
    tools: ["InDesign", "Photoshop", "Lightroom"],
    image: "https://images.unsplash.com/photo-1541367777708-7905fe3296c0?w=800&h=900&fit=crop",
    category: "Editorial"
  },
  {
    id: 4,
    title: "Botanical Illustration Series",
    description: "A collection of detailed botanical illustrations for a natural skincare brand, combining scientific accuracy with artistic beauty. Each illustration tells a story about the plant's properties.",
    tools: ["Procreate", "Illustrator", "Photoshop"],
    image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&h=1000&fit=crop",
    category: "Illustration"
  },
  {
    id: 5,
    title: "Tech Startup Website Redesign",
    description: "Complete website redesign for a SaaS startup, focusing on user experience, conversion optimization, and modern design trends. Includes responsive design for all devices.",
    tools: ["Figma", "Adobe XD", "Photoshop"],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
    category: "UI/UX"
  },
  {
    id: 6,
    title: "Organic Food Packaging Design",
    description: "Sustainable packaging design for an organic food brand, featuring hand-drawn illustrations, eco-friendly materials, and a cohesive visual identity across product lines.",
    tools: ["Illustrator", "Photoshop", "Dimension"],
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=800&fit=crop",
    category: "Branding"
  }
];

export const services: Service[] = [
  {
    id: 1,
    title: "Branding",
    description: "Creating memorable brand identities that resonate with your target audience. From logo design to complete brand guidelines, I help businesses establish a strong visual presence.",
    icon: "palette"
  },
  {
    id: 2,
    title: "UI/UX Design",
    description: "Designing intuitive and beautiful user interfaces that enhance user experience. I focus on creating seamless interactions that delight users and drive engagement.",
    icon: "layout"
  },
  {
    id: 3,
    title: "Illustration",
    description: "Custom illustrations that bring your ideas to life. Whether digital or traditional, I create unique artwork that adds personality and visual interest to your projects.",
    icon: "pen-tool"
  }
];

export const tools: Tool[] = [
  { name: "Adobe Illustrator", icon: "SiAdobeillustrator" },
  { name: "Adobe Photoshop", icon: "SiAdobephotoshop" },
  { name: "Figma", icon: "SiFigma" },
  { name: "Adobe XD", icon: "SiAdobexd" },
  { name: "InDesign", icon: "SiAdobeindesign" },
  { name: "Procreate", icon: "SiApple" },
  { name: "Sketch", icon: "SiSketch" },
  { name: "After Effects", icon: "SiAdobeaftereffects" }
];

export const socialLinks: SocialLink[] = [
  {
    name: "LinkedIn",
    url: "https://linkedin.com/in/alexrivera",
    icon: "linkedin"
  },
  {
    name: "Dribbble",
    url: "https://dribbble.com/alexrivera",
    icon: "dribbble"
  },
  {
    name: "Behance",
    url: "https://behance.net/alexrivera",
    icon: "behance"
  },
  {
    name: "Instagram",
    url: "https://instagram.com/alexrivera.design",
    icon: "instagram"
  }
];

export const aboutText = `I'm a freelance graphic designer with over 8 years of experience creating visual stories that captivate and inspire. My passion lies in transforming ideas into compelling designs that not only look beautiful but also communicate effectively.

I believe that great design is a perfect blend of aesthetics and functionality. Whether it's crafting a brand identity, designing a user interface, or creating custom illustrations, I approach each project with creativity, attention to detail, and a commitment to excellence.

When I'm not designing, you can find me exploring art galleries, sketching in coffee shops, or experimenting with new design techniques. I'm always eager to take on new challenges and collaborate with clients who value quality and innovation.`;
```

