import axios from "axios";

// URL backend 
const API_URL = "http://localhost:8081/usuarios";

class UsuarioService {

    // Obtener todos
    async getUsuarios() {
        try {
            const res = await axios.get(API_URL);
            return res.data;
        } catch (error) {
            console.error("Error al obtener usuarios:", error);
            throw error;
        }
    }

    //  Obtener por ID
    async getUsuarioById(id) {
        try {
            const res = await axios.get(`${API_URL}/${id}`);
            return res.data;
        } catch (error) {
            console.error("Error al obtener usuario:", error);
            throw error;
        }
    }

    //  Crear
    async createUsuario(usuario) {
        try {
            const res = await axios.post(API_URL, usuario);
            return res.data;
        } catch (error) {
            console.error("Error al crear usuario:", error);
            throw error;
        }
    }

    //  Actualizar 
    async updateUsuario(id, usuario) {
        try {
            const res = await axios.put(`${API_URL}/${id}`, usuario);
            return res.data;
        } catch (error) {
            console.error("Error al actualizar usuario:", error);
            throw error;
        }
    }

    //  Eliminar
    async deleteUsuario(id) {
        try {
            const res = await axios.delete(`${API_URL}/${id}`);
            return res.data;
        } catch (error) {
            console.error("Error al eliminar usuario:", error);
            throw error;
        }
    }
}

export default new UsuarioService();