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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCreate = () => {
        setEditingCategory(null);
        setFormData({ name: "", description: "", imageUrl: "" });
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
        setShowForm(true);
        setError("");
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!formData.name.trim()) {
            setError("El nombre de la categoría es obligatorio");
            return;
        }

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
                        <form onSubmit={handleSave}>
                            <div className="form-group">
                                <label>Nombre de la categoría *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Ej: SUV, Sedán, Pickup"
                                    required
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Descripción</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Descripción de la categoría..."
                                    rows="3"
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Imagen representativa (URL)</label>
                                <input
                                    type="text"
                                    name="imageUrl"
                                    value={formData.imageUrl}
                                    onChange={handleChange}
                                    placeholder="https://ejemplo.com/imagen.jpg"
                                />
                                <small>Pega la URL de una imagen representativa para esta categoría</small>
                            </div>
                            
                            <div className="form-buttons">
                                <button type="submit" className="btn-submit">
                                    {editingCategory ? "Actualizar" : "Crear"}
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