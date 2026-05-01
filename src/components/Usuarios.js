import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import usuarioService from '../services/usuarioService';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const toast = React.useRef(null);
  
  const [formData, setFormData] = useState({
    usuario: '',
    password: '',
    nombre: '',
    email: ''
  });

  // Obtener token/usuario del localStorage
  const getCurrentUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  };

const loadUsuarios = async () => {
  setLoading(true);
  try {
    const usuarios = await usuarioService.getUsuarios();
    setUsuarios(usuarios);
  } catch (error) {
    toast.current.show({ 
      severity: 'error', 
      summary: 'Error', 
      detail: error.message, 
      life: 3000 
    });
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    loadUsuarios();
  }, []);

  const openNewUser = () => {
    setFormData({
      usuario: '',
      password: '',
      nombre: '',
      email: ''
    });
    setIsEditing(false);
    setSelectedUser(null);
    setDialogVisible(true);
  };

  const editUser = (user) => {
    setFormData({
      usuario: user.usuario,
      password: '',
      nombre: user.nombre || '',
      email: user.email || ''
    });
    setIsEditing(true);
    setSelectedUser(user);
    setDialogVisible(true);
  };

  const deleteUser = async (user) => {
    try {
      await usuarioService.deleteUsuario(user.usuario);
      toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Usuario eliminado correctamente', life: 3000 });
      loadUsuarios();
    } catch (error) {
      console.error('Error:', error);
      toast.current.show({ severity: 'error', summary: 'Error', detail: error.message || 'No se pudo eliminar el usuario', life: 3000 });
    }
  };

  const confirmDeleteUser = (user) => {
    confirmDialog({
      message: `¿Estás seguro de eliminar al usuario "${user.usuario}"?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => deleteUser(user)
    });
  };

  const saveUser = async () => {
    if (!formData.usuario || (!isEditing && !formData.password)) {
      toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'Usuario y contraseña son requeridos', life: 3000 });
      return;
    }

    try {
      if (isEditing) {
        // Actualizar usuario
        const updateData = {};
        if (formData.password) updateData.password = formData.password;
        if (formData.nombre) updateData.nombre = formData.nombre;
        if (formData.email) updateData.email = formData.email;
        
        await usuarioService.updateUsuario(selectedUser.usuario, updateData);
      } else {
        // Crear usuario
        await usuarioService.createUsuario(formData);
      }

      toast.current.show({ 
        severity: 'success', 
        summary: 'Éxito', 
        detail: isEditing ? 'Usuario actualizado correctamente' : 'Usuario creado correctamente', 
        life: 3000 
      });
      setDialogVisible(false);
      loadUsuarios();
    } catch (error) {
      console.error('Error:', error);
      toast.current.show({ severity: 'error', summary: 'Error', detail: error.message || 'No se pudo guardar el usuario', life: 3000 });
    }
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <Button icon="pi pi-pencil" className="p-button-rounded p-button-info" onClick={() => editUser(rowData)} />
        <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => confirmDeleteUser(rowData)} />
      </div>
    );
  };

  return (
    <div className="card">
      <Toast ref={toast} />
      <ConfirmDialog />
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h2>Gestión de Usuarios</h2>
        <Button label="Nuevo Usuario" icon="pi pi-plus" onClick={openNewUser} />
      </div>

      <DataTable value={usuarios} loading={loading} responsiveLayout="scroll">
        <Column field="usuario" header="Usuario" sortable></Column>
        <Column field="nombre" header="Nombre" sortable></Column>
        <Column field="email" header="Email" sortable></Column>
        <Column body={actionBodyTemplate} header="Acciones" style={{ width: '120px' }}></Column>
      </DataTable>

      {/* Diálogo para crear/editar usuario */}
      <Dialog 
        header={isEditing ? "Editar Usuario" : "Nuevo Usuario"} 
        visible={dialogVisible} 
        style={{ width: '450px' }} 
        onHide={() => setDialogVisible(false)}
      >
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="usuario">Usuario *</label>
            <InputText 
              id="usuario" 
              value={formData.usuario} 
              onChange={(e) => setFormData({...formData, usuario: e.target.value})}
              disabled={isEditing}
              required
            />
          </div>
          
          <div className="p-field">
            <label htmlFor="password">{isEditing ? "Nueva Contraseña (opcional)" : "Contraseña *"}</label>
            <InputText 
              id="password" 
              type="password" 
              value={formData.password} 
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required={!isEditing}
            />
          </div>
          
          <div className="p-field">
            <label htmlFor="nombre">Nombre</label>
            <InputText 
              id="nombre" 
              value={formData.nombre} 
              onChange={(e) => setFormData({...formData, nombre: e.target.value})}
            />
          </div>
          
          <div className="p-field">
            <label htmlFor="email">Email</label>
            <InputText 
              id="email" 
              type="email" 
              value={formData.email} 
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-secondary" onClick={() => setDialogVisible(false)} />
            <Button label="Guardar" icon="pi pi-save" onClick={saveUser} />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default Usuarios;