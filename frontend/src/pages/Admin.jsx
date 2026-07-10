import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts, deleteProduct } from "../services/api";
import AdminUsers from "./AdminUsers";
import AdminCategories from "./AdminCategories";
import AdminFeatures from "./AdminFeatures";
import AddProduct from "./AddProduct";

function Admin({ loadProducts }) {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState(null);
    const [products, setProducts] = useState([]);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        loadProductsList();
    }, []);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const loadProductsList = async () => {
        const data = await getProducts();
        setProducts(data);
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`¿Estás seguro de eliminar "${name}"?`)) return;
        await deleteProduct(id);
        await loadProductsList();
        await loadProducts();
    };

    const handleNavClick = (section) => {
        setActiveSection(prev => prev === section ? null : section);
    };

    if (isMobile) {
        return (
            <div className="main-with-padding">
                <div className="admin-mobile-message">
                    <h2>Acceso no disponible</h2>
                    <p>El panel de administración solo está disponible en dispositivos de escritorio.</p>
                    <button onClick={() => navigate("/")} className="btn-cancel">Volver al inicio</button>
                </div>
            </div>
        );
    }

    const menuItems = [
        { key: 'usuarios', label: 'Gestionar usuarios', icon: 'fa-users' },
        { key: 'productos', label: 'Listar productos', icon: 'fa-car' },
        { key: 'agregar', label: 'Agregar producto', icon: 'fa-plus-circle' },
        { key: 'caracteristicas', label: 'Administrar características', icon: 'fa-star' },
        { key: 'categorias', label: 'Administrar categorías', icon: 'fa-tags' },
    ];

    return (
        <div className="admin-layout">

            <aside className="admin-sidebar">
                <div className="admin-sidebar-header">
                    <i className="fas fa-cog"></i>
                    <h3>Panel Admin</h3>
                </div>

                <nav className="admin-sidebar-nav">
                    {menuItems.map(item => (
                        <button
                            key={item.key}
                            className={`admin-nav-item ${activeSection === item.key ? 'active' : ''}`}
                            onClick={() => handleNavClick(item.key)}
                        >
                            <i className={`fas ${item.icon}`}></i>
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>

                <button className="btn-cancel admin-sidebar-back" onClick={() => navigate("/")}>
                    ← Volver al inicio
                </button>
            </aside>

            <main className="admin-main">
                {!activeSection && (
                    <div className="admin-welcome">
                        <i className="fas fa-tachometer-alt"></i>
                        <h2>Bienvenido al Panel de Administración</h2>
                        <p>Seleccioná una opción del menú para comenzar.</p>
                        <div className="admin-welcome-cards">
                            {menuItems.map(item => (
                                <div
                                    key={item.key}
                                    className="admin-welcome-card"
                                    onClick={() => setActiveSection(item.key)}
                                >
                                    <i className={`fas ${item.icon}`}></i>
                                    <span>{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeSection === 'usuarios' && (
                    <div className="admin-section-content">
                        <AdminUsers embedded={true} />
                    </div>
                )}

                {activeSection === 'productos' && (
                    <div className="admin-section-content">
                        <h2 className="admin-section-title">Listado de productos</h2>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Categoría</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                                            No hay productos cargados.
                                        </td>
                                    </tr>
                                ) : (
                                    products.map(product => (
                                        <tr key={product.id}>
                                            <td>{product.id}</td>
                                            <td>{product.name}</td>
                                            <td>{product.category?.name || '—'}</td>
                                            <td>
                                                <button
                                                    className="admin-view-btn"
                                                    onClick={() => navigate(`/product/${product.id}`)}
                                                >
                                                    Ver
                                                </button>
                                                <button
                                                    className="admin-edit-btn"
                                                    onClick={() => navigate(`/edit-product/${product.id}`)}
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    className="admin-delete-btn"
                                                    onClick={() => handleDelete(product.id, product.name)}
                                                >
                                                    Eliminar
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeSection === 'agregar' && (
                    <div className="admin-section-content">
                        <AddProduct
                            loadProducts={async () => {
                                await loadProducts();
                                await loadProductsList();
                            }}
                            embedded={true}
                        />
                    </div>
                )}

                {activeSection === 'caracteristicas' && (
                    <div className="admin-section-content">
                        <AdminFeatures embedded={true} />
                    </div>
                )}

                {activeSection === 'categorias' && (
                    <div className="admin-section-content">
                        <AdminCategories embedded={true} />
                    </div>
                )}
            </main>
        </div>
    );
}

export default Admin;