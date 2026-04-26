import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import AddProduct from "./pages/AddProduct";
import Admin from './pages/Admin';
import ProductDetail from './pages/ProductDetail';
import { getProducts } from './services/api';
import './App.css';
import EditProduct from './components/EditProduct';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import AdminUsers from './pages/AdminUsers';
import AdminFeatures from './pages/AdminFeatures';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import CategoryFilter from './components/CategoryFilter'; 
import AdminCategories from './pages/AdminCategories';

function getRandomProducts(products, max = 4) {
  if (!products || products.length === 0) return [];
  const shuffled = [...products].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, max);
}

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [user, setUser] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]); 
  const productsPerPage = 6;
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
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

  useEffect(() => {
    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    if (selectedCategories.length === 0) {
      return products;
    }
    return products.filter(product => 
      product.category && selectedCategories.includes(product.category.id)
    );
  }, [products, selectedCategories]);

  const randomProducts = useMemo(() => getRandomProducts(products, 4), [products]);
  
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategories]);

  if (loading) {
    return (
      <>
        <Header user={user} setUser={setUser} />
        <div className="main">
          <p style={{ textAlign: 'center', padding: '50px' }}>Cargando catálogo de vehículos...</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header user={user} setUser={setUser} />
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
                <CategoryFilter 
                  selectedCategories={selectedCategories}
                  onCategoryChange={setSelectedCategories}
                />
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
                            ? product.images[0] 
                            : "https://via.placeholder.com/600x400?text=Sin+Imagen"
                        } 
                        alt={product.name}
                        className="product-card-image"
                        onError={(e) => { e.target.src = "https://via.placeholder.com/600x400?text=Error+al+cargar"; }}
                      />
                      <div className='product-info'>  
                        <h3>{product.name}</h3>
                        <span className="category-badge">{product.category?.name || "General"}</span>
                        <p>{product.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className='catalog-section'>
                <div className="catalog-header">
                  <h2>Todos los autos</h2>
                  <div className="result-counter">
                    {selectedCategories.length > 0 && (
                      <span className="filter-badge">
                        Filtro: {selectedCategories.length} categoría(s)
                      </span>
                    )}
                    <span className="product-count">
                      Mostrando {filteredProducts.length} de {products.length} vehículos
                    </span>
                  </div>
                </div>
                
                {filteredProducts.length === 0 ? (
                  <div className="no-results">
                    <p>No hay vehículos que coincidan con las categorías seleccionadas.</p>
                    <button 
                      className="btn-clear-filters" 
                      onClick={() => setSelectedCategories([])}
                    >
                      Limpiar filtros
                    </button>
                  </div>
                ) : (
                  <>
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
                                ? product.images[0]
                                : "https://via.placeholder.com/600x400?text=Sin+Imagen"
                            }
                            alt={product.name}
                            className='product-card-image'
                            onError={(e) => { e.target.src = "https://via.placeholder.com/600x400?text=Error+al+cargar"; }}
                          />
                          <div className='product-info'>
                            <h3>{product.name}</h3>
                            <span className="category-badge">{product.category?.name || "General"}</span>
                            <p>{product.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {totalPages > 1 && (
                      <div className="pagination">
                        <button 
                          className="pagination-btn"
                          onClick={() => { setCurrentPage(1); window.scrollTo(0,0); }}
                          disabled={currentPage === 1}
                        >
                          ⏮ Inicio
                        </button>
                        
                        <button 
                          className="pagination-btn"
                          onClick={() => { setCurrentPage(currentPage - 1); window.scrollTo(0,0); }}
                          disabled={currentPage === 1}
                        >
                          ◀ Anterior
                        </button>
                        
                        <span className="page-counter">
                          Página {currentPage} de {totalPages}
                        </span>
                        
                        <button 
                          className="pagination-btn"
                          onClick={() => { setCurrentPage(currentPage + 1); window.scrollTo(0,0); }}
                          disabled={currentPage === totalPages}
                        >
                          Siguiente ▶
                        </button>
                      </div>
                    )}
                  </>
                )}
              </section>
            </main>
          }
        />
        
        <Route path='/registro' element={<Register setUser={setUser} />} />
        <Route path='/login' element={<Login setUser={setUser} />} />
        <Route path='/product/:id' element={<ProductDetail products={products} />} />
        
        <Route path='/perfil' element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        
        <Route path='/administracion' element={
          <AdminRoute>
            <Admin loadProducts={loadProducts} />
          </AdminRoute>
        } />
        
        <Route path='/add-product' element={
          <AdminRoute>
            <AddProduct loadProducts={loadProducts} />
          </AdminRoute>
        } />
        
        <Route path='/edit-product/:id' element={
          <AdminRoute>
            <EditProduct />
          </AdminRoute>
        } />
        
        <Route path='/admin/usuarios' element={
          <AdminRoute>
            <AdminUsers />
          </AdminRoute>
        } />
        
        <Route path='/admin/caracteristicas' element={
          <AdminRoute>
            <AdminFeatures />
          </AdminRoute>
        } />
        
        <Route path='/admin/categorias' element={
          <AdminRoute>
            <AdminCategories/>
          </AdminRoute>
        } />
      </Routes>
      <Footer />
    </>
  );
}

export default App;