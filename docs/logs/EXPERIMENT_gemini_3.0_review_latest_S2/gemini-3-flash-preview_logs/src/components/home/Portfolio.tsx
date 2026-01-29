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
            data-testid="portfolio-item"
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