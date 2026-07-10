import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AdminUsers({ embedded = false }) {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [currentUser, setCurrentUser] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

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
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/api/auth/users`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error("Error al cargar usuarios");
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
        setIsProcessing(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/api/auth/users/role`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ userId, role: newRole })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Error al actualizar rol");
            setSuccess("Rol actualizado correctamente");
            await loadUsers();
            if (currentUser && currentUser.id === userId) {
                const updatedUser = { ...currentUser, role: newRole };
                localStorage.setItem("user", JSON.stringify(updatedUser));
                setCurrentUser(updatedUser);
            }
            setTimeout(() => setSuccess(""), 3000);
        } catch (error) {
            setError(error.message);
            setTimeout(() => setError(""), 3000);
        } finally {
            setIsProcessing(false);
        }
    };

    if (loading) return <p style={{ padding: '20px' }}>Cargando usuarios...</p>;

    const content = (
        <>
            <h2 className="admin-section-title">Gestión de usuarios</h2>
            <div style={{ padding: '16px 24px' }}>
                {error && <div className="form-error">{error}</div>}
                {success && <div className="success-message">{success}</div>}
            </div>
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Rol</th>
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
                                    <button className="btn-remove-admin" onClick={() => updateUserRole(user.id, "USER")} disabled={isProcessing}>
                                        {isProcessing ? "Procesando..." : "Quitar Admin"}
                                    </button>
                                ) : (
                                    <button className="btn-make-admin" onClick={() => updateUserRole(user.id, "ADMIN")} disabled={isProcessing}>
                                        {isProcessing ? "Procesando..." : "Hacer Admin"}
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );

    if (embedded) return content;

    return (
        <div className="main-with-padding">
            <div className="admin-container">
                <h2 className="admin-title">Gestión de Usuarios</h2>
                {error && <div className="form-error">{error}</div>}
                {success && <div className="success-message">{success}</div>}
                <div className="admin-products-section">{content}</div>
                <div className="form-buttons">
                    <button className="btn-cancel" onClick={() => navigate("/administracion")}>Volver al Panel</button>
                </div>
            </div>
        </div>
    );
}

export default AdminUsers;