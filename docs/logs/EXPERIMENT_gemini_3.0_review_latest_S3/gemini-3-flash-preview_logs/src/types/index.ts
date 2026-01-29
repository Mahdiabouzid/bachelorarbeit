export type Theme = 'light' | 'dark';
export type Accent = 'ocean' | 'sunset' | 'forest';
export type Language = 'en' | 'de';
export type Category = 'Portrait' | 'Nature' | 'Urban';

export interface GalleryItem {
  id: string;
  titleKey: string;
  date: string;
  category: Category;
  imageUrl: string;
  tags: string[];
}

export interface AppState {
  theme: Theme;
  accent: Accent;
  language: Language;
  isOffline: boolean;
}