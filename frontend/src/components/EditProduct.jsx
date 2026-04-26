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

  const handleSubmit = async (e) => {
    e.preventDefault();
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
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Categoría</label>
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
              <option value="">-- Seleccione una categoría --</option>
              {categories.map(cat => (
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
                </p>
              )}
            </div>
          </div>
          <div className="form-group">
            <label>Descripción</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
          </div>
          <div className="form-buttons">
            <button type="submit" className="btn-submit">Guardar Cambios</button>
            <button type="button" className="btn-cancel" onClick={() => navigate(-1)}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProduct;