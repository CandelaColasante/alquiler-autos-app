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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!categoryId) {
      setError("Por favor, selecciona una categoría.");
      return;
    }
    if (images.length === 0) {
      setError("Por favor, selecciona al menos una imagen.");
      return;
    }

    const isDuplicate = await checkDuplicateName(name);
    if (isDuplicate) {
      setError("Ya existe un vehículo con ese nombre. Por favor, elige otro.");
      return;
    }

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
              onChange={(e) => setName(e.target.value)} 
              placeholder="Ej: Toyota Hilux 2024"
              required 
            />
          </div>

          <div className="form-group">
            <label>Categoría</label>
            <select 
              value={categoryId} 
              onChange={(e) => setCategoryId(e.target.value)} 
              required
            >
              <option value="">-- Seleccione una categoría --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
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
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Detalles del vehículo..."
              required 
            />
          </div>

          <div className="form-group">
            <label>Fotos del Vehículo</label>
            <input 
              type="file" 
              multiple 
              onChange={handleImageChange} 
              accept="image/*"
              required
            />
            {images.length > 0 && (
              <p className="images-count" style={{fontSize: '0.8rem', marginTop: '5px'}}>
                {images.length} archivo(s) seleccionado(s)
              </p>
            )}
          </div>

          <div className="form-buttons">
            <button type="submit" className="btn-submit">Publicar Vehículo</button>
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