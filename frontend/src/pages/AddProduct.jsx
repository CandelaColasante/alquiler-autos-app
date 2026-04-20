import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProduct, getProducts } from "../services/api";

function AddProduct({ loadProducts }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const checkDuplicateName = async (name) => {
  try {
    const products = await getProducts();
    return products.some(p => p.name.toLowerCase() === name.toLowerCase());
  } catch (error) {
    console.error("Error al verificar nombre:", error);
    return false;
  }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  if (images.length === 0) {
    setError("Por favor, selecciona al menos una imagen.");
    return;
  }

  const nameExists = await checkDuplicateName(name);
    if (nameExists) {
      setError("Ya existe un producto con ese nombre. Por favor, usá otro nombre.");
      return;
    }


  const formData = new FormData();
  formData.append("name", name);
  formData.append("description", description);

  images.forEach((img) => {
    formData.append("images", img);
  });

  try {
    await createProduct(formData);
    await loadProducts();
    setName("");
    setDescription("");
    setImages([]);
    alert("Producto agregado correctamente!");
    navigate("/administracion");
  } catch (error) {
    setError("Error al guardar el producto");
  }
  };
  
  const handleImageChange = (e) => {
  setImages(Array.from(e.target.files));
  };

  return (
    <div className="main-with-padding">
      <div className="form-container">
        <h2>Agregar Producto</h2>

        {error && (
          <div className="form-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre</label>
            <input 
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Descripción</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Imágenes</label>
            <input 
              type="file" 
              multiple
              onChange={handleImageChange}
            />
            {images.length > 0 && (
              <p className="images-count">{images.length} seleccionada(s)</p>
            )}
          </div>

          <div className="form-buttons">
            <button type="submit" className="btn-submit">Guardar</button>
            <button type="button" className="btn-cancel" onClick={() => navigate("/administracion")}>
              Volver al Panel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProduct;