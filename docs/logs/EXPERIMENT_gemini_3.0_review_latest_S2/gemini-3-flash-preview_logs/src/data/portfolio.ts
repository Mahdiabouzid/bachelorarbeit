import { faker } from '@faker-js/faker';

export interface Project {
  id: string;
  title: string;
  description: string;
  tools: string[];
  imageUrl: string;
  category: string;
}

const categories = ['Branding', 'UI/UX Design', 'Illustration', 'Web Development'];
const toolPool = ['React', 'TypeScript', 'Tailwind CSS', 'Figma', 'Adobe XD', 'Node.js', 'Three.js', 'PostgreSQL'];

export const portfolioProjects: Project[] = Array.from({ length: 6 }).map((_, index) => ({
  id: faker.string.uuid(),
  title: faker.commerce.productName(),
  description: faker.lorem.paragraph(2),
  tools: faker.helpers.arrayElements(toolPool, 3),
  imageUrl: `https://picsum.photos/800/600?random=${index + 10}`,
  category: faker.helpers.arrayElement(categories),
}));

export default portfolioProjects;