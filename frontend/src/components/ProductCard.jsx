import { useNavigate } from "react-router-dom";

function ProductCard({ product }) {
  const navigate = useNavigate();

  const getImageUrl = () => {
    if (product.images && product.images.length > 0) {
      return `http://localhost:8080/uploads/${product.images[0]}`;
    }
    return "http://placehold.com/600x400";
  };

  return (
    <div 
      className='product-card'
      onClick={() => navigate(`/product/${product.id}`)}
      style={{ cursor: 'pointer' }}
    >
      <img 
        src={getImageUrl()} 
        alt={product.name}
        className="product-card-image" 
      />
      <div className='product-info'>  
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <small>{product.images?.length || 0} imagen(es)</small>
      </div>
    </div>
  );
}

export default ProductCard;