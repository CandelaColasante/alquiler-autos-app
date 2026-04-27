import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCategories, getProducts, updateProduct } from "../services/api";

const API_URL = 'http://localhost:8080';

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [allFeatures, setAllFeatures] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const cats = await getCategories();
        setCategories(cats);
        
        const featuresRes = await fetch(`${API_URL}/api/features`);
        const featuresData = await featuresRes.json();
        setAllFeatures(featuresData);
        
        const prods = await getProducts();
        const current = prods.find(p => p.id === parseInt(id));
        if (current) {
          setName(current.name);
          setDescription(current.description);
          setCategoryId(current.category?.id || "");
          if (current.features) {
            setSelectedFeatures(current.features.map(f => f.id));
          }
        }
      } catch (err) {
        console.error("Error al cargar datos:", err);
      }
    };
    loadData();
  }, [id]);

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

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("categoryId", categoryId);
    formData.append("featureIds", selectedFeatures.join(","));

    try {
      await updateProduct(id, formData);
      alert("¡Vehículo actualizado!");
      navigate("/administracion");
    } catch (err) {
      setError("Error al actualizar");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="main-with-padding">
      <div className="form-container">
        <h2>Editar Vehículo</h2>
        {error && <div className="form-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre</label>
            <input 
              type="text" 
              value={name} 
              onChange={handleNameChange}
              onBlur={() => handleBlur('name')}
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
              {categories.map(cat => (
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
              className={fieldErrors.description && touched.description ? "input-error" : ""}
            />
            {fieldErrors.description && touched.description && <span className="error-message">{fieldErrors.description}</span>}
          </div>
          
          <div className="form-buttons">
            <button type="submit" className="btn-submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Guardar Cambios"}
            </button>
            <button type="button" className="btn-cancel" onClick={() => navigate(-1)}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProduct;