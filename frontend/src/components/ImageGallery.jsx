import { useState } from "react";

function ImageGallery({ images, productName }) {
  const [showAll, setShowAll] = useState(false);
  const [selectedImage, setSelectedImage] = useState(images && images[0]);

  if (!images || images.length === 0) {
    return <div className="image-gallery-single">No hay imágenes disponibles</div>;
  }

  if (showAll) {
    return (
      <div className="gallery-all">
        <div className="gallery-all-header">
          <h3>Todas las fotos de {productName}</h3>
          <button className="close-gallery" onClick={() => setShowAll(false)}>
            Cerrar galería
          </button>
        </div>
        <div className="gallery-all-grid">
          {images.map((img, index) => (
            <img 
              key={index} 
              src={img} 
              alt={`${productName} ${index + 1}`} 
              className="gallery-all-image"
              onError={(e) => {
                if (e.target.dataset.errored) return;
                e.target.dataset.errored = 'true';
                e.target.src = 'https://placehold.co/500x350?text=Sin+imagen';
               }}
            />
          ))}
        </div>
      </div>
    );
  }

  const gridImages = images.slice(1, 5);
  const mainImageUrl = selectedImage || images[0];
  const hasMoreImages = images.length > 5;

  return (
    <div className="image-gallery-container">
      <div className="image-gallery">
        <div className="gallery-main">
          <img 
            src={mainImageUrl} 
            alt={productName} 
            className="main-image"
            onError={(e) => {
             if (e.target.dataset.errored) return;
             e.target.dataset.errored = 'true';
             e.target.src = 'https://placehold.co/150x150?text=Sin+imagen';
            }}
          />
        </div>

        <div className="gallery-grid">
          {gridImages.map((img, index) => (
            <div 
              key={index} 
              className="grid-item" 
              onClick={() => setSelectedImage(img)}
            >
              <img 
                src={img} 
                alt={`${productName} miniatura ${index + 1}`} 
                className="grid-image"
                onError={(e) => {
                 if (e.target.dataset.errored) return;
                 e.target.dataset.errored = 'true';
                 e.target.src = 'https://placehold.co/300x200?text=Sin+imagen';
                }}
              />
            </div>
          ))}
          {gridImages.length < 4 && [...Array(4 - gridImages.length)].map((_, idx) => (
            <div key={`empty-${idx}`} className="grid-item empty">
              <div className="grid-image-placeholder">
                <span>Sin imagen</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {(hasMoreImages || images.length > 4) && (
        <div className="gallery-footer">
          <button className="see-more" onClick={() => setShowAll(true)}>
            Ver más
          </button>
        </div>
      )}
    </div>
  );
}

export default ImageGallery;