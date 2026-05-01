import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.jpeg';
import Usuarios from '../components/Usuarios';
import './Dashboard.css';

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('Usuarios');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar autenticación
    const userData = localStorage.getItem('user');
    const isAuth = localStorage.getItem('isAuthenticated');
    
    if (!userData || !isAuth) {
      navigate('/login');
      return;
    }
    
    setUser(JSON.parse(userData));
  }, [navigate]);

  const menuItems = [
    { label: 'Usuarios', icon: 'pi-users' },
    { label: 'Productos', icon: 'pi-box' },
    { label: 'Proveedores', icon: 'pi-truck' },
    { label: 'Entradas', icon: 'pi-arrow-down-right' },
    { label: 'Salidas', icon: 'pi-arrow-up-right' },
    { label: 'Reportes', icon: 'pi-chart-bar' }
  ];

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  return (
    <div className="layout-wrapper">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>Panel de Control</h2>
          {user && <p style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: '#a1a5b7' }}>Bienvenido, {user.usuario}</p>}
        </div>
        <ul className="sidebar-menu">
          {menuItems.map(item => (
            <li 
              key={item.label} 
              className={activeSection === item.label ? 'active' : ''} 
              onClick={() => setActiveSection(item.label)}
            >
              <i className={`pi ${item.icon}`}></i> {item.label}
            </li>
          ))}
          <li className="logout" onClick={handleLogout}>
            <i className="pi pi-sign-out"></i> Cerrar Sesión
          </li>
        </ul>
      </aside>

      <main className="layout-main">
        <header className="main-header">
          <img src={logo} alt="Logo Empresa" className="company-logo" />
          <h1>{activeSection}</h1>
        </header>

        <div className="content-area">
          {activeSection === 'Usuarios' ? <Usuarios /> : (
            <div className="placeholder-content">
              <i className="pi pi-cog" style={{ fontSize: '3rem', color: '#9ca3af', marginBottom: '1rem' }}></i>
              <p>Módulo de <strong>{activeSection}</strong> en construcción.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;