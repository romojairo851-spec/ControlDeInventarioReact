import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.jpeg';
import './Login.css';
import usuarioService from '../services/usuarioService';

const Login = () => {
  const [formData, setFormData] = useState({
    usuario: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Verificar si ya hay sesión activa
  React.useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await usuarioService.login(formData);
      if (response.success) {
        // Guardar usuario en localStorage
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('isAuthenticated', 'true');
        navigate('/dashboard');
      } else {
        setError(response.message || 'Credenciales incorrectas');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="dog-animation-container">
        <div className="running-dog">
          <div className="tail"></div>
          <div className="body"></div>
          <div className="head">
            <div className="ear"></div>
          </div>
          <div className="leg back-leg-1"></div>
          <div className="leg back-leg-2"></div>
          <div className="leg front-leg-1"></div>
          <div className="leg front-leg-2"></div>
        </div>
      </div>

      <div className="particles">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${(i * 10) + 5}%`,
              animationDelay: `${i * 0.8}s`
            }}
          />
        ))}
      </div>

      <div className="login-container">
        <img src={logo} alt="Logo del sistema" className="login-logo" />
        <h1>Inicio de Sesión</h1>

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="usuario">Usuario</label>
            <input
              type="text"
              id="usuario"
              name="usuario"
              placeholder="usuario"
              value={formData.usuario}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="contraseña"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Validando...' : 'Ingresar'}
          </button>

          {error && (
            <p className="server-message error">
              {error}
            </p>
          )}

          <div className="login-footer">
            <p>© <span>Sistema de Inventario</span> — versión 1.0</p>
            <p><span>Prueba admin / admin123</span></p>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;