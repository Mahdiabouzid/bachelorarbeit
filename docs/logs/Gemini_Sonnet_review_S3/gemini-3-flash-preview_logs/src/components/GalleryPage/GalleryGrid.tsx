import { GalleryItem as GalleryItemType } from '../../data/gallery';
import GalleryItem from './GalleryItem';

interface GalleryGridProps {
  items: GalleryItemType[];
}

const GalleryGrid = ({ items }: GalleryGridProps) => {
  return (
    <div 
      data-testid="gallery-grid"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {items.map((item) => (
        <GalleryItem key={item.id} item={item} />
      ))}
    </div>
  );
};

export default GalleryGrid;