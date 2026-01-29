### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/App.tsx:
```tsx
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from './pages/Home';

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

### C:/Users/Mahdi Abouzid/Desktop/POKIO/POKIO_production/app_template/react-app/src/pages/Home.tsx:
```tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const projects = [
    {
      id: 1,
      title: "Brand Identity for Tech Startup",
      description: "Complete brand identity design including logo, color palette, and marketing materials.",
      image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      tools: ["Adobe Illustrator", "Photoshop", "Figma"]
    },
    {
      id: 2,
      title: "E-commerce Website Redesign",
      description: "Modern e-commerce interface with improved user experience and conversion optimization.",
      image: "https://images.unsplash.com/photo-1551434678e792c7fa38ba973806b3b2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      tools: ["Figma", "Sketch", "Adobe XD"]
    },
    {
      id: 3,
      title: "Mobile App UI Design",
      description: "Intuitive mobile interface design for a fitness tracking application.",
      image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      tools: ["Figma", "Adobe XD", "Sketch"]
    },
    {
      id: 4,
      title: "Illustration Series for Children's Book",
      description: "Colorful illustrations for a children's book series with consistent character design.",
      image: "https://images.unsplash.com/photo-1551434678e792c7fa38ba973806b3b2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      tools: ["Procreate", "Adobe Illustrator"]
    },
    {
      id: 5,
      title: "Corporate Website Design",
      description: "Modern corporate website with responsive design and CMS integration.",
      image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      tools: ["Figma", "Webflow", "Photoshop"]
    },
    {
      id: 6,
      title: "Packaging Design for Organic Brand",
      description: "Sustainable packaging design for an organic food brand with eco-friendly materials.",
      image: "https://images.unsplash.com/photo-1551434678e792c7fa38ba973806b3b2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      tools: ["Adobe Illustrator", "Photoshop", "InDesign"]
    }
  ];

  const services = [
    {
      id: 1,
      title: "Branding",
      description: "Complete brand identity design including logos, color palettes, and brand guidelines.",
      icon: "🎨"
    },
    {
      id: 2,
      title: "UI/UX Design",
      description: "User-centered design for digital products with intuitive interfaces.",
      icon: "📱"
    },
    {
      id: 3,
      title: "Illustration",
      description: "Custom illustrations for websites, books, and marketing materials.",
      icon: "✏️"
    }
  ];

  const tools = [
    "Adobe Creative Suite",
    "Figma",
    "Sketch",
    "Photoshop",
    "Illustrator",
    "InDesign",
    "Procreate",
    "Webflow",
    "Blender"
  ];

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Sticky Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-sm py-2 shadow-sm' : 'bg-transparent py-4'}`}>
        <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
          <div className="text-2xl font-bold tracking-tight">Alex Rivera</div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {['Home', 'About', 'Portfolio', 'Services', 'Contact'].map((item) => (
              <Link 
                key={item}
                to={`#${item.toLowerCase()}`}
                className="font-medium hover:text-gold-500 transition-colors duration-300"
              >
                {item}
              </Link>
            ))}
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-black focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white py-4 px-4 shadow-lg">
            <div className="flex flex-col space-y-3">
              {['Home', 'About', 'Portfolio', 'Services', 'Contact'].map((item) => (
                <Link 
                  key={item}
                  to={`#${item.toLowerCase()}`}
                  className="font-medium py-2 hover:text-gold-500 transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/70 z-10"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1500&q=80)' }}
        ></div>
        
        <div className="relative z-20 text-center px-4 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white tracking-tight">Alex Rivera</h1>
          <p className="text-xl md:text-2xl text-gold-400 mb-8 font-light">Designing Visual Stories</p>
          <div className="flex justify-center space-x-4">
            <a 
              href="#portfolio" 
              className="px-8 py-3 bg-gold-500 text-black font-medium rounded-full hover:bg-gold-600 transition-colors duration-300"
            >
              View My Work
            </a>
            <a 
              href="#contact" 
              className="px-8 py-3 border-2 border-white text-white font-medium rounded-full hover:bg-white hover:text-black transition-colors duration-300"
            >
              Contact Me
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">About Me</h2>
            <div className="w-20 h-1 bg-gold-500 mx-auto"></div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/3 flex justify-center">
              <div className="relative">
                <div className="w-64 h-64 md:w-80 md:h-80 bg-gray-200 rounded-full overflow-hidden border-4 border-gold-500">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80" 
                    alt="Alex Rivera" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-gold-500 text-black px-6 py-2 font-bold rounded-full">
                  Designer
                </div>
              </div>
            </div>
            
            <div className="md:w-2/3">
              <h3 className="text-2xl font-bold mb-6">Hello, I'm Alex Rivera</h3>
              <p className="text-lg mb-6 text-gray-700 leading-relaxed">
                I'm a passionate freelance graphic designer with over 8 years of experience creating compelling visual narratives. 
                My work combines aesthetic excellence with strategic thinking to deliver designs that not only look beautiful but also 
                drive results.
              </p>
              <p className="text-lg mb-8 text-gray-700 leading-relaxed">
                I specialize in branding, UI/UX design, and illustration, helping businesses and individuals tell their stories 
                through powerful visual communication.
              </p>
              
              <div className="mb-8">
                <h4 className="text-xl font-bold mb-4">Tools & Technologies</h4>
                <div className="flex flex-wrap gap-3">
                  {tools.map((tool, index) => (
                    <span 
                      key={index} 
                      className="px-4 py-2 bg-gray-100 text-gray-800 rounded-full text-sm font-medium"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">My Portfolio</h2>
            <div className="w-20 h-1 bg-gold-500 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div 
                key={project.id}
                className="group relative overflow-hidden rounded-xl cursor-pointer"
                onClick={() => setSelectedProject(project)}
              >
                <div className="aspect-square overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div>
                    <h3 className="text-white text-xl font-bold">{project.title}</h3>
                    <p className="text-gray-200 text-sm mt-1">{project.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">My Services</h2>
            <div className="w-20 h-1 bg-gold-500 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service) => (
              <div 
                key={service.id}
                className="p-8 border border-gray-200 rounded-xl hover:border-gold-500 transition-colors duration-300 text-center group"
              >
                <div className="text-5xl mb-6 group-hover:text-gold-500 transition-colors duration-300">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Get In Touch</h2>
            <div className="w-20 h-1 bg-gold-500 mx-auto"></div>
          </div>
          
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2 p-8 md:p-12 bg-gray-900 text-white">
                <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
                <p className="mb-6 text-gray-300">Feel free to reach out for collaborations or inquiries.</p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-start">
                    <div className="text-gold-500 mr-4 mt-1">📧</div>
                    <div>
                      <h4 className="font-bold">Email</h4>
                      <p className="text-gray-300">alex@riveradesigns.com</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="text-gold-500 mr-4 mt-1">📱</div>
                    <div>
                      <h4 className="font-bold">Phone</h4>
                      <p className="text-gray-300">+1 (555) 123-4567</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="text-gold-500 mr-4 mt-1">📍</div>
                    <div>
                      <h4 className="font-bold">Location</h4>
                      <p className="text-gray-300">San Francisco, CA</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-bold mb-4">Follow Me</h4>
                  <div className="flex space-x-4">
                    {['Instagram', 'Dribbble', 'Behance', 'Twitter'].map((social) => (
                      <a 
                        key={social}
                        href="#" 
                        className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gold-500 transition-colors duration-300"
                      >
                        <span className="text-sm font-bold">{social.charAt(0)}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="md:w-1/2 p-8 md:p-12">
                <form className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                      placeholder="Your Name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email</label>
                    <input 
                      type="email" 
                      id="email" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                      placeholder="Your Email"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-gray-700 font-medium mb-2">Message</label>
                    <textarea 
                      id="message" 
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                      placeholder="Your Message"
                    ></textarea>
                  </div>
                  <button 
                    type="submit" 
                    className="w-full py-3 bg-gold-500 text-black font-bold rounded-lg hover:bg-gold-600 transition-colors duration-300"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <p className="text-gray-400">© {new Date().getFullYear()} Alex Rivera. All rights reserved.</p>
          <p className="text-gray-500 mt-2 text-sm">Designed and built with ❤️</p>
        </div>
      </footer>

      {/* Project Modal */}
      {selectedProject && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedProject(null)}
        >
          <div 
            className="bg-white max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold">{selectedProject.title}</h3>
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="text-gray-500 hover:text-black"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mb-6">
                <img 
                  src={selectedProject.image} 
                  alt={selectedProject.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
              
              <p className="text-gray-700 mb-6">{selectedProject.description}</p>
              
              <div className="mb-6">
                <h4 className="font-bold mb-3">Tools Used</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.tools.map((tool: string, index: number) => (
                    <span 
                      key={index} 
                      className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end">
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="px-6 py-2 bg-gold-500 text-black font-medium rounded-lg hover:bg-gold-600 transition-colors duration-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
```

