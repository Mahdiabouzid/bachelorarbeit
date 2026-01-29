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