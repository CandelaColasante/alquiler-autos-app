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
import SearchBar from './components/SearchBar';
import ProductCard from './components/ProductCard';

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
  
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
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

  const handleSearch = (term, start, end) => {
    setSearchTerm(term);
    setStartDate(start);
    setEndDate(end);
    setCurrentPage(1);
  };

  const filteredProducts = useMemo(() => {
    let result = products;
    
    if (selectedCategories.length > 0) {
      result = result.filter(product => 
        product.category && selectedCategories.includes(product.category.id)
      );
    }
    
    if (searchTerm.trim() !== '') {
      result = result.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return result;
  }, [products, selectedCategories, searchTerm]);

  const randomProducts = useMemo(() => getRandomProducts(products, 4), [products]);
  
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategories, searchTerm]);

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
                <SearchBar onSearch={handleSearch} products={products} />
              </section>
              
              <section className='section categories-section'>
                <h2>Categorías</h2>
                <CategoryFilter 
                  selectedCategories={selectedCategories}
                  onCategoryChange={setSelectedCategories}
                />
              </section>
              
              <section className='catalog-section'>
                <div className="catalog-header">
                  <h2>
                    {searchTerm || selectedCategories.length > 0 ? 'Resultados de búsqueda' : 'Todos los autos'}
                  </h2>
                  <div className="result-counter">
                    {selectedCategories.length > 0 && (
                      <span className="filter-badge">
                        Filtro: {selectedCategories.length} categoría(s)
                      </span>
                    )}
                    {searchTerm && (
                      <span className="filter-badge search-badge">
                        Búsqueda: {searchTerm}
                      </span>
                    )}
                    <span className="product-count">
                      Mostrando {filteredProducts.length} de {products.length} vehículos
                    </span>
                  </div>
                </div>
                
                {filteredProducts.length === 0 ? (
                  <div className="no-results">
                    <p>No hay vehículos que coincidan con tu búsqueda o filtros seleccionados.</p>
                    <button 
                      className="btn-clear-filters" 
                      onClick={() => {
                        setSelectedCategories([]);
                        setSearchTerm('');
                        setStartDate('');
                        setEndDate('');
                      }}
                    >
                      Limpiar filtros y búsqueda
                    </button>
                  </div>
                ) : (
                  <>
                    <div className='products-grid'>
                      {currentProducts.map(product => (
                        <ProductCard 
                          key={product.id}
                          product={product}
                          user={user}
                          onFavoriteChange={loadProducts}
                        />
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
              
              <section className='section recommendations-section'>
                <h2>Recomendaciones</h2>
                <div className='products-grid'>
                  {randomProducts.map(product => (
                    <ProductCard 
                      key={product.id}
                      product={product}
                      user={user}
                      onFavoriteChange={loadProducts}
                    />
                  ))}
                </div>
              </section>
            </main>
          }
        />
        
        <Route path='/registro' element={<Register setUser={setUser} />} />
        <Route path='/login' element={<Login setUser={setUser} />} />
        <Route path='/product/:id' element={<ProductDetail products={products} user={user} />} />
        
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