import { faker } from '@faker-js/faker';

export interface GalleryItem {
  id: string;
  title: string;
  date: string;
  tags: ('portrait' | 'nature' | 'urban')[];
  placeholder: string;
}

const tags: ('portrait' | 'nature' | 'urban')[] = ['portrait', 'nature', 'urban'];

const generatePlaceholder = (color: string) => `data:image/svg+xml;base64,${btoa(`
  <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="${color}"/>
    <text x="50%" y="50%" font-family="Arial" font-size="20" fill="white" text-anchor="middle" dy=".3em">Lumen Photo</text>
  </svg>
`)}`;

export const galleryData: GalleryItem[] = [
  {
    id: '1',
    title: 'Golden Hour',
    date: '2025-06-01T00:00:00Z',
    tags: ['nature'],
    placeholder: generatePlaceholder('#f59e0b')
  },
  ...Array.from({ length: 11 }).map((_, i) => ({
    id: (i + 2).toString(),
    title: faker.commerce.productName(),
    date: faker.date.past().toISOString(),
    tags: [tags[Math.floor(Math.random() * tags.length)]],
    placeholder: generatePlaceholder(faker.color.rgb())
  }))
];