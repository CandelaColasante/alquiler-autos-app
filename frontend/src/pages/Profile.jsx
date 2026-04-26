import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
            navigate("/login");
            return;
        }
        setUser(JSON.parse(storedUser));
    }, [navigate]);

    if (!user) {
        return (
            <div className="main-with-padding">
                <p>Cargando...</p>
            </div>
        );
    }

    return (
        <div className="main-with-padding">
            <div className="form-container">
                <h2>Mi Perfil</h2>
                
                <div className="profile-avatar-large">
                    {user.firstName?.charAt(0).toUpperCase()}
                    {user.lastName?.charAt(0).toUpperCase()}
                </div>
                
                <div className="profile-info">
                    <div className="info-group">
                        <label>Nombre completo:</label>
                        <p>{user.firstName} {user.lastName}</p>
                    </div>
                    
                    <div className="info-group">
                        <label>Correo electrónico:</label>
                        <p>{user.email}</p>
                    </div>
                    
                    <div className="info-group">
                        <label>Miembro desde:</label>
                        <p>{new Date(user.createdAt).toLocaleDateString('es-AR')}</p>
                    </div>
                </div>

                <div className="form-buttons">
                    <button 
                        className="btn-cancel" 
                        onClick={() => navigate("/")}
                    >
                        Volver al inicio
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Profile;