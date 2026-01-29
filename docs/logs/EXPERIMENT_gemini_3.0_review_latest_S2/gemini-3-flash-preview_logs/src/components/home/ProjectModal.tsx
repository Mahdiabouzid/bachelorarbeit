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
      data-testid="project-modal"
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