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
      data-testid="portfolio-item"
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