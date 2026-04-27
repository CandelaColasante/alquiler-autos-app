import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createProduct, getProducts, getCategories } from "../services/api";

const API_URL = 'http://localhost:8080';

function AddProduct({ loadProducts }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const [allFeatures, setAllFeatures] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const navigate = useNavigate();
  
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [imageErrors, setImageErrors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    } catch (error) {
      console.error("Error al verificar nombre:", error);
      return false;
    }
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleFeatureToggle = (featureId) => {
    setSelectedFeatures(prev =>
      prev.includes(featureId)
        ? prev.filter(id => id !== featureId)
        : [...prev, featureId]
    );
  };

  const validateField = (field, value) => {
    switch (field) {
      case 'name':
        if (!value.trim()) return "El nombre del vehículo es obligatorio";
        if (value.length < 2) return "El nombre debe tener al menos 2 caracteres";
        if (value.length > 100) return "El nombre no puede superar los 100 caracteres";
        return "";
      case 'description':
        if (!value.trim()) return "La descripción es obligatoria";
        if (value.length < 10) return "La descripción debe tener al menos 10 caracteres";
        if (value.length > 1000) return "La descripción no puede superar los 1000 caracteres";
        return "";
      case 'categoryId':
        if (!value) return "Debes seleccionar una categoría";
        return "";
      default:
        return "";
    }
  };

  const validateImages = (files) => {
    const MAX_SIZE = 5 * 1024 * 1024;
    const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    const errorsList = [];
    
    if (files.length === 0) {
      errorsList.push("Debes seleccionar al menos una imagen");
      return errorsList;
    }
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!ALLOWED_TYPES.includes(file.type)) {
        errorsList.push(`"${file.name}" no es un formato válido. Usa JPG, PNG, WEBP o GIF.`);
      }
      if (file.size > MAX_SIZE) {
        errorsList.push(`"${file.name}" supera el tamaño máximo de 5MB.`);
      }
    }
    return errorsList;
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    if (touched.name) {
      const error = validateField('name', value);
      setFieldErrors(prev => ({ ...prev, name: error }));
    }
  };

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    setDescription(value);
    if (touched.description) {
      const error = validateField('description', value);
      setFieldErrors(prev => ({ ...prev, description: error }));
    }
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setCategoryId(value);
    if (touched.categoryId) {
      const error = validateField('categoryId', value);
      setFieldErrors(prev => ({ ...prev, categoryId: error }));
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    let value;
    if (field === 'name') value = name;
    else if (field === 'description') value = description;
    else value = categoryId;
    const error = validateField(field, value);
    setFieldErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleImageChangeWithValidation = (e) => {
    const files = Array.from(e.target.files);
    const validationErrors = validateImages(files);
    
    if (validationErrors.length > 0) {
      setImageErrors(validationErrors);
      setImages([]);
    } else {
      setImageErrors([]);
      setImages(files);
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    
    setTouched({ name: true, description: true, categoryId: true });
    
    const nameError = validateField('name', name);
    const descriptionError = validateField('description', description);
    const categoryError = validateField('categoryId', categoryId);
    
    if (nameError || descriptionError || categoryError) {
      setFieldErrors({
        name: nameError,
        description: descriptionError,
        categoryId: categoryError
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    if (images.length === 0 && imageErrors.length === 0) {
      setImageErrors(["Debes seleccionar al menos una imagen"]);
      return;
    }
    
    if (imageErrors.length > 0) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const isDuplicate = await checkDuplicateName(name);
    if (isDuplicate) {
      setFieldErrors(prev => ({ ...prev, name: "Ya existe un vehículo con ese nombre. Por favor, elige otro." }));
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("categoryId", categoryId);
    formData.append("featureIds", selectedFeatures.join(","));
    
    images.forEach((img) => {
      formData.append("images", img);
    });

    try {
      await createProduct(formData);
      if (loadProducts) await loadProducts(); 
      alert("¡Vehículo registrado con éxito!");
      navigate("/administracion");
    } catch (error) {
      console.error(error);
      setError("Error al conectar con el servidor. Inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="main-with-padding">
      <div className="form-container">
        <h2>Registrar Nuevo Vehículo</h2>

        {error && <div className="form-error" style={{color: 'red', marginBottom: '10px'}}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre del Modelo</label>
            <input 
              type="text" 
              value={name} 
              onChange={handleNameChange}
              onBlur={() => handleBlur('name')}
              placeholder="Ej: Toyota Hilux 2024"
              className={fieldErrors.name && touched.name ? "input-error" : ""}
            />
            {fieldErrors.name && touched.name && <span className="error-message">{fieldErrors.name}</span>}
          </div>

          <div className="form-group">
            <label>Categoría</label>
            <select 
              value={categoryId} 
              onChange={handleCategoryChange}
              onBlur={() => handleBlur('categoryId')}
              className={fieldErrors.categoryId && touched.categoryId ? "input-error" : ""}
            >
              <option value="">-- Seleccione una categoría --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            {fieldErrors.categoryId && touched.categoryId && <span className="error-message">{fieldErrors.categoryId}</span>}
          </div>

          <div className="form-group">
            <label>Características</label>
            <div className="features-checkbox-group">
              {allFeatures.map(feature => (
                <label key={feature.id} className="feature-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedFeatures.includes(feature.id)}
                    onChange={() => handleFeatureToggle(feature.id)}
                  />
                  <i className={`fas ${feature.icon}`}></i>
                  {feature.name}
                </label>
              ))}
              {allFeatures.length === 0 && (
                <p className="warning-message">
                  No hay características disponibles. 
                  <button type="button" onClick={() => navigate("/admin/caracteristicas")}>
                    Adminístralas aquí
                  </button>
                </p>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Descripción</label>
            <textarea 
              value={description} 
              onChange={handleDescriptionChange}
              onBlur={() => handleBlur('description')}
              placeholder="Detalles del vehículo (mínimo 10 caracteres)..."
              className={fieldErrors.description && touched.description ? "input-error" : ""}
            />
            {fieldErrors.description && touched.description && <span className="error-message">{fieldErrors.description}</span>}
          </div>

          <div className="form-group">
            <label>Fotos del Vehículo</label>
            <input 
              type="file" 
              multiple 
              onChange={handleImageChangeWithValidation} 
              accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
            />
            <small>Formatos permitidos: JPG, PNG, WEBP, GIF. Tamaño máximo: 5MB por imagen</small>

            {imageErrors.length > 0 && (
              <div className="image-errors">
                {imageErrors.map((err, idx) => (
                  <span key={idx} className="error-message">{err}</span>
                ))}
              </div>
            )}

            {images.length > 0 && !imageErrors.length && (
              <p className="images-count">
                ✅ {images.length} archivo(s) seleccionado(s) correctamente
              </p>
            )}
          </div>

          <div className="form-buttons">
            <button type="submit" className="btn-submit" disabled={isSubmitting}>
              {isSubmitting ? "Publicando..." : "Publicar Vehículo"}
            </button>
            <button 
              type="button" 
              className="btn-cancel" 
              onClick={() => navigate("/administracion")}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProduct;