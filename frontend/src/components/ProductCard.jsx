import { Link } from 'react-router-dom';

function ProductCard({ product }) {
  // Ya no necesitamos transformar porque api.js ya lo hizo
  const imageUrl = product.images && product.images.length > 0 
    ? product.images[0] 
    : 'https://via.placeholder.com/180x180?text=Sin+imagen';

  return (
    <div className="product-card" onClick={() => window.location.href = `/producto/${product.id}`}>
      <img 
        src={imageUrl} 
        alt={product.name} 
        className="product-card-image"
        onError={(e) => {
          console.error('Error cargando imagen:', imageUrl);
          e.target.src = 'https://via.placeholder.com/180x180?text=Error';
        }}
      />
      <div className="product-info">
        <h3>{product.name}</h3>
        {product.category && (
          <small>{product.category.name}</small>
        )}
        <p>{product.description?.substring(0, 80)}...</p>
      </div>
    </div>
  );
}

export default ProductCard;