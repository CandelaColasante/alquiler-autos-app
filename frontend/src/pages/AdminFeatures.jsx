import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = 'http://localhost:8080';

const ICONOS_DISPONIBLES = [
    { nombre: "Aire acondicionado", icono: "fa-snowflake" },
    { nombre: "ABS", icono: "fa-car" },
    { nombre: "GPS", icono: "fa-map-marker-alt" },
    { nombre: "Cámara de reversa", icono: "fa-video" },
    { nombre: "Sensor de estacionamiento", icono: "fa-waveform" },
    { nombre: "Bluetooth", icono: "fa-bluetooth" },
    { nombre: "USB", icono: "fa-usb" },
    { nombre: "Calefacción", icono: "fa-fire" },
    { nombre: "Asientos de cuero", icono: "fa-couch" },
    { nombre: "Techo solar", icono: "fa-sun" },
    { nombre: "Control crucero", icono: "fa-gauge-high" },
    { nombre: "Airbags", icono: "fa-shield" },
    { nombre: "Frenos ABS", icono: "fa-brake-warning" },
    { nombre: "Dirección asistida", icono: "fa-steering-wheel" },
    { nombre: "Levanta vidrios", icono: "fa-window-maximize" },
    { nombre: "Cierre centralizado", icono: "fa-lock" },
    { nombre: "Alarma", icono: "fa-bell" },
    { nombre: "Computadora de abordo", icono: "fa-display" },
    { nombre: "Aros de aleación", icono: "fa-circle" },
    { nombre: "Faros LED", icono: "fa-lightbulb" },
];

function AdminFeatures() {
    const navigate = useNavigate();
    const [features, setFeatures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editingFeature, setEditingFeature] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        icon: ""
    });
    const [searchIcon, setSearchIcon] = useState("");

    const loadFeatures = async () => {
        try {
            const response = await fetch(`${API_URL}/api/features`);
            if (!response.ok) throw new Error("Error al cargar características");
            const data = await response.json();
            setFeatures(data);
        } catch (error) {
            console.error("Error:", error);
            setError("No se pudieron cargar las características");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadFeatures();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleIconSelect = (icono) => {
        setFormData(prev => ({ ...prev, icon: icono }));
    };

    const handleCreate = () => {
        setEditingFeature(null);
        setFormData({ name: "", icon: "" });
        setShowForm(true);
        setError("");
        setSearchIcon("");
    };

    const handleEdit = (feature) => {
        setEditingFeature(feature);
        setFormData({ name: feature.name, icon: feature.icon });
        setShowForm(true);
        setError("");
        setSearchIcon("");
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!formData.name.trim() || !formData.icon.trim()) {
            setError("Todos los campos son obligatorios");
            return;
        }

        try {
            let response;
            if (editingFeature) {
                response = await fetch(`${API_URL}/api/features/${editingFeature.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: formData.name, icon: formData.icon })
                });
            } else {
                response = await fetch(`${API_URL}/api/features`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: formData.name, icon: formData.icon })
                });
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Error al guardar");
            }

            setSuccess(editingFeature ? "Característica actualizada" : "Característica creada");
            setShowForm(false);
            loadFeatures();
        } catch (error) {
            console.error("Error:", error);
            setError(error.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Estás seguro de eliminar esta característica?")) return;

        try {
            const response = await fetch(`${API_URL}/api/features/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Error al eliminar");
            }

            setSuccess("Característica eliminada");
            loadFeatures();
        } catch (error) {
            console.error("Error:", error);
            setError(error.message);
        }
    };

    const iconosFiltrados = ICONOS_DISPONIBLES.filter(iconoObj =>
        iconoObj.nombre.toLowerCase().includes(searchIcon.toLowerCase())
    );

    if (loading) {
        return (
            <div className="main-with-padding">
                <p>Cargando características...</p>
            </div>
        );
    }

    return (
        <div className="main-with-padding">
            <div className="admin-container">
                <h2 className="admin-title">Administrar Características</h2>
                
                {error && <div className="form-error">{error}</div>}
                {success && <div className="success-message">{success}</div>}

                <div className="admin-buttons">
                    <button className="btn-admin-add" onClick={handleCreate}>
                        + Añadir nueva característica
                    </button>
                    <button className="btn-cancel" onClick={() => navigate("/administracion")}>
                        Volver al Panel
                    </button>
                </div>

                {showForm && (
                    <div className="form-container">
                        <h3>{editingFeature ? "Editar" : "Nueva"} Característica</h3>
                        <form onSubmit={handleSave}>
                            <div className="form-group">
                                <label>Nombre de la característica</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Ej: Aire acondicionado"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Selecciona un ícono</label>
                                <div className="icon-search-bar">
                                    <input
                                        type="text"
                                        placeholder="Buscar ícono..."
                                        value={searchIcon}
                                        onChange={(e) => setSearchIcon(e.target.value)}
                                        className="search-input"
                                    />
                                </div>
                                
                                <div className="icon-selector-grid">
                                    {iconosFiltrados.map((iconoObj) => (
                                        <div
                                            key={iconoObj.icono}
                                            className={`icon-option ${formData.icon === iconoObj.icono ? 'selected' : ''}`}
                                            onClick={() => handleIconSelect(iconoObj.icono)}
                                        >
                                            <i className={`fas ${iconoObj.icono} icon-preview`}></i>
                                            <span className="icon-name">{iconoObj.nombre}</span>
                                        </div>
                                    ))}
                                </div>
                                
                                {formData.icon && (
                                    <div className="selected-icon-info">
                                        <strong>Ícono seleccionado:</strong>
                                        <i className={`fas ${formData.icon}`}></i>
                                        <code>{formData.icon}</code>
                                    </div>
                                )}
                            </div>

                            <div className="form-buttons">
                                <button type="submit" className="btn-submit">
                                    {editingFeature ? "Actualizar" : "Crear"}
                                </button>
                                <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="admin-products-section">
                    <h2>Listado de Características</h2>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Ícono</th>
                                <th>Nombre</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {features.map(feature => (
                                <tr key={feature.id}>
                                    <td>{feature.id}</td>
                                    <td className="icon-cell">
                                        <i className={`fas ${feature.icon}`}></i>
                                    </td>
                                    <td>{feature.name}</td>
                                    <td>
                                        <button className="admin-view-btn" onClick={() => handleEdit(feature)}>
                                            Editar
                                        </button>
                                        <button className="admin-delete-btn" onClick={() => handleDelete(feature.id)}>
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default AdminFeatures;