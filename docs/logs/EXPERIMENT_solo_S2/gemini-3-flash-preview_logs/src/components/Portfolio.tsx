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
              data-testid="portfolio-item"
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
        <div 
        data-testid="project-modal"
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm">
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