import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserFavorites, removeFavorite } from "../services/api";

function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const [loadingFavorites, setLoadingFavorites] = useState(false);
    const [errorFavorites, setErrorFavorites] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
            navigate("/login");
            return;
        }
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        loadFavorites(parsedUser.id);
    }, [navigate]);

    const loadFavorites = async (userId) => {
        setLoadingFavorites(true);
        setErrorFavorites(null);
        try {
            const data = await getUserFavorites(userId);
            setFavorites(data);
        } catch (err) {
            setErrorFavorites('No se pudo cargar tu lista de favoritos.');
        } finally {
            setLoadingFavorites(false);
        }
    };

    const handleRemoveFavorite = async (productId) => {
        try {
            await removeFavorite(user.id, productId);
            setFavorites(prev => prev.filter(p => p.id !== productId));
        } catch (err) {
            alert('No se pudo eliminar el favorito. Intentá de nuevo.');
        }
    };

    if (!user) {
        return (
            <div className="main-with-padding">
                <p>Cargando...</p>
            </div>
        );
    }

    return (
        <div className="main-with-padding profile-page">

            <div className="profile-card">
                <div className="profile-avatar-large">
                    {user.firstName?.charAt(0).toUpperCase()}
                    {user.lastName?.charAt(0).toUpperCase()}
                </div>
                <div className="profile-info">
                    <div className="info-group">
                        <label>Nombre completo</label>
                        <p>{user.firstName} {user.lastName}</p>
                    </div>
                    <div className="info-group">
                        <label>Correo electrónico</label>
                        <p>{user.email}</p>
                    </div>
                    {user.role && (
                        <div className="info-group">
                            <label>Rol</label>
                            <span className="profile-role-badge">{user.role}</span>
                        </div>
                    )}
                </div>
                <button className="btn-cancel" onClick={() => navigate("/")}>
                    Volver al inicio
                </button>
            </div>

            <div className="profile-favorites-card">
                <div className="profile-favorites-header">
                    <h3><i className="fas fa-heart" style={{ color: '#eb5200', marginRight: '8px' }}></i>Mis favoritos</h3>
                    <span className="favorites-count">{favorites.length} vehículo{favorites.length !== 1 ? 's' : ''}</span>
                </div>

                {loadingFavorites && (
                    <p className="favorites-loading">Cargando favoritos...</p>
                )}

                {errorFavorites && !loadingFavorites && (
                    <div className="availability-error">
                        <p>⚠️ {errorFavorites}</p>
                        <button onClick={() => loadFavorites(user.id)} className="retry-btn">
                            Reintentar
                        </button>
                    </div>
                )}

                {!loadingFavorites && !errorFavorites && favorites.length === 0 && (
                    <div className="no-favorites">
                        <i className="fas fa-heart-broken"></i>
                        <p>No tenés vehículos favoritos todavía.</p>
                        <button className="btn" onClick={() => navigate("/")}>
                            Explorar vehículos
                        </button>
                    </div>
                )}

                {!loadingFavorites && !errorFavorites && favorites.length > 0 && (
                    <div className="favorites-grid">
                        {favorites.map(product => (
                            <div key={product.id} className="favorite-card">
                                <img
                                    src={product.images?.[0] || 'https://placehold.co/200x130?text=Sin+imagen'}
                                    alt={product.name}
                                    className="favorite-card-image"
                                    onClick={() => navigate(`/product/${product.id}`)}
                                    onError={(e) => {
                                        if (e.target.dataset.errored) return;
                                        e.target.dataset.errored = 'true';
                                        e.target.src = 'https://placehold.co/200x130?text=Sin+imagen';
                                    }}
                                />
                                <div className="favorite-card-info">
                                    <h4 onClick={() => navigate(`/product/${product.id}`)}>
                                        {product.name}
                                    </h4>
                                    {product.category && (
                                        <span className="category-badge">{product.category.name}</span>
                                    )}
                                    {product.description && (
                                        <p>{product.description.substring(0, 60)}...</p>
                                    )}
                                </div>
                                <button
                                    className="remove-favorite-btn"
                                    onClick={() => handleRemoveFavorite(product.id)}
                                    title="Quitar de favoritos"
                                >
                                     Quitar
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Profile;