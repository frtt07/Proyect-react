import axios from "axios";
import { User } from "../models/User";
import { store } from "../store/store";
import { setUser } from "../store/userSlice";

class SecurityService extends EventTarget {
    keySession: string;
    API_URL: string;
    
    constructor() {
        super();
        this.keySession = 'session';
        this.API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
    }

    async login(user: User) {
        const loginUrl = `${this.API_URL}/login`;
        console.log("🔐 Intentando login en:", loginUrl);
        
        try {
            const response = await axios.post(loginUrl, user, {
                headers: {
                    'Content-Type': 'application/json',
                },
                timeout: 10000,
            });

            const data = response.data;
            console.log("✅ Respuesta del servidor:", data);
            
            if (!data) {
                throw new Error("No se recibió respuesta del servidor");
            }

            // Guardar usuario en localStorage y Redux
            const userData = data.user || data;
            localStorage.setItem("user", JSON.stringify(userData));
            store.dispatch(setUser(userData));
            
            // Guardar token si existe
            if (data.token) {
                localStorage.setItem(this.keySession, data.token);
                console.log("🔑 Token guardado");
            }
            
            // Disparar evento para notificar cambios
            this.dispatchEvent(new CustomEvent("userChange", { detail: userData }));
            
            console.log("🎉 Login completado exitosamente");
            return data;
            
        } catch (error: any) {
            console.error('❌ Error durante el login:', error);
            
            let errorMessage = "Error de conexión";
            
            if (error.code === 'ECONNABORTED') {
                errorMessage = "Timeout: El servidor no respondió a tiempo";
            } else if (error.response) {
                const status = error.response.status;
                const message = error.response.data?.message;
                
                if (status === 401) {
                    errorMessage = "Credenciales incorrectas";
                } else if (status === 404) {
                    errorMessage = "Usuario no encontrado";
                } else if (status === 500) {
                    errorMessage = "Error interno del servidor";
                } else {
                    errorMessage = message || `Error ${status}`;
                }
            } else if (error.request) {
                errorMessage = "No se pudo conectar al servidor. Verifica tu conexión.";
            } else {
                errorMessage = error.message || "Error inesperado";
            }
            
            throw new Error(errorMessage);
        }
    }
    
    getUser() {
        const userStr = localStorage.getItem("user");
        return userStr ? JSON.parse(userStr) : null;
    }
    
    logout() {
        localStorage.removeItem("user");
        localStorage.removeItem(this.keySession);
        store.dispatch(setUser(null));
        this.dispatchEvent(new CustomEvent("userChange", { detail: null }));
        console.log("👋 Logout completado");
    }

    isAuthenticated() {
        const hasUser = !!localStorage.getItem("user");
        const hasToken = !!localStorage.getItem(this.keySession);
        console.log(`🔍 Autenticación: User=${hasUser}, Token=${hasToken}`);
        return hasUser || hasToken;
    }

    getToken() {
        return localStorage.getItem(this.keySession);
    }
}

export default new SecurityService();