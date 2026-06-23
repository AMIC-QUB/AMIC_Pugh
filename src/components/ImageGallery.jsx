import { useEffect } from 'react';
import { FiX } from 'react-icons/fi';

export default function ImageGallery({ image, onClose }) {
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!image) {
    return null;
  }

  return <div className="lightbox" role="dialog" aria-modal="true" aria-label={`${image.name} full-size image`} onMouseDown={onClose}><button className="lightbox-close" type="button" aria-label="Close image" onClick={onClose}><FiX /></button><img alt={image.name} src={image.url} onMouseDown={(event) => event.stopPropagation()} /></div>;
}
