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
      data-testid="project-modal"
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