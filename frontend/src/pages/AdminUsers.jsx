import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AdminUsers() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setCurrentUser(user);
            if (user.role !== "ADMIN") {
                setError("No tienes permisos de administrador");
                setTimeout(() => navigate("/"), 2000);
                return;
            }
        }
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const API_URL = 'http://localhost:8080';
            const response = await fetch(`${API_URL}/api/auth/users`, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            if (!response.ok) {
                throw new Error("Error al cargar usuarios");
            }
            
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error("Error:", error);
            setError("No se pudieron cargar los usuarios");
        } finally {
            setLoading(false);
        }
    };

    const updateUserRole = async (userId, newRole) => {
        setSuccess("");
        setError("");
        
        try {
            const API_URL = 'http://localhost:8080';
            const response = await fetch(`${API_URL}/api/auth/users/role`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userId,
                    role: newRole
                })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || "Error al actualizar rol");
            }
            
            setSuccess(`Rol actualizado correctamente`);
            loadUsers();
            
            if (currentUser && currentUser.id === userId) {
                const updatedUser = { ...currentUser, role: newRole };
                localStorage.setItem("user", JSON.stringify(updatedUser));
                setCurrentUser(updatedUser);
            }
            
        } catch (error) {
            console.error("Error:", error);
            setError(error.message);
        }
    };

    if (loading) {
        return (
            <div className="main-with-padding">
                <p>Cargando usuarios...</p>
            </div>
        );
    }

    return (
        <div className="main-with-padding">
            <div className="admin-container">
                <h2 className="admin-title">Gestión de Usuarios</h2>
                
                {error && <div className="form-error">{error}</div>}
                {success && <div className="success-message">{success}</div>}
                
                <div className="admin-products-section">
                    <h2>Listado de Usuarios Registrados</h2>
                    
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Email</th>
                                <th>Rol Actual</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.firstName} {user.lastName}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span className={`role-badge role-${user.role?.toLowerCase()}`}>
                                            {user.role === "ADMIN" ? "Administrador" : "Usuario"}
                                        </span>
                                    </td>
                                    <td>
                                        {user.role === "ADMIN" ? (
                                            <button 
                                                className="btn-remove-admin"
                                                onClick={() => updateUserRole(user.id, "USER")}
                                            >
                                                Quitar Admin
                                            </button>
                                        ) : (
                                            <button 
                                                className="btn-make-admin"
                                                onClick={() => updateUserRole(user.id, "ADMIN")}
                                            >
                                                Hacer Admin
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                <div className="form-buttons">
                    <button className="btn-cancel" onClick={() => navigate("/administracion")}>
                        Volver al Panel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AdminUsers;