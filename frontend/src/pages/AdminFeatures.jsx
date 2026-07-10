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

function AdminFeatures({ embedded = false }) {
    const navigate = useNavigate();
    const [features, setFeatures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editingFeature, setEditingFeature] = useState(null);
    const [formData, setFormData] = useState({ name: "", icon: "" });
    const [searchIcon, setSearchIcon] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const loadFeatures = async () => {
        try {
            const response = await fetch(`${API_URL}/api/features`);
            if (!response.ok) throw new Error("Error al cargar características");
            const data = await response.json();
            setFeatures(data);
        } catch (error) {
            setError("No se pudieron cargar las características");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadFeatures(); }, []);

    const validateField = (field, value) => {
        switch (field) {
            case 'name':
                if (!value.trim()) return "El nombre es obligatorio";
                if (value.length < 2) return "Mínimo 2 caracteres";
                if (value.length > 100) return "Máximo 100 caracteres";
                if (!/^[a-zA-ZáéíóúñÑ\s]+$/.test(value)) return "Solo letras y espacios";
                return "";
            case 'icon':
                if (!value) return "Debes seleccionar un ícono";
                return "";
            default: return "";
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (touched[name]) setFieldErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    };

    const handleBlur = (field) => {
        setTouched(prev => ({ ...prev, [field]: true }));
        setFieldErrors(prev => ({ ...prev, [field]: validateField(field, formData[field]) }));
    };

    const handleIconSelect = (icono) => {
        setFormData(prev => ({ ...prev, icon: icono }));
        if (touched.icon) setFieldErrors(prev => ({ ...prev, icon: "" }));
    };

    const handleCreate = () => {
        setEditingFeature(null);
        setFormData({ name: "", icon: "" });
        setFieldErrors({});
        setTouched({});
        setShowForm(true);
        setError("");
        setSearchIcon("");
    };

    const handleEdit = (feature) => {
        setEditingFeature(feature);
        setFormData({ name: feature.name, icon: feature.icon });
        setFieldErrors({});
        setTouched({});
        setShowForm(true);
        setError("");
        setSearchIcon("");
    };

    const validateForm = () => {
        const errors = { name: validateField('name', formData.name), icon: validateField('icon', formData.icon) };
        setFieldErrors(errors);
        setTouched({ name: true, icon: true });
        return !errors.name && !errors.icon;
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        if (!validateForm()) return;
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const url = editingFeature ? `${API_URL}/api/features/${editingFeature.id}` : `${API_URL}/api/features`;
            const method = editingFeature ? 'PUT' : 'POST';
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ name: formData.name.trim(), icon: formData.icon })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Error al guardar");
            setSuccess(editingFeature ? "Característica actualizada" : "Característica creada");
            setShowForm(false);
            loadFeatures();
        } catch (error) {
            setError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Eliminar esta característica?")) return;
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/api/features/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error("Error al eliminar");
            setSuccess("Característica eliminada");
            loadFeatures();
        } catch (error) {
            setError(error.message);
        }
    };

    const iconosFiltrados = ICONOS_DISPONIBLES.filter(i =>
        i.nombre.toLowerCase().includes(searchIcon.toLowerCase())
    );

    if (loading) return <p style={{ padding: '20px' }}>Cargando características...</p>;

    const form = showForm && (
        <div style={{ padding: '0 24px 24px 24px' }}>
            <div className="form-container">
                <h3>{editingFeature ? "Editar" : "Nueva"} Característica</h3>
                <form onSubmit={handleSave}>
                    <div className="form-group">
                        <label>Nombre *</label>
                        <input
                            type="text" name="name" value={formData.name}
                            onChange={handleChange} onBlur={() => handleBlur('name')}
                            placeholder="Ej: Aire acondicionado"
                            className={fieldErrors.name && touched.name ? "input-error" : ""}
                        />
                        {fieldErrors.name && touched.name && <span className="error-message">{fieldErrors.name}</span>}
                    </div>
                    <div className="form-group">
                        <label>Ícono *</label>
                        <div className="icon-search-bar">
                            <input type="text" placeholder="Buscar ícono..." value={searchIcon}
                                onChange={e => setSearchIcon(e.target.value)} className="search-input" />
                        </div>
                        <div className={`icon-selector-grid ${fieldErrors.icon && touched.icon ? 'input-error' : ''}`}>
                            {iconosFiltrados.map(iconoObj => (
                                <div key={iconoObj.icono}
                                    className={`icon-option ${formData.icon === iconoObj.icono ? 'selected' : ''}`}
                                    onClick={() => handleIconSelect(iconoObj.icono)}>
                                    <i className={`fas ${iconoObj.icono} icon-preview`}></i>
                                    <span className="icon-name">{iconoObj.nombre}</span>
                                </div>
                            ))}
                        </div>
                        {fieldErrors.icon && touched.icon && <span className="error-message">{fieldErrors.icon}</span>}
                        {formData.icon && !fieldErrors.icon && (
                            <div className="selected-icon-info">
                                <strong>Seleccionado:</strong>
                                <i className={`fas ${formData.icon}`}></i>
                                <code>{formData.icon}</code>
                            </div>
                        )}
                    </div>
                    <div className="form-buttons">
                        <button type="submit" className="btn-submit" disabled={isSubmitting}>
                            {isSubmitting ? "Guardando..." : (editingFeature ? "Actualizar" : "Crear")}
                        </button>
                        <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    );

    const table = (
        <table className="admin-table">
            <thead>
                <tr><th>ID</th><th>Ícono</th><th>Nombre</th><th>Acciones</th></tr>
            </thead>
            <tbody>
                {features.map(feature => (
                    <tr key={feature.id}>
                        <td>{feature.id}</td>
                        <td className="icon-cell"><i className={`fas ${feature.icon}`}></i></td>
                        <td>{feature.name}</td>
                        <td>
                            <button className="admin-view-btn" onClick={() => handleEdit(feature)}>Editar</button>
                            <button className="admin-delete-btn" onClick={() => handleDelete(feature.id)}>Eliminar</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    if (embedded) {
        return (
            <>
                <h2 className="admin-section-title">Administrar Características</h2>
                <div style={{ padding: '16px 24px' }}>
                    {error && <div className="form-error">{error}</div>}
                    {success && <div className="success-message">{success}</div>}
                    <button className="btn-admin-add" onClick={handleCreate}>+ Añadir nueva característica</button>
                </div>
                {form}
                {table}
            </>
        );
    }

    return (
        <div className="main-with-padding">
            <div className="admin-container">
                <h2 className="admin-title">Administrar Características</h2>
                {error && <div className="form-error">{error}</div>}
                {success && <div className="success-message">{success}</div>}
                <div className="admin-buttons">
                    <button className="btn-admin-add" onClick={handleCreate}>+ Añadir nueva característica</button>
                    <button className="btn-cancel" onClick={() => navigate("/administracion")}>Volver al Panel</button>
                </div>
                {form}
                <div className="admin-products-section">{table}</div>
            </div>
        </div>
    );
}

export default AdminFeatures;