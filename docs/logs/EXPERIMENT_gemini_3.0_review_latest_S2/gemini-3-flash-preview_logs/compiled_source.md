### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/App.tsx:
```tsx
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-black text-white selection:bg-amber-500/30 selection:text-amber-500">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/main.tsx:
```tsx
import React, { useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const Root = () => {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};

createRoot(document.getElementById('root')!).render(<Root />);

```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/components/home/About.tsx:
```tsx
import React from 'react';
import Section from '../ui/Section';
import Heading from '../ui/Heading';

const skills = [
  'Adobe Creative Suite', 'Figma', 'React / Next.js', 
  'Tailwind CSS', 'Brand Identity', 'UI/UX Design', 
  '3D Modeling', 'Motion Graphics', 'Typography'
];

const About: React.FC = () => {
  return (
    <Section id="about" className="bg-[#0a0a0a]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Image Column */}
        <div className="relative group">
          <div className="absolute -inset-4 border border-[#D4AF37]/30 translate-x-2 translate-y-2 transition-transform group-hover:translate-x-0 group-hover:translate-y-0"></div>
          <img 
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800"
            alt="Alex Rivera Professional Portrait"
            className="relative z-10 w-full grayscale hover:grayscale-0 transition-all duration-700 object-cover aspect-[4/5]"
          />
        </div>

        {/* Text Column */}
        <div>
          <Heading 
            title="About Me" 
            subtitle="Crafting digital experiences that blend artistic vision with technical precision."
          />
          
          <div className="space-y-6 text-gray-400 text-lg leading-relaxed">
            <p>
              With over a decade of experience in the design industry, I've helped brands transform their digital presence through thoughtful aesthetics and user-centric solutions.
            </p>
            <p>
              My approach is rooted in the belief that great design is not just how it looks, but how it functions and feels. I specialize in creating high-end visual identities and seamless digital interfaces for luxury brands and innovative startups.
            </p>
          </div>

          <div className="mt-12">
            <h3 className="text-[#D4AF37] uppercase tracking-widest text-sm font-bold mb-6">Tools & Expertise</h3>
            <div className="flex flex-wrap gap-3">
              {skills.map((skill) => (
                <span 
                  key={skill}
                  className="px-4 py-2 border border-white/10 bg-white/5 text-white text-xs uppercase tracking-widest hover:border-[#D4AF37] transition-colors cursor-default"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default About;
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/components/home/Contact.tsx:
```tsx
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
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/components/home/Hero.tsx:
```tsx
import React from 'react';
import GoldButton from '../ui/GoldButton';

const Hero: React.FC = () => {
  return (
    <section 
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black"
    >
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=2070")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl">
        <h1 className="text-5xl md:text-8xl font-bold text-white uppercase tracking-tighter mb-6">
          Alex <span className="text-[#D4AF37]">Rivera</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 font-light tracking-widest uppercase mb-10">
          Visual Designer & Digital Architect
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <GoldButton onClick={() => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })}>
            View Portfolio
          </GoldButton>
          <GoldButton 
            variant="outline" 
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Get In Touch
          </GoldButton>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-[1px] h-12 bg-gradient-to-b from-[#D4AF37] to-transparent"></div>
      </div>
    </section>
  );
};

export default Hero;
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/components/home/Portfolio.tsx:
```tsx
import React, { useState } from 'react';
import Section from '../ui/Section';
import Heading from '../ui/Heading';
import ProjectModal from './ProjectModal';
import { portfolioProjects, Project } from '../../data/portfolio';

const Portfolio: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <Section id="portfolio" className="bg-[#0a0a0a]">
      <Heading 
        title="Selected Works" 
        subtitle="A collection of projects where strategy meets aesthetics. Each piece is a unique solution to a complex challenge."
        centered
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolioProjects.map((project) => (
          <div 
            key={project.id}
            className="group relative overflow-hidden cursor-pointer aspect-[4/3]"
            onClick={() => setSelectedProject(project)}
          >
            {/* Image Container */}
            <div className="w-full h-full transition-transform duration-700 ease-out group-hover:scale-110">
              <img 
                src={project.imageUrl} 
                alt={project.title} 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
              <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest mb-2 block">
                  {project.category}
                </span>
                <h3 className="text-white text-xl font-bold uppercase tracking-tighter">
                  {project.title}
                </h3>
                <div className="h-0.5 w-0 group-hover:w-12 bg-[#D4AF37] mt-2 transition-all duration-500 delay-100"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ProjectModal 
        project={selectedProject} 
        onClose={() => setSelectedProject(null)} 
      />
    </Section>
  );
};

export default Portfolio;
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/components/home/ProjectModal.tsx:
```tsx
import React, { useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { Project } from '../../data/portfolio';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    
    if (project) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-[#111] border border-white/10 rounded-lg shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white hover:text-[#D4AF37] transition-colors rounded-full"
          aria-label="Close modal"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        <div className="flex flex-col md:flex-row">
          <div className="md:w-3/5">
            <img
              src={project.imageUrl}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="md:w-2/5 p-8 flex flex-col">
            <span className="text-[#D4AF37] text-sm font-medium uppercase tracking-widest mb-2">
              {project.category}
            </span>
            <h3 className="text-3xl font-bold text-white mb-4 uppercase tracking-tighter">
              {project.title}
            </h3>
            <div className="h-1 w-12 bg-[#D4AF37] mb-6"></div>
            
            <p className="text-gray-400 mb-8 leading-relaxed">
              {project.description}
            </p>

            <div className="mt-auto">
              <h4 className="text-white text-sm font-bold uppercase mb-3 tracking-wider">Tools Used</h4>
              <div className="flex flex-wrap gap-2">
                {project.tools.map((tool) => (
                  <span 
                    key={tool} 
                    className="px-3 py-1 text-xs border border-white/20 text-gray-300 rounded-full"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/components/home/Services.tsx:
```tsx
import React from 'react';
import { Palette, Layers, PenTool } from 'lucide-react';
import Section from '../ui/Section';
import Heading from '../ui/Heading';

const services = [
  {
    title: 'Branding',
    description: 'Crafting unique visual identities that resonate with your audience and stand the test of time.',
    icon: Palette,
  },
  {
    title: 'UI/UX Design',
    description: 'Designing intuitive, user-centric interfaces that provide seamless digital experiences across all devices.',
    icon: Layers,
  },
  {
    title: 'Illustration',
    description: 'Creating bespoke digital illustrations and assets that bring personality and depth to your brand.',
    icon: PenTool,
  },
];

const Services: React.FC = () => {
  return (
    <Section id="services" className="bg-[#0a0a0a]">
      <Heading 
        title="Services" 
        subtitle="Specialized solutions tailored to elevate your digital presence and brand identity."
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <div 
            key={index} 
            className="group p-8 border border-white/10 bg-black hover:border-[#D4AF37]/50 transition-all duration-500"
          >
            <div className="mb-6 inline-block">
              <service.icon className="w-10 h-10 text-[#D4AF37]" />
            </div>
            <h3 className="text-xl font-bold uppercase tracking-wider mb-4 group-hover:text-[#D4AF37] transition-colors">
              {service.title}
            </h3>
            <p className="text-gray-400 leading-relaxed">
              {service.description}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
};

export default Services;
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/components/layout/Footer.tsx:
```tsx
import { Instagram, Linkedin, Dribbble } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white py-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-8 md:mb-0">
          <a href="#" className="text-2xl font-bold tracking-tighter">
            ALEX<span className="text-amber-500">RIVERA</span>
          </a>
          <p className="mt-2 text-gray-500 text-sm">
            Crafting digital experiences with precision and soul.
          </p>
        </div>

        <div className="flex flex-col items-center md:items-end">
          <div className="flex space-x-6 mb-4">
            <a href="#" className="text-gray-400 hover:text-amber-500 transition-colors">
              <Instagram size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-amber-500 transition-colors">
              <Linkedin size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-amber-500 transition-colors">
              <Dribbble size={20} />
            </a>
          </div>
          <p className="text-gray-600 text-xs">
            © {currentYear} Alex Rivera. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/components/layout/Header.tsx:
```tsx
import { useState, useEffect } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'About', href: '#about' },
    { name: 'Portfolio', href: '#portfolio' },
    { name: 'Services', href: '#services' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/90 backdrop-blur-md py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <a href="#" className="text-2xl font-bold tracking-tighter text-white">
          ALEX<span className="text-amber-500">RIVERA</span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm uppercase tracking-widest text-gray-300 hover:text-amber-500 transition-colors"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <XMarkIcon className="h-8 w-8" />
          ) : (
            <Bars3Icon className="h-8 w-8" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-black absolute top-full left-0 right-0 border-t border-white/10">
          <nav className="flex flex-col p-6 space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg uppercase tracking-widest text-gray-300 hover:text-amber-500"
              >
                {link.name}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/components/ui/GoldButton.tsx:
```tsx
import React from 'react';
import { twMerge } from 'tailwind-merge';

interface GoldButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'solid' | 'outline';
  children: React.ReactNode;
}

const GoldButton: React.FC<GoldButtonProps> = ({ 
  variant = 'solid', 
  children, 
  className, 
  ...props 
}) => {
  const baseStyles = "px-6 py-3 font-medium transition-all duration-300 uppercase tracking-widest text-sm";
  const variants = {
    solid: "bg-[#D4AF37] text-black hover:bg-[#C5A028] border border-[#D4AF37]",
    outline: "bg-transparent text-[#D4AF37] border border-[#D4AF37] hover:bg-[#D4AF37] hover:text-black"
  };

  return (
    <button 
      className={twMerge(baseStyles, variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
};

export default GoldButton;
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/components/ui/Heading.tsx:
```tsx
import React from 'react';
import { twMerge } from 'tailwind-merge';

interface HeadingProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

const Heading: React.FC<HeadingProps> = ({ 
  title, 
  subtitle, 
  centered = false, 
  className 
}) => {
  return (
    <div className={twMerge("mb-12", centered ? "text-center" : "text-left", className)}>
      <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-tighter mb-4">
        {title}
        <span className="block h-1 w-12 bg-[#D4AF37] mt-2" style={{ margin: centered ? '0.5rem auto 0' : '0.5rem 0 0' }}></span>
      </h2>
      {subtitle && (
        <p className="text-gray-400 max-w-2xl mt-4 text-lg">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default Heading;
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/components/ui/Section.tsx:
```tsx
import React from 'react';
import { twMerge } from 'tailwind-merge';

interface SectionProps {
  id?: string;
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
}

const Section: React.FC<SectionProps> = ({ 
  id, 
  children, 
  className, 
  containerClassName 
}) => {
  return (
    <section 
      id={id} 
      className={twMerge("py-20 px-4 sm:px-6 lg:px-8 bg-black text-white", className)}
    >
      <div className={twMerge("max-w-7xl mx-auto", containerClassName)}>
        {children}
      </div>
    </section>
  );
};

export default Section;
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/data/portfolio.ts:
```typescript
import { faker } from '@faker-js/faker';

export interface Project {
  id: string;
  title: string;
  description: string;
  tools: string[];
  imageUrl: string;
  category: string;
}

const categories = ['Branding', 'UI/UX Design', 'Illustration', 'Web Development'];
const toolPool = ['React', 'TypeScript', 'Tailwind CSS', 'Figma', 'Adobe XD', 'Node.js', 'Three.js', 'PostgreSQL'];

export const portfolioProjects: Project[] = Array.from({ length: 6 }).map((_, index) => ({
  id: faker.string.uuid(),
  title: faker.commerce.productName(),
  description: faker.lorem.paragraph(2),
  tools: faker.helpers.arrayElements(toolPool, 3),
  imageUrl: `https://picsum.photos/800/600?random=${index + 10}`,
  category: faker.helpers.arrayElement(categories),
}));

export default portfolioProjects;
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/pages/Home.tsx:
```tsx
import React from 'react';
import Hero from '../components/home/Hero';
import About from '../components/home/About';
import Portfolio from '../components/home/Portfolio';
import Services from '../components/home/Services';
import Contact from '../components/home/Contact';

const Home: React.FC = () => {
  return (
    <main className="bg-black">
      <div className="animate-fade-in">
        <Hero />
      </div>
      <div className="reveal">
        <About />
      </div>
      <div className="reveal">
        <Portfolio />
      </div>
      <div className="reveal">
        <Services />
      </div>
      <div className="reveal">
        <Contact />
      </div>
    </main>
  );
};

export default Home;
```

