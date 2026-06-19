import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addFavorite, removeFavorite, checkFavorite } from '../services/api';

function ProductCard({ product, user, onFavoriteChange }) {
    const navigate = useNavigate();
    const [isFavorite, setIsFavorite] = useState(false);
    const [loading, setLoading] = useState(false);

    const imageUrl = product.images && product.images.length > 0 
        ? product.images[0] 
        : 'https://placehold.co/180x180?text=Sin+imagen';

    useEffect(() => {
        const checkIfFavorite = async () => {
            if (!user) return;
            try {
                const result = await checkFavorite(user.id, product.id);
                setIsFavorite(result);
            } catch (err) {
                console.error('Error al verificar favorito:', err);
            }
        };
        checkIfFavorite();
    }, [user, product.id]);

    const handleFavoriteClick = async (e) => {
        e.stopPropagation();
        if (!user) {
            alert('Debes iniciar sesión para agregar favoritos');
            return;
        }

        setLoading(true);
        try {
            if (isFavorite) {
                await removeFavorite(user.id, product.id);
                setIsFavorite(false);
            } else {
                await addFavorite(user.id, product.id);
                setIsFavorite(true);
            }
            if (onFavoriteChange) onFavoriteChange();
        } catch (err) {
            console.error('Error al actualizar favorito:', err);
            alert('No se pudo actualizar el favorito. Intentá de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="product-card" onClick={() => navigate(`/product/${product.id}`)}>
            <button 
                className={`favorite-btn ${isFavorite ? 'active' : ''}`} 
                onClick={handleFavoriteClick}
                disabled={loading}
                title={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            >
                <i className="fas fa-heart"></i>
            </button>
            <img 
                src={imageUrl} 
                alt={product.name} 
                className="product-card-image"
                onError={(e) => {
                    if (e.target.dataset.errored) return;
                    e.target.dataset.errored = 'true';
                    e.target.src = 'https://placehold.co/180x180?text=Sin+imagen';
                }}
            />
            <div className="product-info">
                <h3>{product.name}</h3>
                {product.category && (
                    <small>{product.category.name}</small>
                )}
                <div className="product-rating">
                    <i className="fas fa-star"></i>
                    <span className="rating-value">{product.averageRating?.toFixed(1) || '0.0'}</span>
                    <span className="rating-count">({product.reviewCount || 0})</span>
                </div>
                <p>{product.description?.substring(0, 80)}...</p>
            </div>
        </div>
    );
}

export default ProductCard;