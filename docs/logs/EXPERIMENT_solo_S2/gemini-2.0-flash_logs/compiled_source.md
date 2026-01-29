### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/App.tsx:
```tsx
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
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
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/components/Contact.tsx:
```tsx
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
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/components/Hero.tsx:
```tsx
import React from 'react';

const Hero = () => {
  return (
    <section id="home" className="relative h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url('https://images.unsplash.com/photo-1607704273424-c49e3739dd7f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')` }}>
      <div className="absolute inset-0 bg-black-rgba"></div>
      <div className="container mx-auto text-center relative z-10">
        <h1 className="text-5xl font-bold text-white">Alex Rivera</h1>
        <p className="text-2xl text-gold mt-4">Designing Visual Stories</p>
      </div>
    </section>
  );
};

export default Hero;
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/components/Navbar.tsx:
```tsx
import React from 'react';

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 bg-black-rgba text-white py-4">
      <div className="container mx-auto flex items-center justify-between">
        <a href="#home" className="text-2xl font-bold">Alex Rivera</a>
        <ul className="flex space-x-6">
          <li><a href="#home" className="hover:text-gold transition-colors">Home</a></li>
          <li><a href="#about" className="hover:text-gold transition-colors">About</a></li>
          <li><a href="#portfolio" className="hover:text-gold transition-colors">Portfolio</a></li>
          <li><a href="#services" className="hover:text-gold transition-colors">Services</a></li>
          <li><a href="#contact" className="hover:text-gold transition-colors">Contact</a></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/components/Portfolio.tsx:
```tsx
import React from 'react';

const Portfolio = () => {
  const projects = [
    { id: 1, title: 'Project 1', imageUrl: 'https://images.unsplash.com/photo-1517245412974-e3d44e310809?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { id: 2, title: 'Project 2', imageUrl: 'https://images.unsplash.com/photo-1589827492973-1c66f94489f0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { id: 3, title: 'Project 3', imageUrl: 'https://images.unsplash.com/photo-1567095761054-7a02e69e5c4c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { id: 4, title: 'Project 4', imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { id: 5, title: 'Project 5', imageUrl: 'https://images.unsplash.com/photo-1519389950473-47a04ca0ecc7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { id: 6, title: 'Project 6', imageUrl: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  ];

  return (
    <section id="portfolio" className="py-20 bg-gray-100">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Portfolio</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => (
            <div key={project.id} className="shadow-lg rounded-lg overflow-hidden">
              <img src={project.imageUrl} alt={project.title} className="w-full h-64 object-cover" />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800">{project.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/components/ProjectDetails.tsx:
```tsx
// src/components/ProjectDetails.tsx
import React from 'react';

interface ProjectDetailsProps {
  project: {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    tools: string[];
  };
  onClose: () => void;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ project, onClose }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black-rgba flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-2xl">
        <h2 className="text-3xl font-bold mb-4">{project.title}</h2>
        <img src={project.imageUrl} alt={project.title} className="w-full mb-4 rounded-lg" />
        <p className="text-gray-700 mb-4">{project.description}</p>
        <h3 className="text-xl font-semibold mb-2">Tools Used</h3>
        <ul className="flex flex-wrap gap-2 mb-4">
          {project.tools.map((tool, index) => (
            <li key={index} className="bg-gray-200 rounded-full px-3 py-1 text-sm font-medium text-gray-700">{tool}</li>
          ))}
        </ul>
        <button onClick={onClose} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">
          Close
        </button>
      </div>
    </div>
  );
};

export default ProjectDetails;
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/components/Services.tsx:
```tsx
import React from 'react';
import { FaLaptopCode, FaPalette, FaPencilRuler } from 'react-icons/fa';

const Services = () => {
  return (
    <section id="services" className="py-20 bg-white">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <FaPalette size={64} className="mx-auto text-gold mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Branding</h3>
            <p className="text-gray-700">Creating unique and memorable brand identities.</p>
          </div>
          <div className="text-center">
            <FaLaptopCode size={64} className="mx-auto text-gold mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">UI/UX Design</h3>
            <p className="text-gray-700">Designing intuitive and user-friendly interfaces.</p>
          </div>
          <div className="text-center">
            <FaPencilRuler size={64} className="mx-auto text-gold mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Illustration</h3>
            <p className="text-gray-700">Creating custom illustrations for various purposes.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
```

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/pages/Home.tsx:
```tsx
import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Portfolio from '../components/Portfolio';
import Services from '../components/Services';
import Contact from '../components/Contact';

const Home = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <About />
      <Portfolio />
      <Services />
      <Contact />
    </div>
  );
};

export default Home;
```

