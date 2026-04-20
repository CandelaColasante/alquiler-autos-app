import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import AddProduct from "./pages/AddProduct";
import Admin from './pages/Admin';
import ProductDetail from './pages/ProductDetail';
import { getProducts } from './services/api';
import './App.css';

function getRandomProducts(products, max = 10) {
  if (products.length === 0) return [];
  const shuffled = [...products];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, max);
}

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;
  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    } finally {
      setLoading(false);
    }
  };

  const randomProducts = getRandomProducts(products, 4);
  
  // Paginación
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

  if (loading) {
    return (
      <>
        <Header />
        <div className="main">
          <p>Cargando productos...</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            <main className='main'>
              
              
              <section className='section search-section'>
                <h2>Buscador</h2>
              </section>
              
           
              <section className='section categories-section'>
                <h2>Categorías</h2>
              </section>
              
             
              <section className='section recommendations-section'>
                <h2>Recomendaciones</h2>
                <div className='products-grid'>
                  {randomProducts.map(product => (
                    <div 
                      key={product.id} 
                      className='product-card'
                      onClick={() => navigate(`/product/${product.id}`)}
                      style={{ cursor: 'pointer' }}
                    >
                      <img 
                        src={
                          product.images && product.images.length > 0
                            ? `http://localhost:8080/uploads/${product.images[0]}`
                            : "http://placehold.com/600x400"
                        } 
                        alt={product.name}
                        className="product-card-image" 
                      />
                      <div className='product-info'>  
                        <h3>{product.name}</h3>
                        <p>{product.description}</p>
                        <small>{product.images?.length || 0} imagen(es)</small>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

           
              <section className='catalog-section'>
                <h2>Todos los autos</h2>
                <div className='products-grid'>
                  {currentProducts.map(product => (
                    <div 
                      key={product.id}
                      className='product-card'
                      onClick={() => navigate(`/product/${product.id}`)}
                    >
                      <img 
                        src={
                          product.images && product.images.length > 0
                            ? `http://localhost:8080/uploads/${product.images[0]}`
                            : "http://placehold.com/600x400"
                        }
                        alt={product.name}
                        className='product-card-image'
                      />
                      <div className='product-info'>
                        <h3>{product.name}</h3>
                        <p>{product.description}</p>
                        <small>{product.images?.length || 0} imagen(es)</small>
                      </div>
                    </div>
                  ))}
                </div>

               
                {totalPages > 1 && (
                  <div className="pagination">
                    <button 
                      className="pagination-btn"
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                    >
                      ⏮ Inicio
                    </button>
                    
                    <button 
                      className="pagination-btn"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      ◀ Anterior
                    </button>
                    
                    <span className="page-counter">
                      Página {currentPage} de {totalPages}
                    </span>
                    
                    <button 
                      className="pagination-btn"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Siguiente ▶
                    </button>
                    
                    <button 
                      className="pagination-btn"
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                    >
                      Fin ⏭
                    </button>
                  </div>
                )}
              </section>
            </main>
          }
        />
        <Route path="/add-product" element={<AddProduct loadProducts={loadProducts} />} />
        <Route path="/administracion" element={<Admin loadProducts={loadProducts} />} />
        <Route path='/product/:id' element={<ProductDetail products={products} />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;