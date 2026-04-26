import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../services/api';
import ImageGallery from '../components/ImageGallery';

function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadProduct();
    }, [id]);

    const loadProduct = async () => {
        try {
            setLoading(true);
            const data = await getProductById(id);
            console.log('Producto cargado:', data);
            setProduct(data);
            setError('');
        } catch (err) {
            console.error('Error al cargar producto:', err);
            setError('No se pudo cargar el producto');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="main-with-padding">
                <p>Cargando...</p>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="main-with-padding">
                <h2>{error || 'Producto no encontrado'}</h2>
                <button onClick={() => navigate('/')} className="back-btn">
                    Volver al inicio
                </button>
            </div>
        );
    }

    return (
        <div className="main-with-padding">
            <div className="product-detail">
                <div className="detail-header">
                    <h1 className="detail-title">{product.name}</h1>
                    <button onClick={() => navigate(-1)} className="back-btn">
                        ← Volver
                    </button>
                </div>

                {product.category && (
                    <div className="detail-category">
                        <span className="category-badge">
                            {product.category.name}
                        </span>
                    </div>
                )}

                <div className="product-gallery-container">
                    <ImageGallery 
                        images={product.images || []} 
                        productName={product.name}
                    />
                </div>

                {product.features && product.features.length > 0 && (
                    <div className="product-features">
                        <h3>Características</h3>
                        <div className="features-list">
                            {product.features.map(feature => (
                                <div key={feature.id} className="feature-tag">
                                    <i className={`fas ${feature.icon}`}></i>
                                    {feature.name}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="detail-description">
                    <h3>Descripción</h3>
                    <p>{product.description}</p>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;