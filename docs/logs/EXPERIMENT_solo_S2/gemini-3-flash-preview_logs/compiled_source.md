### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/App.tsx:
```tsx
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PortfolioPage from "./pages/PortfolioPage";

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
import React from 'react';

const About: React.FC = () => {
  const skills = ['Adobe Creative Suite', 'Figma', 'Brand Strategy', 'Typography', 'UI/UX Design', 'Motion Graphics'];

  return (
    <section id="about" className="py-24 bg-white text-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-full h-full border-2 border-[#D4AF37] z-0"></div>
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800" 
              alt="Alex Rivera" 
              className="relative z-10 w-full grayscale hover:grayscale-0 transition-all duration-700"
            />
          </div>
          
          <div>
            <h2 className="text-4xl font-bold mb-6 uppercase tracking-tighter">About Me</h2>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              I am a freelance graphic designer based in New York, specializing in creating cohesive brand identities and digital experiences. With over 8 years of experience, I blend artistic intuition with strategic thinking to help brands tell their unique stories.
            </p>
            
            <h3 className="text-xl font-bold mb-4 text-[#D4AF37] uppercase tracking-widest">Expertise</h3>
            <div className="grid grid-cols-2 gap-4">
              {skills.map((skill) => (
                <div key={skill} className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-[#D4AF37]"></div>
                  <span className="text-sm font-medium uppercase tracking-tight">{skill}</span>
                </div>
              ))}
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
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/components/Footer.tsx:
```tsx
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="py-12 border-t border-gray-900 bg-black">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
        <p className="text-gray-500 text-sm uppercase tracking-widest">
          © {new Date().getFullYear()} Alex Rivera. All Rights Reserved.
        </p>
        <div className="mt-4 md:mt-0">
          <p className="text-gray-500 text-xs uppercase tracking-[0.2em]">
            Designed with <span className="text-[#D4AF37]">Precision</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/components/Hero.tsx:
```tsx
import React from 'react';

const Hero: React.FC = () => {
  return (
    <section id="home" className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=2000")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
      </div>
      
      <div className="relative z-10 text-center px-4">
        <h1 className="text-6xl md:text-9xl font-bold mb-4 tracking-tight animate-fade-in">
          ALEX RIVERA
        </h1>
        <div className="h-1 w-24 bg-[#D4AF37] mx-auto mb-6"></div>
        <p className="text-xl md:text-2xl uppercase tracking-[0.3em] font-light text-gray-300">
          Designing Visual Stories
        </p>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <a href="#about" className="text-[#D4AF37]">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </a>
      </div>
    </section>
  );
};

export default Hero;
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/components/Navbar.tsx:
```tsx
import React, { useState, useEffect } from 'react';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Portfolio', href: '#portfolio' },
    { name: 'Services', href: '#services' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-black/90 backdrop-blur-md py-4 border-b border-[#D4AF37]/20' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <a href="#home" className="text-2xl font-bold tracking-tighter">
          ALEX<span className="text-[#D4AF37]">RIVERA</span>
        </a>
        <div className="hidden md:flex space-x-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm uppercase tracking-widest hover:text-[#D4AF37] transition-colors"
            >
              {link.name}
            </a>
          ))}
        </div>
        <button className="md:hidden text-[#D4AF37]">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/components/Portfolio.tsx:
```tsx
import React, { useState } from 'react';

interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  image: string;
  tools: string[];
}

const projects: Project[] = [
  {
    id: 1,
    title: "Lumina Branding",
    category: "Branding",
    description: "A complete visual identity for a sustainable lighting company.",
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=800",
    tools: ["Illustrator", "Photoshop"]
  },
  {
    id: 2,
    title: "Ether App UI",
    category: "UI/UX",
    description: "Minimalist interface for a cryptocurrency tracking application.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
    tools: ["Figma", "After Effects"]
  },
  {
    id: 3,
    title: "Vogue Editorial",
    category: "Illustration",
    description: "Custom digital illustrations for a fashion editorial piece.",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=800",
    tools: ["Procreate", "Photoshop"]
  },
  {
    id: 4,
    title: "Apex Identity",
    category: "Branding",
    description: "Modern logo and brand guidelines for a tech startup.",
    image: "https://images.unsplash.com/photo-1634942537034-2531766767d1?auto=format&fit=crop&q=80&w=800",
    tools: ["Illustrator", "InDesign"]
  },
  {
    id: 5,
    title: "Zenith Web",
    category: "UI/UX",
    description: "High-conversion landing page for a luxury watch brand.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
    tools: ["Figma", "Webflow"]
  },
  {
    id: 6,
    title: "Urban Series",
    category: "Illustration",
    description: "A series of posters exploring urban architecture through geometry.",
    image: "https://images.unsplash.com/photo-1572044162444-ad60f128bde2?auto=format&fit=crop&q=80&w=800",
    tools: ["Illustrator"]
  }
];

const Portfolio: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <section id="portfolio" className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-bold uppercase tracking-tighter">Selected Works</h2>
            <p className="text-[#D4AF37] mt-2 uppercase tracking-widest text-sm">Portfolio 2024</p>
          </div>
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
          {projects.map((project) => (
            <div 
              key={project.id} 
              className="relative group cursor-pointer overflow-hidden break-inside-avoid"
              onClick={() => setSelectedProject(project)}
            >
              <img 
                src={project.image} 
                alt={project.title} 
                className="w-full grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center text-center p-6">
                <p className="text-[#D4AF37] text-xs uppercase tracking-widest mb-2">{project.category}</p>
                <h3 className="text-2xl font-bold uppercase">{project.title}</h3>
                <div className="mt-4 h-[1px] w-12 bg-[#D4AF37]"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm">
          <div className="max-w-5xl w-full bg-white text-black overflow-hidden flex flex-col md:flex-row">
            <div className="md:w-2/3">
              <img src={selectedProject.image} alt={selectedProject.title} className="w-full h-full object-cover" />
            </div>
            <div className="md:w-1/3 p-8 flex flex-col justify-between">
              <div>
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="mb-8 text-sm uppercase tracking-widest flex items-center hover:text-[#D4AF37]"
                >
                  <span className="mr-2">←</span> Close
                </button>
                <p className="text-[#D4AF37] text-xs uppercase tracking-widest mb-2">{selectedProject.category}</p>
                <h3 className="text-3xl font-bold uppercase mb-4">{selectedProject.title}</h3>
                <p className="text-gray-600 mb-6">{selectedProject.description}</p>
                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase tracking-widest">Tools Used:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tools.map(tool => (
                      <span key={tool} className="text-[10px] border border-black px-2 py-1 uppercase">{tool}</span>
                    ))}
                  </div>
                </div>
              </div>
              <button className="mt-8 w-full py-4 bg-black text-white uppercase tracking-widest text-sm hover:bg-[#D4AF37] transition-colors">
                View Case Study
              </button>
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
import React from 'react';
import { Palette, Layout, PenTool } from 'lucide-react';

const services = [
  {
    title: "Branding",
    description: "Crafting unique visual identities that resonate with your audience and stand the test of time.",
    icon: <Palette className="w-12 h-12 text-[#D4AF37]" />
  },
  {
    title: "UI/UX Design",
    description: "Designing intuitive digital interfaces that prioritize user experience and business goals.",
    icon: <Layout className="w-12 h-12 text-[#D4AF37]" />
  },
  {
    title: "Illustration",
    description: "Bespoke digital and traditional illustrations that add a unique touch to any project.",
    icon: <PenTool className="w-12 h-12 text-[#D4AF37]" />
  }
];

const Services: React.FC = () => {
  return (
    <section id="services" className="py-24 bg-white text-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold uppercase tracking-tighter">Services</h2>
          <div className="h-1 w-12 bg-[#D4AF37] mx-auto mt-4"></div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-12">
          {services.map((service) => (
            <div key={service.title} className="p-8 border border-gray-100 hover:border-[#D4AF37] transition-colors group">
              <div className="mb-6">{service.icon}</div>
              <h3 className="text-2xl font-bold uppercase mb-4">{service.title}</h3>
              <p className="text-gray-600 leading-relaxed">{service.description}</p>
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
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Portfolio from '../components/Portfolio';
import Services from '../components/Services';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

const PortfolioPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#D4AF37] selection:text-black">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Portfolio />
        <Services />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default PortfolioPage;
```

