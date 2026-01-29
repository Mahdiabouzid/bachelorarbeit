export interface GalleryItem {
  id: string;
  titleKey: string;
  date: string;
  tags: ('portrait' | 'nature' | 'urban')[];
  placeholder: string;
}

// Simple SVG placeholders with different colors for variety
const createPlaceholder = (color: string) => `data:image/svg+xml;base64,${btoa(`<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="${color}"/><text x="50%" y="50%" font-family="sans-serif" font-size="24" fill="white" text-anchor="middle" dy=".3em">Lumen Photo</text></svg>`)}`;

export const galleryData: GalleryItem[] = [
  { id: '1', titleKey: 'gallery.portrait', date: '2025-06-01', tags: ['portrait'], placeholder: createPlaceholder('#4a90e2') },
  { id: '2', titleKey: 'gallery.nature', date: '2025-05-15', tags: ['nature'], placeholder: createPlaceholder('#50e3c2') },
  { id: '3', titleKey: 'gallery.urban', date: '2025-04-20', tags: ['urban'], placeholder: createPlaceholder('#b8e986') },
  { id: '4', titleKey: 'gallery.portrait', date: '2025-03-10', tags: ['portrait'], placeholder: createPlaceholder('#f5a623') },
  { id: '5', titleKey: 'gallery.nature', date: '2025-02-28', tags: ['nature'], placeholder: createPlaceholder('#d0021b') },
  { id: '6', titleKey: 'gallery.urban', date: '2025-01-15', tags: ['urban'], placeholder: createPlaceholder('#9013fe') },
  { id: '7', titleKey: 'gallery.portrait', date: '2024-12-05', tags: ['portrait'], placeholder: createPlaceholder('#4a4a4a') },
  { id: '8', titleKey: 'gallery.nature', date: '2024-11-20', tags: ['nature'], placeholder: createPlaceholder('#7ed321') },
  { id: '9', titleKey: 'gallery.urban', date: '2024-10-12', tags: ['urban'], placeholder: createPlaceholder('#bd10e0') },
  { id: '10', titleKey: 'gallery.portrait', date: '2024-09-01', tags: ['portrait'], placeholder: createPlaceholder('#f8e71c') },
  { id: '11', titleKey: 'gallery.nature', date: '2024-08-15', tags: ['nature'], placeholder: createPlaceholder('#417505') },
  { id: '12', titleKey: 'gallery.urban', date: '2024-07-30', tags: ['urban'], placeholder: createPlaceholder('#4a90e2') },
];