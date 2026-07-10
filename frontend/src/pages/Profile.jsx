import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserFavorites, removeFavorite, getUserReservations } from "../services/api";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [activeSection, setActiveSection] = useState('perfil');
    const [favorites, setFavorites] = useState([]);
    const [loadingFavorites, setLoadingFavorites] = useState(false);
    const [errorFavorites, setErrorFavorites] = useState(null);
    const [reservations, setReservations] = useState([]);
    const [loadingReservations, setLoadingReservations] = useState(false);
    const [errorReservations, setErrorReservations] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
            navigate("/login");
            return;
        }
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        loadFavorites(parsedUser.id);
        loadReservations(parsedUser.id);
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

    const loadReservations = async (userId) => {
        setLoadingReservations(true);
        setErrorReservations(null);
        try {
            const data = await getUserReservations(userId);
            const sorted = data.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
            setReservations(sorted);
        } catch (err) {
            setErrorReservations('No se pudo cargar tu historial de reservas.');
        } finally {
            setLoadingReservations(false);
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

    const formatDate = (dateStr) => {
        const [year, month, day] = dateStr.split('-');
        return format(new Date(parseInt(year), parseInt(month) - 1, parseInt(day)), "dd 'de' MMMM 'de' yyyy", { locale: es });
    };

    const getReservationStatus = (endDate) => {
        const [year, month, day] = endDate.split('-');
        const end = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return end < today ? 'finalizada' : 'activa';
    };

    if (!user) {
        return <div className="main-with-padding"><p>Cargando...</p></div>;
    }

    return (
        <div className="profile-layout">

            <aside className="profile-sidebar">
                <div className="profile-sidebar-avatar">
                    <div className="profile-avatar-large">
                        {user.firstName?.charAt(0).toUpperCase()}
                        {user.lastName?.charAt(0).toUpperCase()}
                    </div>
                    <h3>{user.firstName} {user.lastName}</h3>
                    <span className="profile-role-badge">{user.role}</span>
                </div>

                <nav className="profile-sidebar-nav">
                    <button
                        className={`profile-nav-item ${activeSection === 'perfil' ? 'active' : ''}`}
                        onClick={() => setActiveSection('perfil')}
                    >
                        <i className="fas fa-user"></i>
                        <span>Sobre mí</span>
                    </button>
                    <button
                        className={`profile-nav-item ${activeSection === 'reservas' ? 'active' : ''}`}
                        onClick={() => setActiveSection('reservas')}
                    >
                        <i className="fas fa-calendar-alt"></i>
                        <span>Mis reservas</span>
                        {reservations.length > 0 && (
                            <span className="profile-nav-badge">{reservations.length}</span>
                        )}
                    </button>
                    <button
                        className={`profile-nav-item ${activeSection === 'favoritos' ? 'active' : ''}`}
                        onClick={() => setActiveSection('favoritos')}
                    >
                        <i className="fas fa-heart"></i>
                        <span>Mis favoritos</span>
                        {favorites.length > 0 && (
                            <span className="profile-nav-badge">{favorites.length}</span>
                        )}
                    </button>
                </nav>

                <button className="btn-cancel profile-sidebar-back" onClick={() => navigate("/")}>
                    ← Volver al inicio
                </button>
            </aside>

            <main className="profile-main">

                {/* Sección: Sobre mí */}
                {activeSection === 'perfil' && (
                    <div className="profile-section">
                        <h2 className="profile-section-title">Sobre mí</h2>
                        <div className="profile-info-card">
                            <div className="info-group">
                                <label>Nombre completo</label>
                                <p>{user.firstName} {user.lastName}</p>
                            </div>
                            <div className="info-group">
                                <label>Correo electrónico</label>
                                <p>{user.email}</p>
                            </div>
                            <div className="info-group">
                                <label>Rol</label>
                                <span className="profile-role-badge">{user.role}</span>
                            </div>
                            <div className="info-group">
                                <label>Reservas realizadas</label>
                                <p>{reservations.length} reserva{reservations.length !== 1 ? 's' : ''}</p>
                            </div>
                            <div className="info-group">
                                <label>Vehículos favoritos</label>
                                <p>{favorites.length} vehículo{favorites.length !== 1 ? 's' : ''}</p>
                            </div>
                        </div>
                    </div>
                )}

                {activeSection === 'reservas' && (
                    <div className="profile-section">
                        <h2 className="profile-section-title">Mis reservas</h2>

                        {loadingReservations && <p className="favorites-loading">Cargando reservas...</p>}

                        {errorReservations && !loadingReservations && (
                            <div className="availability-error">
                                <p>⚠️ {errorReservations}</p>
                                <button onClick={() => loadReservations(user.id)} className="retry-btn">Reintentar</button>
                            </div>
                        )}

                        {!loadingReservations && !errorReservations && reservations.length === 0 && (
                            <div className="no-favorites">
                                <i className="fas fa-calendar-times"></i>
                                <p>No tenés reservas todavía.</p>
                                <button className="btn" onClick={() => navigate("/")}>Explorar vehículos</button>
                            </div>
                        )}

                        {!loadingReservations && !errorReservations && reservations.length > 0 && (
                            <div className="reservations-list">
                                {reservations.map(reservation => {
                                    const status = getReservationStatus(reservation.endDate);
                                    return (
                                        <div key={reservation.id} className="reservation-item">
                                            <div className="reservation-item-header">
                                                <h4
                                                    className="reservation-product-name"
                                                    onClick={() => navigate(`/product/${reservation.productId}`)}
                                                >
                                                    <i className="fas fa-car"></i> {reservation.productName}
                                                </h4>
                                                <span className={`reservation-status ${status}`}>
                                                    {status === 'activa' ? 'Activa' : 'Finalizada'}
                                                </span>
                                            </div>
                                            <div className="reservation-item-dates">
                                                <div className="reservation-item-date">
                                                    <label>Desde</label>
                                                    <span>{formatDate(reservation.startDate)}</span>
                                                </div>
                                                <i className="fas fa-arrow-right"></i>
                                                <div className="reservation-item-date">
                                                    <label>Hasta</label>
                                                    <span>{formatDate(reservation.endDate)}</span>
                                                </div>
                                            </div>
                                            {reservation.notes && (
                                                <p className="reservation-item-notes">
                                                    <i className="fas fa-comment"></i> {reservation.notes}
                                                </p>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {activeSection === 'favoritos' && (
                    <div className="profile-section">
                        <h2 className="profile-section-title">Mis favoritos</h2>

                        {loadingFavorites && <p className="favorites-loading">Cargando favoritos...</p>}

                        {errorFavorites && !loadingFavorites && (
                            <div className="availability-error">
                                <p>⚠️ {errorFavorites}</p>
                                <button onClick={() => loadFavorites(user.id)} className="retry-btn">Reintentar</button>
                            </div>
                        )}

                        {!loadingFavorites && !errorFavorites && favorites.length === 0 && (
                            <div className="no-favorites">
                                <i className="fas fa-heart-broken"></i>
                                <p>No tenés vehículos favoritos todavía.</p>
                                <button className="btn" onClick={() => navigate("/")}>Explorar vehículos</button>
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
                                            <i className="fas fa-heart-broken"></i> Quitar
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}

export default Profile;