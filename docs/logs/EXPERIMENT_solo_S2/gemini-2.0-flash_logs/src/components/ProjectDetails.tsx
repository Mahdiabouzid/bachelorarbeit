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
