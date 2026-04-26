import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({ setUser }) {  // ← RECIBIR setUser POR PROPS
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "El email es obligatorio";
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es obligatoria";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const API_URL = 'http://localhost:8080';
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email.trim().toLowerCase(),
          password: formData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error) {
          throw new Error(data.error);
        }
        if (data.email || data.password) {
          setErrors(data);
          return;
        }
        throw new Error("Error al iniciar sesión");
      }

      // Guardar usuario en localStorage
      localStorage.setItem("user", JSON.stringify(data));
      
      // ACTUALIZAR ESTADO EN APP
      setUser(data);
      
      alert(`¡Bienvenido ${data.firstName}!`);
      navigate("/");
      
    } catch (error) {
      console.error("Error:", error);
      setServerError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-with-padding">
      <div className="form-container">
        <h2>Iniciar sesión</h2>
        <p className="form-subtitle">Ingresa tus credenciales para continuar</p>

        {serverError && (
          <div className="form-error">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Correo electrónico *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="ejemplo@correo.com"
              className={errors.email ? "input-error" : ""}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label>Contraseña *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Tu contraseña"
              className={errors.password ? "input-error" : ""}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <div className="form-buttons">
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? "Ingresando..." : "Iniciar sesión"}
            </button>
          </div>
        </form>

        <div className="form-footer">
          <p>
            ¿No tienes cuenta? <a href="/registro">Regístrate aquí</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;