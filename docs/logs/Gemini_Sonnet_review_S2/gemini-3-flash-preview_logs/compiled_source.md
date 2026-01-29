### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/App.tsx:
```tsx
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import PortfolioSection from './components/PortfolioSection';
import ServicesSection from './components/ServicesSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="bg-black min-h-screen">
      <Navigation />
      <main>
        <HeroSection />
        <AboutSection />
        <PortfolioSection />
        <ServicesSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
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

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/components/AboutSection.tsx:
```tsx
import React from 'react';
import SectionContainer from './SectionContainer';
import { bio, tools } from '../data/portfolioData';
import useScrollAnimation from '../hooks/useScrollAnimation';

const AboutSection: React.FC = () => {
  const { elementRef: imgRef, isVisible: imgVisible } = useScrollAnimation(0.2);
  const { elementRef: textRef, isVisible: textVisible } = useScrollAnimation(0.2);

  return (
    <SectionContainer id="about" backgroundColor="white">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        <div 
          ref={imgRef}
          className={`relative transition-all duration-1000 transform ${imgVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >

          <div className="aspect-square rounded-full overflow-hidden border-8 border-[#D4AF37]/20">
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800" 
              alt="Alex Rivera Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-[#D4AF37] rounded-full -z-10 hidden md:block" />
        </div>

        <div 
          ref={textRef}
          className={`transition-all duration-1000 delay-300 transform ${textVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <h2 className="text-[#D4AF37] text-sm font-bold tracking-widest uppercase mb-4">About Me</h2>

          <h3 className="text-4xl font-bold mb-8">Crafting identities through thoughtful design.</h3>
          
          <div className="space-y-6 text-gray-600 leading-relaxed">
            {bio.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-12">
            <h4 className="text-lg font-bold mb-6">My Toolkit</h4>
            <div className="flex flex-wrap gap-3">
              {tools.map((tool) => (
                <span 
                  key={tool} 
                  className="px-4 py-2 border-2 border-[#D4AF37] text-black text-sm font-medium rounded-full"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
};

export default AboutSection;
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/components/Button.tsx:
```tsx
import React from 'react';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-[#D4AF37] text-black hover:bg-[#B8962E]',
    secondary: 'border-2 border-white text-white hover:bg-white hover:text-black',
    ghost: 'bg-transparent text-white hover:bg-white/10',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      className={twMerge(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/components/ContactSection.tsx:
```tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import SectionContainer from './SectionContainer';
import Button from './Button';
import SocialIcon from './SocialIcon';
import { socialLinks } from '../data/portfolioData';
import useScrollAnimation from '../hooks/useScrollAnimation';


const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

const ContactSection: React.FC = () => {
  const { elementRef: leftRef, isVisible: leftVisible } = useScrollAnimation(0.2);
  const { elementRef: rightRef, isVisible: rightVisible } = useScrollAnimation(0.2);

  const {
    register,

    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('Form submitted:', data);
    alert('Thank you for your message! I will get back to you soon.');
    reset();
  };

  return (
    <SectionContainer id="contact" backgroundColor="white">
      <div className="grid md:grid-cols-2 gap-16 overflow-hidden">
        <div 
          ref={leftRef}
          className={`transition-all duration-1000 transform ${leftVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-[50px]'}`}
        >
          <h2 className="text-[#D4AF37] text-sm font-bold tracking-widest uppercase mb-4">Contact</h2>

          <h3 className="text-4xl font-bold mb-8">Let's work together.</h3>
          <p className="text-gray-600 mb-12 leading-relaxed">
            Have a project in mind or just want to say hi? Feel free to reach out using the form or connect with me on social media.
          </p>

          <div className="flex gap-4">
            {socialLinks.map((link) => (
              <SocialIcon key={link.platform} {...link} />
            ))}
          </div>
        </div>

        <div 
          ref={rightRef}
          className={`transition-all duration-1000 transform ${rightVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[50px]'}`}
        >
          <form 
            onSubmit={handleSubmit(onSubmit)} 
            className="space-y-6"
          >

          <div>

            <label htmlFor="name" className="block text-sm font-bold uppercase tracking-wider mb-2">
              Name
            </label>
            <input
              id="name"
              {...register('name')}
              className={`w-full px-4 py-3 bg-gray-50 border-2 focus:outline-none transition-colors ${
                errors.name ? 'border-red-500' : 'border-transparent focus:border-[#D4AF37]'
              }`}
              placeholder="Your Name"
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-bold uppercase tracking-wider mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register('email')}
              className={`w-full px-4 py-3 bg-gray-50 border-2 focus:outline-none transition-colors ${
                errors.email ? 'border-red-500' : 'border-transparent focus:border-[#D4AF37]'
              }`}
              placeholder="your@email.com"
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-bold uppercase tracking-wider mb-2">
              Message
            </label>
            <textarea
              id="message"
              rows={5}
              {...register('message')}
              className={`w-full px-4 py-3 bg-gray-50 border-2 focus:outline-none transition-colors resize-none ${
                errors.message ? 'border-red-500' : 'border-transparent focus:border-[#D4AF37]'
              }`}
              placeholder="Tell me about your project..."
            />
            {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message.message}</p>}
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </Button>
          </form>
        </div>
      </div>

    </SectionContainer>
  );
};

export default ContactSection;
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/components/Footer.tsx:
```tsx
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black py-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <p className="text-gray-500 text-sm tracking-widest uppercase">
          &copy; {new Date().getFullYear()} Alex Rivera. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/components/HeroSection.tsx:
```tsx
import React from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';

const HeroSection: React.FC = () => {
  return (
    <header 
      id="hero" 
      className="relative h-screen w-full flex items-center justify-center overflow-hidden"
    >
      {/* Background Image with Parallax Effect */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=1920")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="relative z-10 text-center px-6">
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-[#D4AF37] mb-4 tracking-tighter">
          Alex Rivera
        </h1>
        <p className="text-xl md:text-2xl text-white font-light tracking-[0.2em] uppercase">
          Designing Visual Stories
        </p>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <a 
          href="#about" 
          aria-label="Scroll down to about section"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <ChevronDownIcon className="w-8 h-8 text-[#D4AF37]" />
        </a>
      </div>
    </header>
  );
};

export default HeroSection;
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/components/Navigation.tsx:
```tsx
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { name: 'Home', href: '#hero' },
  { name: 'About', href: '#about' },
  { name: 'Portfolio', href: '#portfolio' },
  { name: 'Services', href: '#services' },
  { name: 'Contact', href: '#contact' },
];

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    navLinks.forEach((link) => {
      const element = document.getElementById(link.href.substring(1));
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);


  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.substring(1);
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 h-20 flex items-center justify-between">
        <a 
          href="#hero" 
          onClick={(e) => handleNavClick(e, '#hero')}
          className="text-2xl font-bold text-[#D4AF37] tracking-tighter"
        >
          ALEX RIVERA
        </a>

        {/* Desktop Nav */}
        <ul className="hidden md:flex space-x-8">
          {navLinks.map((link) => (
            <li key={link.name}>
              <a
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`text-sm font-medium tracking-widest uppercase transition-colors hover:text-[#D4AF37] ${
                  activeSection === link.href.substring(1) ? 'text-[#D4AF37]' : 'text-white'
                }`}
              >
                {link.name}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-white p-2"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-black z-40 flex flex-col items-center justify-center transition-transform duration-500 md:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <ul className="space-y-8 text-center">
          {navLinks.map((link) => (
            <li key={link.name}>
              <a
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-3xl font-bold text-white hover:text-[#D4AF37] transition-colors"
              >
                {link.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/components/PortfolioSection.tsx:
```tsx
import React, { useState } from 'react';
import SectionContainer from './SectionContainer';
import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModal';
import { projects, Project } from '../data/portfolioData';
import useScrollAnimation from '../hooks/useScrollAnimation';

const PortfolioSection: React.FC = () => {
  const { elementRef, isVisible } = useScrollAnimation(0.1);

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  return (
    <SectionContainer id="portfolio" backgroundColor="black">
      <div className="text-center mb-16">
        <h2 className="text-[#D4AF37] text-sm font-bold tracking-widest uppercase mb-4">Portfolio</h2>
        <h3 className="text-4xl md:text-5xl font-bold text-white">Selected Works</h3>
      </div>

      <div 
        ref={elementRef}
        className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6"
      >
        {projects.map((project, index) => (
          <div 
            key={project.id} 
            className={`transition-all duration-700 transform ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            <ProjectCard 
              project={project} 
              onClick={handleProjectClick} 
            />
          </div>
        ))}
      </div>


      <ProjectModal 
        project={selectedProject} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </SectionContainer>
  );
};

export default PortfolioSection;
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/components/ProjectCard.tsx:
```tsx
import React from 'react';
import { Project } from '../data/portfolioData';

interface ProjectCardProps {
  project: Project;
  onClick: (project: Project) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  return (
    <div 
      className="group relative overflow-hidden cursor-pointer break-inside-avoid mb-6"
      onClick={() => onClick(project)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(project);
        }
      }}
      aria-label={`View details for ${project.title}`}
    >
      <img 
        src={project.thumbnail} 
        alt={project.title} 
        className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center p-6 text-center">
        <span className="text-[#D4AF37] text-sm font-semibold tracking-widest uppercase mb-2">
          {project.category}
        </span>
        <h3 className="text-white text-2xl font-bold">
          {project.title}
        </h3>
        <div className="mt-4 w-12 h-0.5 bg-[#D4AF37] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
      </div>
    </div>
  );
};

export default ProjectCard;
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/components/ProjectModal.tsx:
```tsx
import React, { useEffect, useRef } from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { Project } from '../data/portfolioData';

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEsc);
      // Focus trap: focus the close button or modal container
      modalRef.current?.focus();
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !project) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/95 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div 
        ref={modalRef}
        tabIndex={-1}
        className="relative bg-[#1a1a1a] w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl outline-none animate-in fade-in zoom-in duration-300"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white hover:text-[#D4AF37] transition-colors rounded-full"
          aria-label="Close modal"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-2/3">
            <img 
              src={project.fullImage} 
              alt={project.title} 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="lg:w-1/3 p-8 md:p-12 flex flex-col">
            <span className="text-[#D4AF37] text-sm font-semibold tracking-widest uppercase mb-4">
              {project.category}
            </span>
            <h2 className="text-3xl font-bold text-white mb-6">{project.title}</h2>
            <p className="text-gray-400 leading-relaxed mb-8">
              {project.description}
            </p>

            <div className="mt-auto">
              <h4 className="text-white font-semibold mb-4">Tools Used</h4>
              <div className="flex flex-wrap gap-2">
                {project.tools.map((tool) => (
                  <span 
                    key={tool} 
                    className="px-3 py-1 border border-gray-700 text-gray-400 text-xs rounded-full"
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

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/components/SectionContainer.tsx:
```tsx
import React from 'react';
import { twMerge } from 'tailwind-merge';

interface SectionContainerProps {
  children: React.ReactNode;
  id: string;
  className?: string;
  backgroundColor?: 'black' | 'white' | 'dark-gray';
}

const SectionContainer: React.FC<SectionContainerProps> = ({
  children,
  id,
  className,
  backgroundColor = 'white',
}) => {
  const bgStyles = {
    black: 'bg-black text-white',
    white: 'bg-white text-black',
    'dark-gray': 'bg-[#1a1a1a] text-white',
  };

  return (
    <section
      id={id}
      className={twMerge(
        'py-20 px-6 md:px-12 lg:px-24 min-h-fit',
        bgStyles[backgroundColor],
        className
      )}
    >
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </section>
  );
};

export default SectionContainer;
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/components/ServiceCard.tsx:
```tsx
import React from 'react';
import * as LucideIcons from 'lucide-react';
import { Service } from '../data/portfolioData';

interface ServiceCardProps {
  service: Service;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  // Dynamically get the icon component
  const IconComponent = (LucideIcons as any)[service.iconName];

  return (
    <article className="group p-8 bg-black border border-gray-800 transition-all duration-500 hover:border-[#D4AF37] hover:-translate-y-2">
      <div className="mb-6 inline-block p-4 bg-[#1a1a1a] rounded-lg text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-black transition-colors duration-500">
        {IconComponent && <IconComponent size={32} />}
      </div>
      <h3 className="text-xl font-bold text-white mb-4 group-hover:text-[#D4AF37] transition-colors">
        {service.title}
      </h3>
      <p className="text-gray-400 leading-relaxed">
        {service.description}
      </p>
    </article>
  );
};

export default ServiceCard;
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/components/ServicesSection.tsx:
```tsx
import React from 'react';
import SectionContainer from './SectionContainer';
import ServiceCard from './ServiceCard';
import { services } from '../data/portfolioData';
import useScrollAnimation from '../hooks/useScrollAnimation';

const ServicesSection: React.FC = () => {
  const { elementRef, isVisible } = useScrollAnimation(0.2);

  return (
    <SectionContainer id="services" backgroundColor="dark-gray">

      <div className="text-center mb-16">
        <h2 className="text-[#D4AF37] text-sm font-bold tracking-widest uppercase mb-4">Services</h2>
        <h3 className="text-4xl md:text-5xl font-bold text-white">What I Offer</h3>
      </div>

      <div 
        ref={elementRef}
        className="grid md:grid-cols-3 gap-8"
      >
        {services.map((service, index) => (
          <div 
            key={service.id}
            className={`transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            style={{ transitionDelay: `${index * 150}ms` }}
          >
            <ServiceCard service={service} />
          </div>
        ))}
      </div>

    </SectionContainer>
  );
};

export default ServicesSection;
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/components/SocialIcon.tsx:
```tsx
import React from 'react';
import * as LucideIcons from 'lucide-react';
import { SocialLink } from '../data/portfolioData';

const SocialIcon: React.FC<SocialLink> = ({ platform, url, iconName }) => {
  const IconComponent = (LucideIcons as any)[iconName];

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-[#D4AF37] text-white hover:bg-[#D4AF37] hover:text-black transition-all duration-300"
      aria-label={`Follow Alex Rivera on ${platform}`}
    >
      {IconComponent && <IconComponent size={20} />}
    </a>
  );
};

export default SocialIcon;
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/data/portfolioData.ts:
```typescript
export const bio = [
  "I am Alex Rivera, a freelance graphic designer with over 8 years of experience in crafting visual identities that resonate. My philosophy is rooted in the belief that every brand has a unique story waiting to be told through thoughtful design and meticulous attention to detail.",
  "Based in the vibrant heart of the creative industry, I specialize in branding, UI/UX design, and digital illustration. I've collaborated with startups and established brands alike to transform their visions into compelling visual experiences that drive engagement and growth.",
  "When I'm not pushing pixels, you'll find me exploring local art galleries or experimenting with traditional medium techniques to bring a tactile feel to my digital work."
];

export const tools = [
  "Adobe Photoshop",
  "Figma",
  "Adobe Illustrator",
  "Sketch",
  "Adobe InDesign",
  "After Effects",
  "Procreate",
  "Blender",
  "Webflow",
  "Principle"
];

export interface Project {
  id: string;
  title: string;
  description: string;
  category: 'Branding' | 'UI-UX' | 'Illustration';
  tools: string[];
  thumbnail: string;
  fullImage: string;
}

export const projects: Project[] = [
  {
    id: '1',
    title: 'Lumina Brand Identity',
    description: 'A complete visual overhaul for a sustainable lighting company, focusing on minimalism and eco-friendly aesthetics.',
    category: 'Branding',
    tools: ['Illustrator', 'Photoshop', 'InDesign'],
    thumbnail: 'https://picsum.photos/400/400?random=1',
    fullImage: 'https://picsum.photos/1200/800?random=1'
  },
  {
    id: '2',
    title: 'Zenith Mobile App',
    description: 'A meditation and wellness app designed to provide a seamless, calming user experience with intuitive navigation.',
    category: 'UI-UX',
    tools: ['Figma', 'Principle', 'Photoshop'],
    thumbnail: 'https://picsum.photos/400/600?random=2',
    fullImage: 'https://picsum.photos/1200/800?random=2'
  },
  {
    id: '3',
    title: 'Cyberpunk Series',
    description: 'A series of digital illustrations exploring a neon-soaked future, blending traditional painting styles with digital techniques.',
    category: 'Illustration',
    tools: ['Procreate', 'Photoshop'],
    thumbnail: 'https://picsum.photos/400/400?random=3',
    fullImage: 'https://picsum.photos/1200/800?random=3'
  },
  {
    id: '4',
    title: 'Vortex E-commerce',
    description: 'A high-end fashion e-commerce platform focusing on bold typography and high-quality imagery.',
    category: 'UI-UX',
    tools: ['Figma', 'Webflow'],
    thumbnail: 'https://picsum.photos/400/500?random=4',
    fullImage: 'https://picsum.photos/1200/800?random=4'
  },
  {
    id: '5',
    title: 'Organic Roots Packaging',
    description: 'Packaging design for a premium organic skincare line, utilizing earthy tones and sustainable materials.',
    category: 'Branding',
    tools: ['Illustrator', 'Dimension'],
    thumbnail: 'https://picsum.photos/400/400?random=5',
    fullImage: 'https://picsum.photos/1200/800?random=5'
  },
  {
    id: '6',
    title: 'Abstract Motion',
    description: 'A collection of abstract motion graphics used for digital billboards and social media campaigns.',
    category: 'Illustration',
    tools: ['After Effects', 'Blender'],
    thumbnail: 'https://picsum.photos/400/600?random=6',
    fullImage: 'https://picsum.photos/1200/800?random=6'
  }
];

export interface Service {
  id: string;
  title: string;
  description: string;
  iconName: 'Palette' | 'Layout' | 'PenTool';
}

export const services: Service[] = [
  {
    id: 's1',
    title: 'Brand Strategy',
    description: 'Building cohesive brand identities that communicate your values and connect with your target audience.',
    iconName: 'Palette'
  },
  {
    id: 's2',
    title: 'UI/UX Design',
    description: 'Creating intuitive and engaging digital interfaces that prioritize user experience and business goals.',
    iconName: 'Layout'
  },
  {
    id: 's3',
    title: 'Digital Illustration',
    description: 'Custom illustrations that bring a unique personality and visual flair to your digital and print projects.',
    iconName: 'PenTool'
  }
];

export interface SocialLink {
  platform: string;
  url: string;
  iconName: 'Github' | 'Twitter' | 'Linkedin' | 'Instagram';
}

export const socialLinks: SocialLink[] = [
  { platform: 'Instagram', url: 'https://instagram.com', iconName: 'Instagram' },
  { platform: 'Twitter', url: 'https://twitter.com', iconName: 'Twitter' },
  { platform: 'LinkedIn', url: 'https://linkedin.com', iconName: 'Linkedin' },
  { platform: 'GitHub', url: 'https://github.com', iconName: 'Github' }
];
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/hooks/useScrollAnimation.ts:
```typescript
import { useState, useEffect, useRef } from 'react';

const useScrollAnimation = (threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Once visible, we can stop observing if we only want the animation to play once
          if (elementRef.current) {
            observer.unobserve(elementRef.current);
          }
        }
      },
      { threshold }
    );

    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [threshold]);

  return { elementRef, isVisible };
};

export default useScrollAnimation;
```

