import React from 'react';

const tools = ['Adobe Photoshop', 'Adobe Illustrator', 'Figma', 'Sketch', 'Procreate', 'InDesign'];

export const AboutSection: React.FC = () => {
  return (
    <section
      id="about"
      className="max-w-7xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center gap-12"
      aria-labelledby="about-title"
    >
      <img
        src="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=400&q=80"
        alt="Alex Rivera"
        className="w-48 h-48 rounded-full object-cover shadow-lg flex-shrink-0"
      />
      <div className="max-w-xl text-white">
        <h2 id="about-title" className="text-4xl font-bold mb-6 font-sans">
          About Alex
        </h2>
        <p className="mb-6 leading-relaxed">
          Alex Rivera is a passionate freelance graphic designer specializing in creating compelling visual stories that connect brands with their audiences. With a keen eye for detail and a love for clean, modern design, Alex brings ideas to life through innovative and thoughtful design solutions.
        </p>
        <h3 className="text-2xl font-semibold mb-3">Tools & Technologies</h3>
        <ul className="grid grid-cols-2 gap-2 list-disc list-inside">
          {tools.map((tool) => (
            <li key={tool} className="text-yellow-400">
              {tool}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
