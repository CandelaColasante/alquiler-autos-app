import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCategories, createCategory, updateCategory, deleteCategory, getProducts } from "../services/api";

function AdminCategories({ embedded = false }) {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({ name: "", description: "", imageUrl: "" });
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const loadCategories = async () => {
        try {
            const data = await getCategories();
            setCategories(data);
        } catch (error) {
            setError("No se pudieron cargar las categorías");
        } finally {
            setLoading(false);
        }
    };

    const loadProductsList = async () => {
        try {
            const data = await getProducts();
            setProducts(data);
        } catch (error) {
            console.error("Error al cargar productos:", error);
        }
    };

    useEffect(() => { loadCategories(); loadProductsList(); }, []);

    const validateField = (field, value) => {
        switch (field) {
            case 'name':
                if (!value.trim()) return "El nombre es obligatorio";
                if (value.length < 2) return "Mínimo 2 caracteres";
                if (value.length > 50) return "Máximo 50 caracteres";
                if (!/^[a-zA-ZáéíóúñÑ\s]+$/.test(value)) return "Solo letras y espacios";
                return "";
            case 'description':
                if (value.length > 500) return "Máximo 500 caracteres";
                return "";
            case 'imageUrl':
                if (value && !value.match(/^https?:\/\/.+\..+/)) return "URL no válida";
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
        setFormData({ name: category.name, description: category.description || "", imageUrl: category.imageUrl || "" });
        setFieldErrors({});
        setTouched({});
        setShowForm(true);
        setError("");
    };

    const validateForm = () => {
        const errors = {
            name: validateField('name', formData.name),
            description: validateField('description', formData.description),
            imageUrl: validateField('imageUrl', formData.imageUrl)
        };
        setFieldErrors(errors);
        setTouched({ name: true, description: true, imageUrl: true });
        return !errors.name && !errors.description && !errors.imageUrl;
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        if (!validateForm()) return;
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
            setError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getProductCount = (categoryId) =>
        products.filter(p => p.category && p.category.id === categoryId).length;

    const handleDeleteClick = (category) => {
        setDeleteTarget({ ...category, productCount: getProductCount(category.id) });
        setError("");
        setSuccess("");
    };

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            await deleteCategory(deleteTarget.id);
            setSuccess("Categoría eliminada correctamente");
            setDeleteTarget(null);
            loadCategories();
            loadProductsList();
        } catch (error) {
            setError(error.message);
            setDeleteTarget(null);
        } finally {
            setDeleting(false);
        }
    };

    if (loading) return <p style={{ padding: '20px' }}>Cargando categorías...</p>;

    const form = showForm && (
        <div style={{ padding: '0 24px 24px 24px' }}>
            <div className="form-container">
                <h3>{editingCategory ? "Editar" : "Nueva"} Categoría</h3>
                <form onSubmit={handleSave} noValidate>
                    <div className="form-group">
                        <label>Nombre *</label>
                        <input type="text" name="name" value={formData.name}
                            onChange={handleChange} onBlur={() => handleBlur('name')}
                            placeholder="Ej: SUV, Sedán"
                            className={fieldErrors.name && touched.name ? "input-error" : ""} />
                        {fieldErrors.name && touched.name && <span className="error-message">{fieldErrors.name}</span>}
                    </div>
                    <div className="form-group">
                        <label>Descripción</label>
                        <textarea name="description" value={formData.description}
                            onChange={handleChange} onBlur={() => handleBlur('description')}
                            placeholder="Descripción..." rows="3"
                            className={fieldErrors.description && touched.description ? "input-error" : ""} />
                        {fieldErrors.description && touched.description && <span className="error-message">{fieldErrors.description}</span>}
                    </div>
                    <div className="form-group">
                        <label>Imagen (URL)</label>
                        <input type="text" name="imageUrl" value={formData.imageUrl}
                            onChange={handleChange} onBlur={() => handleBlur('imageUrl')}
                            placeholder="https://ejemplo.com/imagen.jpg"
                            className={fieldErrors.imageUrl && touched.imageUrl ? "input-error" : ""} />
                        <small>URL de una imagen representativa</small>
                        {fieldErrors.imageUrl && touched.imageUrl && <span className="error-message">{fieldErrors.imageUrl}</span>}
                    </div>
                    <div className="form-buttons">
                        <button type="submit" className="btn-submit" disabled={isSubmitting}>
                            {isSubmitting ? "Guardando..." : (editingCategory ? "Actualizar" : "Crear")}
                        </button>
                        <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    );

    const grid = (
        <div style={{ padding: '0 24px 24px 24px' }}>
            <div className="categories-grid">
                {categories.map(category => (
                    <div key={category.id} className="category-card">
                        <div className="category-image">
                            {category.imageUrl
                                ? <img src={category.imageUrl} alt={category.name} />
                                : <div className="category-image-placeholder">Sin imagen</div>
                            }
                        </div>
                        <div className="category-info">
                            <h3>{category.name}</h3>
                            <p>{category.description || "Sin descripción"}</p>
                            <span className="category-product-count">
                                <i className="fas fa-car"></i> {getProductCount(category.id)} producto{getProductCount(category.id) !== 1 ? 's' : ''}
                            </span>
                        </div>
                        <div className="category-actions">
                            <button className="admin-view-btn" onClick={() => handleEdit(category)}>Editar</button>
                            <button className="admin-delete-btn" onClick={() => handleDeleteClick(category)}>Eliminar</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const deleteModal = deleteTarget && (
        <div className="confirm-overlay" onClick={() => !deleting && setDeleteTarget(null)}>
            <div className="confirm-modal" onClick={e => e.stopPropagation()}>
                <div className="confirm-modal-icon"><i className="fas fa-exclamation-triangle"></i></div>
                <h3>Eliminar categoría</h3>
                <p>¿Eliminar <strong>"{deleteTarget.name}"</strong>?</p>
                {deleteTarget.productCount > 0 && (
                    <div className="confirm-warning">
                        <i className="fas fa-info-circle"></i>
                        Esta categoría tiene <strong>{deleteTarget.productCount}</strong> producto{deleteTarget.productCount !== 1 ? 's' : ''} asociado{deleteTarget.productCount !== 1 ? 's' : ''}.
                        Al eliminarla, <strong>también se eliminarán todos esos productos</strong> junto con sus reseñas, reservas e imágenes.
                        <br /><br />Esta acción <strong>no se puede deshacer</strong>.
                    </div>
                )}
                <div className="confirm-modal-buttons">
                    <button className="btn-cancel" onClick={() => setDeleteTarget(null)} disabled={deleting}>Cancelar</button>
                    <button className="confirm-delete-btn" onClick={confirmDelete} disabled={deleting}>
                        {deleting ? "Eliminando..." : "Sí, eliminar"}
                    </button>
                </div>
            </div>
        </div>
    );

    if (embedded) {
        return (
            <>
                <h2 className="admin-section-title">Administrar Categorías</h2>
                <div style={{ padding: '16px 24px' }}>
                    {error && <div className="form-error">{error}</div>}
                    {success && <div className="success-message">{success}</div>}
                    <button className="btn-admin-add" onClick={handleCreate}>+ Añadir nueva categoría</button>
                </div>
                {form}
                {grid}
                {deleteModal}
            </>
        );
    }

    return (
        <div className="main-with-padding">
            <div className="admin-container">
                <h2 className="admin-title">Administrar Categorías</h2>
                {error && <div className="form-error">{error}</div>}
                {success && <div className="success-message">{success}</div>}
                <div className="admin-buttons">
                    <button className="btn-admin-add" onClick={handleCreate}>+ Añadir nueva categoría</button>
                    <button className="btn-cancel" onClick={() => navigate("/administracion")}>Volver al Panel</button>
                </div>
                {form}
                <div className="admin-products-section">{grid}</div>
                {deleteModal}
            </div>
        </div>
    );
}

export default AdminCategories;