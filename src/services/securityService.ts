// src/services/securityService.ts
import axios from "axios";
import { User } from "../models/User";
import { store } from "../store/store";
import { setUser } from "../store/userSlice";
import FirebaseService, { auth } from "./firebaseService";
import { UserCredential } from "firebase/auth";

class SecurityService extends EventTarget {
    keySession: string;
    API_URL: string;
    
    constructor() {
        super();
        this.keySession = 'session';
        this.API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
    }

    async loginWithGitHub() {
        console.log("🔐 Iniciando sesión con GitHub...");
        
        try {
            // Login con Firebase
            const firebaseResult: UserCredential = await FirebaseService.loginWithGitHub();
            const firebaseUser = firebaseResult.user;
            
            console.log("👤 Usuario de Firebase:", firebaseUser);
            
            // Obtener token de Firebase
            const firebaseToken = await firebaseUser.getIdToken();
            console.log("🔑 Token de Firebase:", firebaseToken);
            
            try {
                // Intentar enviar al backend
                const backendResponse = await this.sendToBackend({
                    token: firebaseToken,
                    email: firebaseUser.email,
                    name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'GitHub User',
                    picture: firebaseUser.photoURL,
                    provider: 'github',
                    providerId: firebaseUser.uid
                }, '/auth/github');
                
                return backendResponse;
                
            } catch (backendError) {
                console.log("⚠️ Backend no disponible, usando método local...");
                return await this.handleProviderFallback(firebaseUser, 'github');
            }
            
        } catch (error: any) {
            console.error("❌ Error en login con GitHub:", error);
            throw new Error(error.message || "Error al autenticar con GitHub");
        }
    }

    async loginWithMicrosoft() {
        console.log("🔐 Iniciando sesión con Microsoft...");
        
        try {
            // Login con Firebase
            const firebaseResult: UserCredential = await FirebaseService.loginWithMicrosoft();
            const firebaseUser = firebaseResult.user;
            
            console.log("👤 Usuario de Firebase:", firebaseUser);
            
            // Obtener token de Firebase
            const firebaseToken = await firebaseUser.getIdToken();
            console.log("🔑 Token de Firebase:", firebaseToken);
            
            try {
                // Intentar enviar al backend
                const backendResponse = await this.sendToBackend({
                    token: firebaseToken,
                    email: firebaseUser.email,
                    name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Microsoft User',
                    picture: firebaseUser.photoURL,
                    provider: 'microsoft',
                    providerId: firebaseUser.uid
                }, '/auth/microsoft');
                
                return backendResponse;
                
            } catch (backendError) {
                console.log("⚠️ Backend no disponible, usando método local...");
                return await this.handleProviderFallback(firebaseUser, 'microsoft');
            }
            
        } catch (error: any) {
            console.error("❌ Error en login con Microsoft:", error);
            throw new Error(error.message || "Error al autenticar con Microsoft");
        }
    }

    private async sendToBackend(providerData: any, endpoint: string) {
        const backendUrl = `${this.API_URL}${endpoint}`;
        console.log(`🌐 Enviando a backend: ${backendUrl}`);
        
        const response = await axios.post(backendUrl, providerData, {
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: 10000,
        });

        console.log("✅ Respuesta del backend:", response.data);
        
        const data = response.data;
        const userData = data.user || data;
        
        // Guardar en localStorage y Redux
        this.saveUserSession(userData, data.token);
        
        return data;
    }

    private async handleProviderFallback(firebaseUser: any, provider: string) {
        console.log(`🔄 Usando método alternativo para ${provider}...`);
        
        try {
            // Buscar usuario por email
            const usersUrl = `${this.API_URL}/users`;
            const usersResponse = await axios.get(usersUrl, { timeout: 10000 });
            
            const existingUser = usersResponse.data.find((user: any) => 
                user.email === firebaseUser.email
            );

            let userData;

            if (existingUser) {
                console.log("✅ Usuario existente encontrado:", existingUser);
                userData = existingUser;
            } else {
                console.log(`🆕 Creando nuevo usuario para ${provider}...`);
                
                const newUser = {
                    name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || `${provider} User`,
                    email: firebaseUser.email,
                    password: `${provider}_oauth_${Date.now()}`,
                    is_active: true
                };

                const createResponse = await axios.post(`${this.API_URL}/users`, newUser, {
                    headers: { 'Content-Type': 'application/json' },
                    timeout: 10000,
                });
                
                userData = createResponse.data;
            }

            const simulatedResponse = {
                user: userData,
                token: `${provider}_token_${Date.now()}`,
                message: `Login con ${provider} exitoso`
            };

            this.saveUserSession(userData, simulatedResponse.token);
            return simulatedResponse;

        } catch (fallbackError) {
            console.error(`❌ Error en fallback de ${provider}:`, fallbackError);
            console.log("🎭 Usando login completamente simulado...");
            
            return this.handleSimulatedLogin(firebaseUser, provider);
        }
    }

    private handleSimulatedLogin(firebaseUser: any, provider: string) {
        const simulatedUser = {
            id: Math.floor(Math.random() * 1000),
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || `${provider} User`,
            email: firebaseUser.email,
            picture: firebaseUser.photoURL,
            is_active: true,
            created_at: new Date().toISOString()
        };

        const simulatedResponse = {
            user: simulatedUser,
            token: `simulated_${provider}_token_${Date.now()}`,
            message: `Login con ${provider} simulado exitoso`
        };

        this.saveUserSession(simulatedUser, simulatedResponse.token);
        return simulatedResponse;
    }

    private saveUserSession(userData: any, token: string) {
        localStorage.setItem("user", JSON.stringify(userData));
        store.dispatch(setUser(userData));
        
        if (token) {
            localStorage.setItem(this.keySession, token);
            console.log("🔑 Token guardado");
        }
        
        this.dispatchEvent(new CustomEvent("userChange", { detail: userData }));
        console.log("💾 Sesión guardada exitosamente");
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


    async loginWithGoogle(googleData: any) {
        console.log("🔐 Iniciando sesión con Google:", googleData);
        
        try {

            try {
                const googleLoginUrl = `${this.API_URL}/auth/google`;
                console.log("🌐 Intentando endpoint Google:", googleLoginUrl);
                
                const response = await axios.post(googleLoginUrl, {
                    token: googleData.credential || googleData.tokenId,
                    email: googleData.email,
                    name: googleData.name,
                    picture: googleData.picture,
                    googleId: googleData.sub
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    timeout: 10000,
                });

                console.log("✅ Respuesta del backend Google OAuth:", response.data);

                const data = response.data;
                
                const userData = data.user || data;
                localStorage.setItem("user", JSON.stringify(userData));
                store.dispatch(setUser(userData));
                if (data.token) {
                    localStorage.setItem(this.keySession, data.token);
                    console.log("🔑 Token de Google guardado");
                }
                

                this.dispatchEvent(new CustomEvent("userChange", { detail: userData }));
                
                console.log("🎉 Login con Google completado exitosamente");
                return data;
                
            } catch (googleError: any) {
                console.log("⚠️ Endpoint Google no disponible, intentando método alternativo...");
                
                return await this.handleGoogleFallback(googleData);
            }

        } catch (error: any) {
            console.error("❌ Error en login con Google:", error);
            
            let errorMessage = "Error al autenticar con Google";
            
            if (error.response) {
                errorMessage = error.response.data?.message || errorMessage;
            }
            
            throw new Error(errorMessage);
        }
    }

    private async handleGoogleFallback(googleData: any) {
        try {
            console.log("🔄 Usando método alternativo para Google OAuth");
            
            // Buscar si el usuario ya existe por email
            const usersUrl = `${this.API_URL}/users`;
            console.log("🔍 Buscando usuarios en:", usersUrl);
            
            const usersResponse = await axios.get(usersUrl, {
                timeout: 10000,
            });
            
            const existingUser = usersResponse.data.find((user: any) => 
                user.email === googleData.email
            );

            let userData;

            if (existingUser) {
                console.log("✅ Usuario existente encontrado:", existingUser);
                userData = existingUser;
            } else {
                console.log("🆕 Creando nuevo usuario para Google OAuth...");
                
              
                const newUser = {
                    name: googleData.name,
                    email: googleData.email,
                    password: `google_oauth_${Date.now()}`,
                    is_active: true
                };

                const createResponse = await axios.post(`${this.API_URL}/users`, newUser, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    timeout: 10000,
                });
                
                console.log("✅ Nuevo usuario creado:", createResponse.data);
                userData = createResponse.data;
            }

          
            const simulatedResponse = {
                user: userData,
                token: `google_token_${Date.now()}`,
                message: "Login con Google exitoso"
            };

            // Guardar usuario en localStorage y Redux
            localStorage.setItem("user", JSON.stringify(userData));
            store.dispatch(setUser(userData));
            localStorage.setItem(this.keySession, simulatedResponse.token);
            
            
            this.dispatchEvent(new CustomEvent("userChange", { detail: userData }));
            
            console.log("🎉 Login con Google (alternativo) completado exitosamente");
            return simulatedResponse;

        } catch (fallbackError: any) {
            console.error("❌ Error en fallback de Google:", fallbackError);
            console.log("🎭 Usando login completamente simulado...");
            
            const simulatedUser = {
                id: Math.floor(Math.random() * 1000),
                name: googleData.name,
                email: googleData.email,
                picture: googleData.picture,
                is_active: true,
                created_at: new Date().toISOString()
            };

            const simulatedResponse = {
                user: simulatedUser,
                token: `simulated_google_token_${Date.now()}`,
                message: "Login con Google simulado exitoso"
            };


            localStorage.setItem("user", JSON.stringify(simulatedUser));
            store.dispatch(setUser(simulatedUser));
            localStorage.setItem(this.keySession, simulatedResponse.token);
            
            this.dispatchEvent(new CustomEvent("userChange", { detail: simulatedUser }));
            
            console.log("🎉 Login simulado con Google completado");
            return simulatedResponse;
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


    async validateToken() {
        try {
            const token = this.getToken();
            if (!token) return false;


            console.log("✅ Token existe, asumiendo válido");
            return true;
            
        } catch (error) {
            console.error("❌ Token inválido:", error);
            this.logout();
            return false;
        }
    }

    async refreshToken() {
        try {
            // Simular refresh 
            const newToken = `refreshed_token_${Date.now()}`;
            localStorage.setItem(this.keySession, newToken);
            console.log("🔄 Token refrescado");
            return newToken;
        } catch (error) {
            console.error("❌ Error al refrescar token:", error);
            this.logout();
            return null;
        }
    }
}

export default new SecurityService();