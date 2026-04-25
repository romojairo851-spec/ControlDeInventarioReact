import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import 'primeicons/primeicons.css'; //importa los iconos de primefaces
import UsuarioService from "./services/usuarioService"; //importa el servicio de usuarios

//componente que muestra la tabla de usuarios y permite crear, editar y eliminar usuarios
function Usuarios() {
  const [users, setUsers] = useState([]);
  const [userDialog, setUserDialog] = useState(false); //Indica si el dialogo de creacion y edicion esta visible
  const [deleteUserDialog, setDeleteUserDialog] = useState(false); //Indica si el dialogo de eliminacion esta visible
  const [user, setUser] = useState({ id: '', nombre: '', email: '', password: '' }); //Modelo de datos que se usarán en el sistema
  const [submitted, setSubmitted] = useState(false); //Indica si el formulario se ha enviado
  const [isEdit, setIsEdit] = useState(false); //Indica si se esta editando un usuario
  const toast = useRef(null); //Referencia al toast para mostrar mensajes
  //se ejecuta al cargar el componente
  useEffect(() => {
    loadUsuarios();
  }, []);

  //Carga la lista de usuarios desde el servicio
  const loadUsuarios = () => {
    UsuarioService.getUsuarios().then(res => {
      setUsers(res); // usuarioService ya devuelve res.data
    }).catch(err => {
      console.error(err);
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los usuarios', life: 3000 });
    });
  };

  //Abre el dialogo de creacion de usuarios
  const openNew = () => {
    setUser({ id: '', nombre: '', email: '', password: '' });
    setSubmitted(false);
    setIsEdit(false);
    setUserDialog(true);
  };

  //Cierra el dialogo de creacion de usuarios
  const hideDialog = () => {
    setSubmitted(false);
    setUserDialog(false);
  };

  //Cierra el dialogo de eliminacion de usuarios
  const hideDeleteUserDialog = () => {
    setDeleteUserDialog(false);
  };

  //Guarda el usuario (creacion o edicion)
  const saveUser = () => {
    setSubmitted(true);
    if (user.nombre.trim() && user.email.trim() && user.password.trim()) {
      if (isEdit) {
        //Edita el usuario
        UsuarioService.updateUsuario(user.id, user).then(res => {
          toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Usuario Actualizado', life: 3000 });
          loadUsuarios();
          setUserDialog(false);
          setUser({ id: '', nombre: '', email: '', password: '' });
        }).catch(err => {
          toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudo actualizar', life: 3000 });
        });
      } else {
        //crea el usuario
        const { id, ...newUser } = user;
        UsuarioService.createUsuario(newUser).then(res => {
          toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Usuario Creado', life: 3000 });
          loadUsuarios();
          setUserDialog(false);
          setUser({ id: '', nombre: '', email: '', password: '' });
        }).catch(err => {
          toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudo crear', life: 3000 });
        });
      }
    }
  };
  //Abre el dialogo de edicion de usuarios
  const editUser = (userToEdit) => {
    setUser({ ...userToEdit });
    setIsEdit(true);
    setUserDialog(true);
  };

  //Confirma la eliminacion del usuario
  const confirmDeleteUser = (userToDelete) => {
    setUser(userToDelete);
    setDeleteUserDialog(true);
  };

  //Elimina el usuario  
  const deleteUser = () => {
    UsuarioService.deleteUsuario(user.id).then(res => {
      toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Usuario Eliminado', life: 3000 });
      loadUsuarios();
      setDeleteUserDialog(false);
      setUser({ id: '', nombre: '', email: '', password: '' });
    }).catch(err => {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar', life: 3000 });
    });
  };

  //Maneja el cambio en los campos de texto
  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _user = { ...user };
    _user[`${name}`] = val;
    setUser(_user);
  };

  //Barra de herramientas para crear nuevos usuarios
  const leftToolbarTemplate = () => {
    return (
      <React.Fragment>
        <Button label="Nuevo Usuario" icon="pi pi-plus" severity="success" onClick={openNew} />
      </React.Fragment>
    );
  };

  //Barra de herramientas para editar y eliminar usuarios
  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editUser(rowData)} style={{ marginRight: '0.5rem' }} />
        <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteUser(rowData)} />
      </React.Fragment>
    );
  };

  //Footer del dialogo de creacion de usuarios
  const userDialogFooter = (
    <React.Fragment>
      <Button label="Cancelar" icon="pi pi-times" outlined onClick={hideDialog} />
      <Button label="Guardar" icon="pi pi-check" onClick={saveUser} />
    </React.Fragment>
  );

  //Footer del dialogo de eliminacion de usuarios
  const deleteUserDialogFooter = (
    <React.Fragment>
      <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteUserDialog} />
      <Button label="Sí" icon="pi pi-check" severity="danger" onClick={deleteUser} />
    </React.Fragment>
  );

  //Template para ocultar la contraseña
  const passwordBodyTemplate = (rowData) => {
    return rowData.password ? rowData.password.replace(/./g, '*') : '';
  };

  //Renderizado del componente  
  return (
    <div className="card">
      <Toast ref={toast} />
      <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>
      <DataTable value={users} dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} emptyMessage="No hay usuarios registrados.">
        <Column field="id" header="ID" sortable style={{ minWidth: '12rem' }}></Column>
        <Column field="nombre" header="Nombre" sortable style={{ minWidth: '16rem' }}></Column>
        <Column field="email" header="Email" sortable style={{ minWidth: '16rem' }}></Column>
        <Column field="password" header="Password" body={passwordBodyTemplate} style={{ minWidth: '12rem' }}></Column>
        <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
      </DataTable>

      { /*Dialogo para crear y editar usuarios */}
      <Dialog visible={userDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={isEdit ? "Editar Usuario" : "Crear Usuario"} modal className="p-fluid" footer={userDialogFooter} onHide={hideDialog}>
        {isEdit && (
          <div className="field" style={{ marginBottom: '1rem' }}>
            <label htmlFor="id" style={{ display: 'block', marginBottom: '0.5rem' }}>ID</label>
            <InputText id="id" value={user.id} disabled />
          </div>
        )}
        {/*Campo nombre del usuario */}
        <div className="field" style={{ marginBottom: '1rem' }}>
          <label htmlFor="nombre" style={{ display: 'block', marginBottom: '0.5rem' }}>Nombre</label>
          <InputText id="nombre" value={user.nombre} onChange={(e) => onInputChange(e, 'nombre')} required className={submitted && !user.nombre ? 'p-invalid' : ''} />
          {submitted && !user.nombre && <small className="p-error">El nombre es requerido.</small>}
        </div>

        {/*Campo email del usuario */}
        <div className="field" style={{ marginBottom: '1rem' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem' }}>Email</label>
          <InputText id="email" value={user.email} onChange={(e) => onInputChange(e, 'email')} required className={submitted && !user.email ? 'p-invalid' : ''} />
          {submitted && !user.email && <small className="p-error">El email es requerido.</small>}
        </div>

        {/*Campo contraseña del usuario */}
        <div className="field" style={{ marginBottom: '1rem' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem' }}>Password</label>
          <InputText id="password" type="password" value={user.password} onChange={(e) => onInputChange(e, 'password')} required className={submitted && !user.password ? 'p-invalid' : ''} />
          {submitted && !user.password && <small className="p-error">El password es requerido.</small>}
        </div>
      </Dialog>

      {/*Dialogo para eliminar usuarios */}
      <Dialog visible={deleteUserDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirmar" modal footer={deleteUserDialogFooter} onHide={hideDeleteUserDialog}>
        <div className="confirmation-content" style={{ display: 'flex', alignItems: 'center' }}>
          <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem', marginRight: '1rem', color: 'var(--orange-500)' }} />
          {user && <span>¿Estás seguro de que deseas eliminar a <b>{user.nombre}</b>?</span>}
        </div>
      </Dialog>
    </div>
  );
}

export default Usuarios;