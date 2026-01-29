export const bio = [
  "I am Alex Rivera, a freelance graphic designer with over 8 years of experience in crafting visual identities that resonate. My philosophy is rooted in the belief that every brand has a unique story waiting to be told through thoughtful design and meticulous attention to detail.",
  "Based in the vibrant heart of the creative industry, I specialize in branding, UI/UX design, and digital illustration. I've collaborated with startups and established brands alike to transform their visions into compelling visual experiences that drive engagement and growth.",
  "When I'm not pushing pixels, you'll find me exploring local art galleries or experimenting with traditional medium techniques to bring a tactile feel to my digital work."
];

export const tools = [
  "Adobe Photoshop",
  "Figma",
  "Adobe Illustrator",
  "Sketch",
  "Adobe InDesign",
  "After Effects",
  "Procreate",
  "Blender",
  "Webflow",
  "Principle"
];

export interface Project {
  id: string;
  title: string;
  description: string;
  category: 'Branding' | 'UI-UX' | 'Illustration';
  tools: string[];
  thumbnail: string;
  fullImage: string;
}

export const projects: Project[] = [
  {
    id: '1',
    title: 'Lumina Brand Identity',
    description: 'A complete visual overhaul for a sustainable lighting company, focusing on minimalism and eco-friendly aesthetics.',
    category: 'Branding',
    tools: ['Illustrator', 'Photoshop', 'InDesign'],
    thumbnail: 'https://picsum.photos/400/400?random=1',
    fullImage: 'https://picsum.photos/1200/800?random=1'
  },
  {
    id: '2',
    title: 'Zenith Mobile App',
    description: 'A meditation and wellness app designed to provide a seamless, calming user experience with intuitive navigation.',
    category: 'UI-UX',
    tools: ['Figma', 'Principle', 'Photoshop'],
    thumbnail: 'https://picsum.photos/400/600?random=2',
    fullImage: 'https://picsum.photos/1200/800?random=2'
  },
  {
    id: '3',
    title: 'Cyberpunk Series',
    description: 'A series of digital illustrations exploring a neon-soaked future, blending traditional painting styles with digital techniques.',
    category: 'Illustration',
    tools: ['Procreate', 'Photoshop'],
    thumbnail: 'https://picsum.photos/400/400?random=3',
    fullImage: 'https://picsum.photos/1200/800?random=3'
  },
  {
    id: '4',
    title: 'Vortex E-commerce',
    description: 'A high-end fashion e-commerce platform focusing on bold typography and high-quality imagery.',
    category: 'UI-UX',
    tools: ['Figma', 'Webflow'],
    thumbnail: 'https://picsum.photos/400/500?random=4',
    fullImage: 'https://picsum.photos/1200/800?random=4'
  },
  {
    id: '5',
    title: 'Organic Roots Packaging',
    description: 'Packaging design for a premium organic skincare line, utilizing earthy tones and sustainable materials.',
    category: 'Branding',
    tools: ['Illustrator', 'Dimension'],
    thumbnail: 'https://picsum.photos/400/400?random=5',
    fullImage: 'https://picsum.photos/1200/800?random=5'
  },
  {
    id: '6',
    title: 'Abstract Motion',
    description: 'A collection of abstract motion graphics used for digital billboards and social media campaigns.',
    category: 'Illustration',
    tools: ['After Effects', 'Blender'],
    thumbnail: 'https://picsum.photos/400/600?random=6',
    fullImage: 'https://picsum.photos/1200/800?random=6'
  }
];

export interface Service {
  id: string;
  title: string;
  description: string;
  iconName: 'Palette' | 'Layout' | 'PenTool';
}

export const services: Service[] = [
  {
    id: 's1',
    title: 'Brand Strategy',
    description: 'Building cohesive brand identities that communicate your values and connect with your target audience.',
    iconName: 'Palette'
  },
  {
    id: 's2',
    title: 'UI/UX Design',
    description: 'Creating intuitive and engaging digital interfaces that prioritize user experience and business goals.',
    iconName: 'Layout'
  },
  {
    id: 's3',
    title: 'Digital Illustration',
    description: 'Custom illustrations that bring a unique personality and visual flair to your digital and print projects.',
    iconName: 'PenTool'
  }
];

export interface SocialLink {
  platform: string;
  url: string;
  iconName: 'Github' | 'Twitter' | 'Linkedin' | 'Instagram';
}

export const socialLinks: SocialLink[] = [
  { platform: 'Instagram', url: 'https://instagram.com', iconName: 'Instagram' },
  { platform: 'Twitter', url: 'https://twitter.com', iconName: 'Twitter' },
  { platform: 'LinkedIn', url: 'https://linkedin.com', iconName: 'Linkedin' },
  { platform: 'GitHub', url: 'https://github.com', iconName: 'Github' }
];