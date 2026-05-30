import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../services/api";

const API_URL = 'http://localhost:8080';

function AdminCategories() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        imageUrl: ""
    });
    
    const [fieldErrors, setFieldErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const loadCategories = async () => {
        try {
            const data = await getCategories();
            setCategories(data);
        } catch (error) {
            console.error("Error:", error);
            setError("No se pudieron cargar las categorías");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    const validateField = (field, value) => {
        switch (field) {
            case 'name':
                if (!value.trim()) return "El nombre de la categoría es obligatorio";
                if (value.length < 2) return "El nombre debe tener al menos 2 caracteres";
                if (value.length > 50) return "El nombre no puede superar los 50 caracteres";
                if (!/^[a-zA-ZáéíóúñÑ\s]+$/.test(value)) return "El nombre solo puede contener letras y espacios";
                return "";
            case 'description':
                if (value.length > 500) return "La descripción no puede superar los 500 caracteres";
                return "";
            case 'imageUrl':
                if (value && !value.match(/^https?:\/\/.+\..+/)) {
                    return "Ingresa una URL válida (ej: https://ejemplo.com/imagen.jpg)";
                }
                return "";
            default:
                return "";
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (touched[name]) {
            const error = validateField(name, value);
            setFieldErrors(prev => ({ ...prev, [name]: error }));
        }
    };

    const handleBlur = (field) => {
        setTouched(prev => ({ ...prev, [field]: true }));
        const error = validateField(field, formData[field]);
        setFieldErrors(prev => ({ ...prev, [field]: error }));
    };

    const handleCreate = () => {
        setEditingCategory(null);
        setFormData({ name: "", description: "", imageUrl: "" });
        setFieldErrors({});
        setTouched({});
        setShowForm(true);
        setError("");
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            description: category.description || "",
            imageUrl: category.imageUrl || ""
        });
        setFieldErrors({});
        setTouched({});
        setShowForm(true);
        setError("");
    };

    const validateForm = () => {
        const nameError = validateField('name', formData.name);
        const descriptionError = validateField('description', formData.description);
        const imageUrlError = validateField('imageUrl', formData.imageUrl);
        
        const errors = {
            name: nameError,
            description: descriptionError,
            imageUrl: imageUrlError
        };
        
        setFieldErrors(errors);
        setTouched({ name: true, description: true, imageUrl: true });
        
        return !nameError && !descriptionError && !imageUrlError;
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        
        if (!validateForm()) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        setIsSubmitting(true);

        try {
            const categoryData = {
                name: formData.name.trim(),
                description: formData.description.trim(),
                imageUrl: formData.imageUrl.trim()
            };
            
            if (editingCategory) {
                await updateCategory(editingCategory.id, categoryData);
                setSuccess("Categoría actualizada correctamente");
            } else {
                await createCategory(categoryData);
                setSuccess("Categoría creada correctamente");
            }
            
            setShowForm(false);
            loadCategories();
        } catch (error) {
            console.error("Error:", error);
            setError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`¿Estás seguro de eliminar la categoría "${name}"?`)) return;
        
        try {
            await deleteCategory(id);
            setSuccess("Categoría eliminada correctamente");
            loadCategories();
        } catch (error) {
            console.error("Error:", error);
            setError(error.message);
        }
    };

    if (loading) {
        return (
            <div className="main-with-padding">
                <p>Cargando categorías...</p>
            </div>
        );
    }

    return (
        <div className="main-with-padding">
            <div className="admin-container">
                <h2 className="admin-title">Administrar Categorías</h2>
                
                {error && <div className="form-error">{error}</div>}
                {success && <div className="success-message">{success}</div>}

                <div className="admin-buttons">
                    <button className="btn-admin-add" onClick={handleCreate}>
                        + Añadir nueva categoría
                    </button>
                    <button className="btn-cancel" onClick={() => navigate("/administracion")}>
                        Volver al Panel
                    </button>
                </div>

                {showForm && (
                    <div className="form-container">
                        <h3>{editingCategory ? "Editar" : "Nueva"} Categoría</h3>
                        <form onSubmit={handleSave} noValidate>
                            <div className="form-group">
                                <label>Nombre de la categoría *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    onBlur={() => handleBlur('name')}
                                    placeholder="Ej: SUV, Sedán, Pickup"
                                    className={fieldErrors.name && touched.name ? "input-error" : ""}
                                />
                                {fieldErrors.name && touched.name && (
                                    <span className="error-message">{fieldErrors.name}</span>
                                )}
                            </div>
                            
                            <div className="form-group">
                                <label>Descripción</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    onBlur={() => handleBlur('description')}
                                    placeholder="Descripción de la categoría..."
                                    rows="3"
                                    className={fieldErrors.description && touched.description ? "input-error" : ""}
                                />
                                {fieldErrors.description && touched.description && (
                                    <span className="error-message">{fieldErrors.description}</span>
                                )}
                            </div>
                            
                            <div className="form-group">
                                <label>Imagen representativa (URL)</label>
                                <input
                                    type="text"
                                    name="imageUrl"
                                    value={formData.imageUrl}
                                    onChange={handleChange}
                                    onBlur={() => handleBlur('imageUrl')}
                                    placeholder="https://ejemplo.com/imagen.jpg"
                                    className={fieldErrors.imageUrl && touched.imageUrl ? "input-error" : ""}
                                />
                                <small>Pega la URL de una imagen representativa para esta categoría</small>
                                {fieldErrors.imageUrl && touched.imageUrl && (
                                    <span className="error-message">{fieldErrors.imageUrl}</span>
                                )}
                            </div>
                            
                            <div className="form-buttons">
                                <button type="submit" className="btn-submit" disabled={isSubmitting}>
                                    {isSubmitting ? "Guardando..." : (editingCategory ? "Actualizar" : "Crear")}
                                </button>
                                <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="admin-products-section">
                    <h2>Listado de Categorías</h2>
                    <div className="categories-grid">
                        {categories.map(category => (
                            <div key={category.id} className="category-card">
                                <div className="category-image">
                                    {category.imageUrl ? (
                                        <img 
                                            src={category.imageUrl} 
                                            alt={category.name}
                                        />
                                    ) : (
                                        <div className="category-image-placeholder">
                                            Sin imagen
                                        </div>
                                    )}
                                </div>
                                <div className="category-info">
                                    <h3>{category.name}</h3>
                                    <p>{category.description || "Sin descripción"}</p>
                                </div>
                                <div className="category-actions">
                                    <button className="admin-view-btn" onClick={() => handleEdit(category)}>
                                        Editar
                                    </button>
                                    <button className="admin-delete-btn" onClick={() => handleDelete(category.id, category.name)}>
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminCategories;