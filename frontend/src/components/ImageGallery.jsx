import { useState } from "react";

function ImageGallery({ images, productName }) {
    const [showModal, setShowModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    if (!images || images.length === 0) {
        return <p>No hay imágenes disponibles</p>;
    }

    const getImageUrl = (imageName) => {
        return `http://localhost:8080/uploads/${imageName}`;
    };


    const mainImage = images[0];
    const gridImages = images.slice(1, 5); 

    const openModal = (image) => {
        setSelectedImage(image);
        setShowModal(true);
    };

    if (showModal) {
        return (
            <div className="modal" onClick={() => setShowModal(false)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <button className="modal-close" onClick={() => setShowModal(false)}>
                        ✕
                    </button>

                    <img
                        src={getImageUrl(selectedImage || mainImage)}
                        alt={productName}
                        className="modal-image"
                    />

                    <div className="modal-thumbnails">
                        {images.map((img, index) => (
                            <img
                                key={index}
                                src={getImageUrl(img)}
                                alt={`${productName} - ${index + 1}`}
                                className={`modal-thumb ${selectedImage === img ? 'active' : ''}`}
                                onClick={() => setSelectedImage(img)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (images.length === 1) {
        return (
            <div className="image-gallery-single">
                <img
                    src={getImageUrl(images[0])}
                    alt={productName}
                    className="single-image"
                    onClick={() => openModal(images[0])}
                    style={{ cursor: 'pointer' }}
                />
            </div>
        );
    }

    
    return (
        <>
            <div className="image-gallery">
                <div className="gallery-main">
                    <img
                        src={getImageUrl(mainImage)}
                        alt={`${productName} - principal`}
                        className="main-image"
                        onClick={() => openModal(mainImage)}
                        style={{ cursor: 'pointer' }}
                    />
                </div>

                <div className="gallery-grid">
                    {gridImages.map((img, index) => (
                        <div key={index} className="grid-item">
                            <img
                                src={getImageUrl(img)}
                                alt={`${productName} - ${index + 2}`}
                                className="grid-image"
                                onClick={() => openModal(img)}
                                style={{ cursor: 'pointer', objectFit: 'cover' }}
                            />
                        </div>
                    ))}
                </div>
                
                <div className="gallery-footer">
                    <button className="see-more" onClick={() => openModal(mainImage)}>
                        Ver más ({images.length} imágenes en total)
                    </button>
                </div>
            </div>
        </>
    );
}

export default ImageGallery;