export interface Project {
  id: number;
  title: string;
  description: string;
  tools: string[];
  image: string;
  category: string;
}

export interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
}

export interface Tool {
  name: string;
  icon: string;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

export const projects: Project[] = [
  {
    id: 1,
    title: "Luxe Fashion Brand Identity",
    description: "Complete brand identity design for a high-end fashion label including logo, color palette, typography, and brand guidelines. The design emphasizes elegance and sophistication with a modern twist.",
    tools: ["Adobe Illustrator", "Photoshop", "InDesign"],
    image: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&h=600&fit=crop",
    category: "Branding"
  },
  {
    id: 2,
    title: "Artisan Coffee Mobile App",
    description: "UI/UX design for a specialty coffee ordering app featuring intuitive navigation, custom illustrations, and a warm, inviting color scheme that reflects the artisanal nature of the brand.",
    tools: ["Figma", "Adobe XD", "Illustrator"],
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=1000&fit=crop",
    category: "UI/UX"
  },
  {
    id: 3,
    title: "Urban Architecture Magazine",
    description: "Editorial design for a quarterly architecture magazine featuring bold typography, striking layouts, and a sophisticated grid system that showcases contemporary urban design.",
    tools: ["InDesign", "Photoshop", "Lightroom"],
    image: "https://images.unsplash.com/photo-1541367777708-7905fe3296c0?w=800&h=900&fit=crop",
    category: "Editorial"
  },
  {
    id: 4,
    title: "Botanical Illustration Series",
    description: "A collection of detailed botanical illustrations for a natural skincare brand, combining scientific accuracy with artistic beauty. Each illustration tells a story about the plant's properties.",
    tools: ["Procreate", "Illustrator", "Photoshop"],
    image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&h=1000&fit=crop",
    category: "Illustration"
  },
  {
    id: 5,
    title: "Tech Startup Website Redesign",
    description: "Complete website redesign for a SaaS startup, focusing on user experience, conversion optimization, and modern design trends. Includes responsive design for all devices.",
    tools: ["Figma", "Adobe XD", "Photoshop"],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
    category: "UI/UX"
  },
  {
    id: 6,
    title: "Organic Food Packaging Design",
    description: "Sustainable packaging design for an organic food brand, featuring hand-drawn illustrations, eco-friendly materials, and a cohesive visual identity across product lines.",
    tools: ["Illustrator", "Photoshop", "Dimension"],
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=800&fit=crop",
    category: "Branding"
  }
];

export const services: Service[] = [
  {
    id: 1,
    title: "Branding",
    description: "Creating memorable brand identities that resonate with your target audience. From logo design to complete brand guidelines, I help businesses establish a strong visual presence.",
    icon: "palette"
  },
  {
    id: 2,
    title: "UI/UX Design",
    description: "Designing intuitive and beautiful user interfaces that enhance user experience. I focus on creating seamless interactions that delight users and drive engagement.",
    icon: "layout"
  },
  {
    id: 3,
    title: "Illustration",
    description: "Custom illustrations that bring your ideas to life. Whether digital or traditional, I create unique artwork that adds personality and visual interest to your projects.",
    icon: "pen-tool"
  }
];

export const tools: Tool[] = [
  { name: "Adobe Illustrator", icon: "SiAdobeillustrator" },
  { name: "Adobe Photoshop", icon: "SiAdobephotoshop" },
  { name: "Figma", icon: "SiFigma" },
  { name: "Adobe XD", icon: "SiAdobexd" },
  { name: "InDesign", icon: "SiAdobeindesign" },
  { name: "Procreate", icon: "SiApple" },
  { name: "Sketch", icon: "SiSketch" },
  { name: "After Effects", icon: "SiAdobeaftereffects" }
];

export const socialLinks: SocialLink[] = [
  {
    name: "LinkedIn",
    url: "https://linkedin.com/in/alexrivera",
    icon: "linkedin"
  },
  {
    name: "Dribbble",
    url: "https://dribbble.com/alexrivera",
    icon: "dribbble"
  },
  {
    name: "Behance",
    url: "https://behance.net/alexrivera",
    icon: "behance"
  },
  {
    name: "Instagram",
    url: "https://instagram.com/alexrivera.design",
    icon: "instagram"
  }
];

export const aboutText = `I'm a freelance graphic designer with over 8 years of experience creating visual stories that captivate and inspire. My passion lies in transforming ideas into compelling designs that not only look beautiful but also communicate effectively.

I believe that great design is a perfect blend of aesthetics and functionality. Whether it's crafting a brand identity, designing a user interface, or creating custom illustrations, I approach each project with creativity, attention to detail, and a commitment to excellence.

When I'm not designing, you can find me exploring art galleries, sketching in coffee shops, or experimenting with new design techniques. I'm always eager to take on new challenges and collaborate with clients who value quality and innovation.`;
