import axios from "axios";

// Configuración dinámica según entorno
const API_URL = import.meta.env.VITE_API_URL || "https://controldeinventarioexpressmongo-g412.onrender.com";

class UsuarioService {
    constructor() {
        // Configurar axios con interceptores (opcional)
        this.api = axios.create({
            baseURL: API_URL,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Interceptor para logging (útil para debugging)
        this.api.interceptors.request.use(config => {
            console.log(` ${config.method?.toUpperCase()} ${config.url}`);
            return config;
        });
    }

    // ============= MÉTODOS DE AUTENTICACIÓN =============
    
    /**
     * Iniciar sesión
     * @param {Object} credentials - { usuario, password }
     * @returns {Promise} - { success, message, user }
     */
    async login(credentials) {
        try {
            const response = await this.api.post('/login', credentials);
            
            // Tu backend devuelve: { success, message, user }
            if (response.data.success) {
                // Guardar en localStorage automáticamente
                localStorage.setItem('user', JSON.stringify(response.data.user));
                localStorage.setItem('isAuthenticated', 'true');
            }
            
            return response.data;
        } catch (error) {
            console.error(" Error en login:", error);
            
            // Manejar errores del backend
            if (error.response) {
                return error.response.data; // { success: false, message: "..." }
            }
            
            return {
                success: false,
                message: "Error de conexión con el servidor"
            };
        }
    }

    /**
     * Cerrar sesión
     */
    logout() {
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
    }

    /**
     * Verificar si el usuario está autenticado
     */
    isAuthenticated() {
        return localStorage.getItem('isAuthenticated') === 'true';
    }

    /**
     * Obtener usuario actual
     */
    getCurrentUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }

    // ============= CRUD DE USUARIOS =============

    /**
     * Obtener todos los usuarios
     * @returns {Array} - Lista de usuarios
     */
    async getUsuarios() {
        try {
            const response = await this.api.get('/usuariosdg');
            
            // Tu backend devuelve: { success: true, data: [...] }
            if (response.data.success) {
                return response.data.data;
            }
            throw new Error(response.data.message || "Error al obtener usuarios");
        } catch (error) {
            console.error("Error al obtener usuarios:", error);
            throw error;
        }
    }

    /**
     * Obtener usuario por nombre de usuario
     * @param {string} usuario 
     * @returns {Object} - Datos del usuario
     */
    async getUsuarioById(usuario) {
        try {
            const response = await this.api.get(`/usuariosdg/${usuario}`);
            
            if (response.data.success) {
                return response.data.data;
            }
            throw new Error(response.data.message || "Usuario no encontrado");
        } catch (error) {
            console.error("Error al obtener usuario:", error);
            throw error;
        }
    }

    /**
     * Crear nuevo usuario
     * @param {Object} usuario - { usuario, password, nombre, email }
     * @returns {Object} - Usuario creado
     */
    async createUsuario(usuario) {
        try {
            const response = await this.api.post('/usuariosdg', usuario);
            
            if (response.data.success) {
                return response.data.user;
            }
            throw new Error(response.data.message || "Error al crear usuario");
        } catch (error) {
            console.error(" Error al crear usuario:", error);
            
            // Manejo específico para duplicados
            if (error.response?.status === 409) {
                throw new Error("El nombre de usuario ya existe");
            }
            throw error;
        }
    }

    /**
     * Actualizar usuario existente
     * @param {string} usuario - Nombre de usuario a actualizar
     * @param {Object} data - Datos a actualizar (password, nombre, email)
     * @returns {Object} - Usuario actualizado
     */
    async updateUsuario(usuario, data) {
        try {
            const response = await this.api.put(`/usuariosdg/${usuario}`, data);
            
            if (response.data.success) {
                return response.data.user;
            }
            throw new Error(response.data.message || "Error al actualizar usuario");
        } catch (error) {
            console.error(" Error al actualizar usuario:", error);
            throw error;
        }
    }

    /**
     * Eliminar usuario
     * @param {string} usuario - Nombre de usuario a eliminar
     * @returns {boolean} - True si se eliminó correctamente
     */
    async deleteUsuario(usuario) {
        try {
            const response = await this.api.delete(`/usuariosdg/${usuario}`);
            
            if (response.data.success) {
                return true;
            }
            throw new Error(response.data.message || "Error al eliminar usuario");
        } catch (error) {
            console.error(" Error al eliminar usuario:", error);
            throw error;
        }
    }
}

// Exportar una única instancia (patrón Singleton)
export default new UsuarioService();