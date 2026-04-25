import React, { useState } from 'react';
import logo from './logo.jpeg';
import './App.css';
import Usuarios from './Usuarios';

function App() {
  const [activeSection, setActiveSection] = useState('Usuarios');
  //Modelo de datos que se usarán en el sistema
  const menuItems = [
    { label: 'Usuarios', icon: 'pi-users' },
    { label: 'Productos', icon: 'pi-box' },
    { label: 'Proveedores', icon: 'pi-truck' },
    { label: 'Entradas', icon: 'pi-arrow-down-right' },
    { label: 'Salidas', icon: 'pi-arrow-up-right' },
    { label: 'Reportes', icon: 'pi-chart-bar' }
  ];

  return (
    <div className="layout-wrapper">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>Panel de Control</h2>
        </div>
        <ul className="sidebar-menu">
          {menuItems.map(item => (
            <li key={item.label} className={activeSection === item.label ? 'active' : ''} onClick={() => setActiveSection(item.label)}>
              <i className={`pi ${item.icon}`}></i> {item.label}
            </li>
          ))}
          <li className="logout" onClick={() => alert('Cerrando sesión...')}>
            <i className="pi pi-sign-out"></i> Cerrar Sesión
          </li>
        </ul>
      </aside>

      {/* Main Content Area */}
      <main className="layout-main">
        <header className="main-header">
          <img src={logo} alt="Logo Empresa" className="company-logo" />
          <h1>{activeSection}</h1>
        </header>

        <div className="content-area">
          {activeSection === 'Usuarios' ? <Usuarios /> : (
            <div className="placeholder-content">
              <i className="pi pi-cog" style={{ fontSize: '3rem', color: '#9ca3af', marginBottom: '1rem' }}></i>
              <p>Módulo de <strong>{activeSection}</strong> en construcción.</p> {/*indica el nombre de la seccion que se está visualizando */}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
