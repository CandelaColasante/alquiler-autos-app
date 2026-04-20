import { useEffect, useState } from "react";
import { useNavigate, useLocation} from "react-router-dom";
import { getProducts, deleteProduct } from "../services/api";

function Admin({ loadProducts }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [products, setProducts] = useState([]);
  const [showList, setShowList] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    loadProductsList();
  }, []);

  useEffect(() => {
    if (location.state?.showList) {
      setShowList(true);
    }
  }, [location.state]);

  const loadProductsList = async () => {
    const data = await getProducts();
    setProducts(data);
  };

  const handleDelete = async (id, name) => {
    const confirmDelete = window.confirm(`¿Estás seguro de eliminar "${name}"?`);
    if (confirmDelete) {
      await deleteProduct(id);
      await loadProductsList();
      await loadProducts();
      alert(`Producto "${name}" eliminado`);
    }
  };

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isMobile) {
    return (
      <div className="main-with-padding">
        <div className="admin-mobile-message">
          <h2>📱 Acceso no disponible</h2>
          <p>El panel de administración solo está disponible en dispositivos de escritorio.</p>
          <button onClick={() => navigate("/")} className="btn-back">Volver al inicio</button>
        </div>
      </div>
    );
  }

  return (
    <div className="main-with-padding">
      <div className="admin-panel">
        <h1>Panel de Administración</h1>

        <div className="admin-buttons">
          <button className="btn-admin-add" onClick={() => navigate("/add-product")}>
            Agregar Producto
          </button>
          <button className="btn-admin-list" onClick={() => setShowList(!showList)}>
            {showList ? "Ocultar listado" : "Listar Productos"}
          </button>
        </div>

        {showList && (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="3" style={{ textAlign: "center" }}>
                      No hay productos. Agrega tu primer producto.
                    </td>
                  </tr>
                ) : (
                  products.map(product => (
                    <tr key={product.id}>
                      <td>{product.id}</td>
                      <td>{product.name}</td>
                      <td>
                        <button
                           className="admin-view-btn"
                           onClick={() => navigate(`/product/${product.id}`, {
                            state: { fromAdmin: true}
                           })
                          }
                        >
                          Ver
                        </button>
                        <button className="admin-delete-btn" onClick={() => handleDelete(product.id, product.name)}>
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
        )}
      </div>
    </div>
  );
}

export default Admin;