import axios from "axios";

// Lista de rutas que no deben ser interceptadas
const EXCLUDED_ROUTES = ["/login", "/register"];

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

const api = axios.create({
  baseURL: API_BASE_URL, // Ya incluye /api
  headers: { "Content-Type": "application/json" },
});

// Interceptor de solicitud
api.interceptors.request.use(
  (request) => {
    console.log(`🚀 ${request.method?.toUpperCase()} ${request.url}`, request.data);
    
    // Verificar si la URL está en la lista de excluidas
    if (EXCLUDED_ROUTES.some((route) => request.url?.includes(route))) {
      return request;
    }
    
    const token = localStorage.getItem("session");
    // Agregar token si la ruta no está excluida
    if (token) {
      request.headers.Authorization = `Bearer ${token}`;
    }
    return request;
  },
  (error) => {
    console.error("❌ Error en interceptor de solicitud:", error);
    return Promise.reject(error);
  }
);

// Interceptor de respuesta
api.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.status} ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    console.error(`❌ ${error.response?.status} ${error.config?.url}:`, error.response?.data);
    
    if (error.response?.status === 401) {
      console.log("No autorizado, redirigiendo a login...");
      localStorage.removeItem("user");
      localStorage.removeItem("session");
      window.location.href = "/auth/signin";
    }
    return Promise.reject(error);
  }
);

export default api;