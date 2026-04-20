import { useParams, useNavigate, useLocation } from "react-router-dom";
import ImageGallery from "../components/ImageGallery";

function ProductDetail({ products }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const fromAdmin = location.state?.fromAdmin;

  const product = products.find(p => p.id === parseInt(id));

  if (!product) {
    return (
      <div className="main">
        <h2>Producto no encontrado</h2>
        <button onClick={() => navigate("/")}>Volver al inicio</button>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <header className="detail-header">
        <h2 className="detail-title">{product.name}</h2>

        <div style={{ display: "flex", gap: "10px", marginLeft: "auto" }}>
          
          {fromAdmin && (
            <>
              <button
                className="back-btn"
                onClick={() =>
                  navigate("/administracion", {
                    state: { showList: true }
                  })
                }
              >
                ← Volver al listado
              </button>

              <button
                className="back-btn"
                onClick={() => navigate("/administracion")}
              >
                Panel admin
              </button>
            </>
          )}

          {!fromAdmin && (
            <button className="back-btn" onClick={() => navigate(-1)}>
              Volver atrás
            </button>
          )}
        </div>
      </header>

      <div className="detail-body">
        <div className="detail-description">
          {product.description.split('\n').map((line, index) => 
             <p key={index}>{line}</p>
          )}
        </div>

        <ImageGallery
          images={product.images}
          productName={product.name}
        />
      </div>
    </div>
  );
}

export default ProductDetail;