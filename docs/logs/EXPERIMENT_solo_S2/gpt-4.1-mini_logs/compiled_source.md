### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/App.tsx:
```tsx
import React from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { PortfolioSection } from './components/PortfolioSection';
import { ServicesSection } from './components/ServicesSection';
import { ContactSection } from './components/ContactSection';

export default function App() {
  return (
    <>
      <Navbar />
      <main className="bg-black font-sans">
        <HeroSection />
        <AboutSection />
        <PortfolioSection />
        <ServicesSection />
        <ContactSection />
      </main>
    </>
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

const tools = ['Adobe Photoshop', 'Adobe Illustrator', 'Figma', 'Sketch', 'Procreate', 'InDesign'];

export const AboutSection: React.FC = () => {
  return (
    <section
      id="about"
      className="max-w-7xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center gap-12"
      aria-labelledby="about-title"
    >
      <img
        src="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=400&q=80"
        alt="Alex Rivera"
        className="w-48 h-48 rounded-full object-cover shadow-lg flex-shrink-0"
      />
      <div className="max-w-xl text-white">
        <h2 id="about-title" className="text-4xl font-bold mb-6 font-sans">
          About Alex
        </h2>
        <p className="mb-6 leading-relaxed">
          Alex Rivera is a passionate freelance graphic designer specializing in creating compelling visual stories that connect brands with their audiences. With a keen eye for detail and a love for clean, modern design, Alex brings ideas to life through innovative and thoughtful design solutions.
        </p>
        <h3 className="text-2xl font-semibold mb-3">Tools & Technologies</h3>
        <ul className="grid grid-cols-2 gap-2 list-disc list-inside">
          {tools.map((tool) => (
            <li key={tool} className="text-yellow-400">
              {tool}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/components/ContactSection.tsx:
```tsx
import React, { useState } from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[\w-.]+@[\w-]+\.[a-z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      // For demo, just mark submitted
      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      setErrors({});
    }
  };

  return (
    <section
      id="contact"
      className="max-w-7xl mx-auto px-6 py-20 text-white"
      aria-labelledby="contact-title"
    >
      <h2 id="contact-title" className="text-4xl font-bold mb-12 font-sans text-center">
        Contact
      </h2>
      <div className="max-w-3xl mx-auto">
        {submitted && (
          <div
            className="mb-6 p-4 bg-yellow-400 text-black rounded"
            role="alert"
            aria-live="polite"
          >
            Thank you for your message! I will get back to you soon.
          </div>
        )}
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-6">
            <label htmlFor="name" className="block mb-2 font-semibold">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded bg-black bg-opacity-50 border border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white ${
                errors.name ? 'border-red-500' : ''
              }`}
              aria-invalid={errors.name ? 'true' : 'false'}
              aria-describedby={errors.name ? 'name-error' : undefined}
            />
            {errors.name && (
              <p id="name-error" className="mt-1 text-red-500 text-sm">
                {errors.name}
              </p>
            )}
          </div>
          <div className="mb-6">
            <label htmlFor="email" className="block mb-2 font-semibold">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded bg-black bg-opacity-50 border border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white ${
                errors.email ? 'border-red-500' : ''
              }`}
              aria-invalid={errors.email ? 'true' : 'false'}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && (
              <p id="email-error" className="mt-1 text-red-500 text-sm">
                {errors.email}
              </p>
            )}
          </div>
          <div className="mb-6">
            <label htmlFor="message" className="block mb-2 font-semibold">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              value={formData.message}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded bg-black bg-opacity-50 border border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white resize-none ${
                errors.message ? 'border-red-500' : ''
              }`}
              aria-invalid={errors.message ? 'true' : 'false'}
              aria-describedby={errors.message ? 'message-error' : undefined}
            />
            {errors.message && (
              <p id="message-error" className="mt-1 text-red-500 text-sm">
                {errors.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="bg-yellow-400 text-black font-semibold px-6 py-3 rounded hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            Send Message
          </button>
        </form>
        <div className="mt-12 flex justify-center space-x-8 text-yellow-400 text-2xl" aria-label="Social media links">
          <a href="https://facebook.com/alexrivera" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <FaFacebookF />
          </a>
          <a href="https://twitter.com/alexrivera" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <FaTwitter />
          </a>
          <a href="https://instagram.com/alexrivera" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <FaInstagram />
          </a>
          <a href="https://linkedin.com/in/alexrivera" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <FaLinkedinIn />
          </a>
        </div>
      </div>
    </section>
  );
};
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/components/HeroSection.tsx:
```tsx
import React from 'react';

export const HeroSection: React.FC = () => {
  return (
    <section
      id="hero"
      className="relative h-screen flex items-center justify-center text-center text-white"
      aria-label="Hero Section"
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1470&q=80)' }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-black bg-opacity-60" aria-hidden="true" />
      <div className="relative z-10 max-w-4xl px-6">
        <h1 className="text-6xl md:text-8xl font-extrabold tracking-wide mb-4 font-sans">Alex Rivera</h1>
        <p className="text-2xl md:text-3xl font-light italic tracking-wide">Designing Visual Stories</p>
      </div>
    </section>
  );
};
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/components/Navbar.tsx:
```tsx
import React, { useState, useEffect } from 'react';

const navLinks = [
  { name: 'Home', href: '#hero' },
  { name: 'About', href: '#about' },
  { name: 'Portfolio', href: '#portfolio' },
  { name: 'Services', href: '#services' },
  { name: 'Contact', href: '#contact' },
];

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, href: string) => {
    e.preventDefault();
    const id = href.replace('#', '');
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-colors duration-500 ${
        scrolled ? 'bg-black bg-opacity-90 shadow-lg' : 'bg-transparent'
      }`}
      aria-label="Primary Navigation"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-center space-x-8">
        {navLinks.map(({ name, href }) => (
          <a
            key={name}
            href={href}
            onClick={(e) => handleClick(e, href)}
            className="text-white uppercase font-semibold tracking-wide hover:text-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            {name}
          </a>
        ))}
      </div>
    </nav>
  );
};
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/components/PortfolioSection.tsx:
```tsx
import React, { useState } from 'react';

interface Project {
  id: number;
  title: string;
  description: string;
  tools: string[];
  thumbnail: string;
  image: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: 'Brand Identity for Luxe Co.',
    description: 'Developed a sophisticated brand identity including logo, color palette, and typography for a luxury fashion brand.',
    tools: ['Adobe Illustrator', 'Photoshop'],
    thumbnail: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=400&q=80',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 2,
    title: 'Mobile App UI for Foodie',
    description: 'Designed a clean and intuitive UI for a food delivery mobile app, focusing on user experience and accessibility.',
    tools: ['Figma', 'Sketch'],
    thumbnail: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=400&q=80',
    image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 3,
    title: 'Illustration Series: Urban Life',
    description: 'Created a series of digital illustrations capturing the vibrancy and diversity of urban life.',
    tools: ['Procreate'],
    thumbnail: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=400&q=80',
    image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 4,
    title: 'Website Redesign for TechStart',
    description: 'Led the redesign of a tech startup website to improve branding and user engagement.',
    tools: ['Adobe XD', 'Photoshop'],
    thumbnail: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=400&q=80',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 5,
    title: 'Packaging Design for Organic Goods',
    description: 'Designed eco-friendly packaging for an organic food brand emphasizing sustainability and simplicity.',
    tools: ['Illustrator', 'InDesign'],
    thumbnail: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=400&q=80',
    image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 6,
    title: 'Event Poster Series',
    description: 'Created a series of posters for cultural events using bold typography and vibrant colors.',
    tools: ['Photoshop', 'Illustrator'],
    thumbnail: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=400&q=80',
    image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1200&q=80',
  },
];

export const PortfolioSection: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const openModal = (project: Project) => {
    setSelectedProject(project);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedProject(null);
    document.body.style.overflow = '';
  };

  return (
    <section
      id="portfolio"
      className="max-w-7xl mx-auto px-6 py-20 text-white"
      aria-labelledby="portfolio-title"
    >
      <h2 id="portfolio-title" className="text-4xl font-bold mb-12 font-sans text-center">
        Portfolio
      </h2>
      <div className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6">
        {projects.map((project) => (
          <button
            key={project.id}
            onClick={() => openModal(project)}
            className="w-full mb-6 break-inside-avoid rounded overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300 focus:outline-none focus:ring-4 focus:ring-yellow-400"
            aria-haspopup="dialog"
            aria-label={`View details of project ${project.title}`}
          >
            <img
              src={project.thumbnail}
              alt={project.title}
              className="w-full object-cover rounded"
              loading="lazy"
            />
          </button>
        ))}
      </div>

      {selectedProject && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          tabIndex={-1}
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-6 z-50"
          onClick={closeModal}
          onKeyDown={(e) => {
            if (e.key === 'Escape') closeModal();
          }}
        >
          <div
            className="bg-black rounded-lg max-w-4xl w-full max-h-full overflow-auto p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              aria-label="Close project details"
              className="absolute top-4 right-4 text-yellow-400 hover:text-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded"
            >
              &#10005;
            </button>
            <h3 id="modal-title" className="text-3xl font-bold mb-4">
              {selectedProject.title}
            </h3>
            <img
              src={selectedProject.image}
              alt={selectedProject.title}
              className="w-full rounded mb-4 object-cover"
              loading="lazy"
            />
            <p className="mb-4 leading-relaxed">{selectedProject.description}</p>
            <h4 className="font-semibold mb-2">Tools Used:</h4>
            <ul className="list-disc list-inside flex flex-wrap gap-2">
              {selectedProject.tools.map((tool) => (
                <li key={tool} className="text-yellow-400">
                  {tool}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
};
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/components/ServicesSection.tsx:
```tsx
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
```

