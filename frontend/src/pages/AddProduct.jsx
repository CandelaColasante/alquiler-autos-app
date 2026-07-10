import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createProduct, getProducts, getCategories } from "../services/api";

const API_URL = 'http://localhost:8080';

function AddProduct({ loadProducts, embedded = false }) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [categories, setCategories] = useState([]);
    const [images, setImages] = useState([]);
    const [error, setError] = useState("");
    const [allFeatures, setAllFeatures] = useState([]);
    const [selectedFeatures, setSelectedFeatures] = useState([]);
    const [fieldErrors, setFieldErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [imageErrors, setImageErrors] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCats = async () => {
            try {
                const data = await getCategories();
                setCategories(data);
            } catch (err) {
                console.error("Error al cargar categorías", err);
            }
        };
        fetchCats();
    }, []);

    useEffect(() => {
        const fetchFeatures = async () => {
            try {
                const response = await fetch(`${API_URL}/api/features`);
                const data = await response.json();
                setAllFeatures(data);
            } catch (err) {
                console.error("Error al cargar características", err);
            }
        };
        fetchFeatures();
    }, []);

    const checkDuplicateName = async (name) => {
        try {
            const products = await getProducts();
            return products.some(p => p.name.toLowerCase() === name.toLowerCase());
        } catch {
            return false;
        }
    };

    const handleFeatureToggle = (featureId) => {
        setSelectedFeatures(prev =>
            prev.includes(featureId) ? prev.filter(id => id !== featureId) : [...prev, featureId]
        );
    };

    const validateField = (field, value) => {
        switch (field) {
            case 'name':
                if (!value.trim()) return "El nombre es obligatorio";
                if (value.length < 2) return "Mínimo 2 caracteres";
                if (value.length > 100) return "Máximo 100 caracteres";
                return "";
            case 'description':
                if (!value.trim()) return "La descripción es obligatoria";
                if (value.length < 10) return "Mínimo 10 caracteres";
                if (value.length > 1000) return "Máximo 1000 caracteres";
                return "";
            case 'categoryId':
                if (!value) return "Seleccioná una categoría";
                return "";
            default: return "";
        }
    };

    const validateImages = (files) => {
        const MAX_SIZE = 5 * 1024 * 1024;
        const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
        const errorsList = [];
        if (files.length === 0) { errorsList.push("Seleccioná al menos una imagen"); return errorsList; }
        for (const file of files) {
            if (!ALLOWED_TYPES.includes(file.type)) errorsList.push(`"${file.name}" no es un formato válido.`);
            if (file.size > MAX_SIZE) errorsList.push(`"${file.name}" supera el tamaño máximo de 5MB.`);
        }
        return errorsList;
    };

    const handleBlur = (field) => {
        setTouched(prev => ({ ...prev, [field]: true }));
        const value = field === 'name' ? name : field === 'description' ? description : categoryId;
        setFieldErrors(prev => ({ ...prev, [field]: validateField(field, value) }));
    };

    const handleImageChangeWithValidation = (e) => {
        const files = Array.from(e.target.files);
        const errors = validateImages(files);
        if (errors.length > 0) { setImageErrors(errors); setImages([]); }
        else { setImageErrors([]); setImages(files); setError(""); }
    };

    const resetForm = () => {
        setName("");
        setDescription("");
        setCategoryId("");
        setImages([]);
        setSelectedFeatures([]);
        setFieldErrors({});
        setTouched({});
        setImageErrors([]);
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMsg("");
        setTouched({ name: true, description: true, categoryId: true });

        const nameError = validateField('name', name);
        const descriptionError = validateField('description', description);
        const categoryError = validateField('categoryId', categoryId);

        if (nameError || descriptionError || categoryError) {
            setFieldErrors({ name: nameError, description: descriptionError, categoryId: categoryError });
            return;
        }
        if (images.length === 0) { setImageErrors(["Seleccioná al menos una imagen"]); return; }
        if (imageErrors.length > 0) return;

        const isDuplicate = await checkDuplicateName(name);
        if (isDuplicate) {
            setFieldErrors(prev => ({ ...prev, name: "Ya existe un vehículo con ese nombre." }));
            return;
        }

        setIsSubmitting(true);
        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("categoryId", categoryId);
        formData.append("featureIds", selectedFeatures.join(","));
        images.forEach(img => formData.append("images", img));

        try {
            await createProduct(formData);
            if (loadProducts) await loadProducts();
            if (embedded) {
                setSuccessMsg("¡Vehículo registrado con éxito!");
                resetForm();
            } else {
                alert("¡Vehículo registrado con éxito!");
                navigate("/administracion");
            }
        } catch (error) {
            setError("Error al conectar con el servidor. Intentá de nuevo.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const formContent = (
        <>
            {error && <div className="form-error">{error}</div>}
            {successMsg && <div className="success-message">{successMsg}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Nombre del Modelo</label>
                    <input type="text" value={name}
                        onChange={e => { setName(e.target.value); if (touched.name) setFieldErrors(p => ({ ...p, name: validateField('name', e.target.value) })); }}
                        onBlur={() => handleBlur('name')}
                        placeholder="Ej: Toyota Hilux 2024"
                        className={fieldErrors.name && touched.name ? "input-error" : ""} />
                    {fieldErrors.name && touched.name && <span className="error-message">{fieldErrors.name}</span>}
                </div>

                <div className="form-group">
                    <label>Categoría</label>
                    <select value={categoryId}
                        onChange={e => { setCategoryId(e.target.value); if (touched.categoryId) setFieldErrors(p => ({ ...p, categoryId: validateField('categoryId', e.target.value) })); }}
                        onBlur={() => handleBlur('categoryId')}
                        className={fieldErrors.categoryId && touched.categoryId ? "input-error" : ""}>
                        <option value="">-- Seleccioná una categoría --</option>
                        {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                    </select>
                    {fieldErrors.categoryId && touched.categoryId && <span className="error-message">{fieldErrors.categoryId}</span>}
                </div>

                <div className="form-group">
                    <label>Características</label>
                    <div className="features-checkbox-group">
                        {allFeatures.map(feature => (
                            <label key={feature.id} className="feature-checkbox">
                                <input type="checkbox"
                                    checked={selectedFeatures.includes(feature.id)}
                                    onChange={() => handleFeatureToggle(feature.id)} />
                                <i className={`fas ${feature.icon}`}></i>
                                {feature.name}
                            </label>
                        ))}
                        {allFeatures.length === 0 && <p className="warning-message">No hay características disponibles.</p>}
                    </div>
                </div>

                <div className="form-group">
                    <label>Descripción</label>
                    <textarea value={description}
                        onChange={e => { setDescription(e.target.value); if (touched.description) setFieldErrors(p => ({ ...p, description: validateField('description', e.target.value) })); }}
                        onBlur={() => handleBlur('description')}
                        placeholder="Detalles del vehículo (mínimo 10 caracteres)..."
                        className={fieldErrors.description && touched.description ? "input-error" : ""} />
                    {fieldErrors.description && touched.description && <span className="error-message">{fieldErrors.description}</span>}
                </div>

                <div className="form-group">
                    <label>Fotos del Vehículo</label>
                    <input type="file" multiple onChange={handleImageChangeWithValidation}
                        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif" />
                    <small>Formatos: JPG, PNG, WEBP, GIF. Máximo 5MB por imagen.</small>
                    {imageErrors.length > 0 && (
                        <div className="image-errors">
                            {imageErrors.map((err, idx) => <span key={idx} className="error-message">{err}</span>)}
                        </div>
                    )}
                    {images.length > 0 && !imageErrors.length && (
                        <p className="images-count">✅ {images.length} archivo(s) seleccionado(s)</p>
                    )}
                </div>

                <div className="form-buttons">
                    <button type="submit" className="btn-submit" disabled={isSubmitting}>
                        {isSubmitting ? "Publicando..." : "Publicar Vehículo"}
                    </button>
                    {!embedded && (
                        <button type="button" className="btn-cancel" onClick={() => navigate("/administracion")}>
                            Cancelar
                        </button>
                    )}
                </div>
            </form>
        </>
    );

    if (embedded) {
        return (
            <>
                <h2 className="admin-section-title">Agregar Producto</h2>
                <div style={{ padding: '24px' }}>{formContent}</div>
            </>
        );
    }

    return (
        <div className="main-with-padding">
            <div className="form-container">
                <h2>Registrar Nuevo Vehículo</h2>
                {formContent}
            </div>
        </div>
    );
}

export default AddProduct;