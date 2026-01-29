import React, { useState } from 'react';

interface Project {
  id: number;
  title: string;
  description: string;
  tools: string[];
  thumbnail: string;
  image: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: 'Brand Identity for Luxe Co.',
    description: 'Developed a sophisticated brand identity including logo, color palette, and typography for a luxury fashion brand.',
    tools: ['Adobe Illustrator', 'Photoshop'],
    thumbnail: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=400&q=80',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 2,
    title: 'Mobile App UI for Foodie',
    description: 'Designed a clean and intuitive UI for a food delivery mobile app, focusing on user experience and accessibility.',
    tools: ['Figma', 'Sketch'],
    thumbnail: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=400&q=80',
    image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 3,
    title: 'Illustration Series: Urban Life',
    description: 'Created a series of digital illustrations capturing the vibrancy and diversity of urban life.',
    tools: ['Procreate'],
    thumbnail: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=400&q=80',
    image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 4,
    title: 'Website Redesign for TechStart',
    description: 'Led the redesign of a tech startup website to improve branding and user engagement.',
    tools: ['Adobe XD', 'Photoshop'],
    thumbnail: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=400&q=80',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 5,
    title: 'Packaging Design for Organic Goods',
    description: 'Designed eco-friendly packaging for an organic food brand emphasizing sustainability and simplicity.',
    tools: ['Illustrator', 'InDesign'],
    thumbnail: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=400&q=80',
    image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 6,
    title: 'Event Poster Series',
    description: 'Created a series of posters for cultural events using bold typography and vibrant colors.',
    tools: ['Photoshop', 'Illustrator'],
    thumbnail: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=400&q=80',
    image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1200&q=80',
  },
];

export const PortfolioSection: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const openModal = (project: Project) => {
    setSelectedProject(project);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedProject(null);
    document.body.style.overflow = '';
  };

  return (
    <section
      id="portfolio"
      className="max-w-7xl mx-auto px-6 py-20 text-white"
      aria-labelledby="portfolio-title"
    >
      <h2 id="portfolio-title" className="text-4xl font-bold mb-12 font-sans text-center">
        Portfolio
      </h2>
      <div className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6">
        {projects.map((project) => (
          <button
            key={project.id}
            onClick={() => openModal(project)}
            className="w-full mb-6 break-inside-avoid rounded overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300 focus:outline-none focus:ring-4 focus:ring-yellow-400"
            aria-haspopup="dialog"
            aria-label={`View details of project ${project.title}`}
          >
            <img
              src={project.thumbnail}
              alt={project.title}
              className="w-full object-cover rounded"
              loading="lazy"
            />
          </button>
        ))}
      </div>

      {selectedProject && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          tabIndex={-1}
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-6 z-50"
          onClick={closeModal}
          onKeyDown={(e) => {
            if (e.key === 'Escape') closeModal();
          }}
        >
          <div
            className="bg-black rounded-lg max-w-4xl w-full max-h-full overflow-auto p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              aria-label="Close project details"
              className="absolute top-4 right-4 text-yellow-400 hover:text-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded"
            >
              &#10005;
            </button>
            <h3 id="modal-title" className="text-3xl font-bold mb-4">
              {selectedProject.title}
            </h3>
            <img
              src={selectedProject.image}
              alt={selectedProject.title}
              className="w-full rounded mb-4 object-cover"
              loading="lazy"
            />
            <p className="mb-4 leading-relaxed">{selectedProject.description}</p>
            <h4 className="font-semibold mb-2">Tools Used:</h4>
            <ul className="list-disc list-inside flex flex-wrap gap-2">
              {selectedProject.tools.map((tool) => (
                <li key={tool} className="text-yellow-400">
                  {tool}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
};
