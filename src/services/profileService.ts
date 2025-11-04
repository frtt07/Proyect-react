import axios from "axios";
import { Profile } from "../models/Profile";

const API_URL = import.meta.env.VITE_API_URL + "/profiles"; // 👈 en plural

class ProfileService {
    /**
     * 🔹 Obtener un perfil por su ID (que coincide con el ID del usuario)
     */
    async getProfileById(id: number): Promise<Profile | null> {
        try {
            const response = await axios.get<Profile>(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error("Perfil no encontrado:", error);
            return null;
        }
    }

    /**
     * 🔹 Crear un perfil asociado a un usuario (ID del perfil = ID del usuario)
     * 
     * Acepta tanto un objeto Profile como un FormData (ideal para subir imagen)
     */
    async createProfile(profileData: Profile | FormData): Promise<Profile | null> {
        try {
            let formData: FormData;

            // Si ya viene como FormData, úsalo tal cual
            if (profileData instanceof FormData) {
                formData = profileData;
            } else {
                // Si no, construimos el FormData manualmente
                formData = new FormData();
                formData.append("phone", profileData.phone);
                if (profileData.photoURL instanceof File) {
                    formData.append("photo", profileData.photoURL);
                }
            }

            // 🔹 El backend espera que la ruta sea /profiles/user/:id
            const id = profileData instanceof FormData
                ? formData.get("id")
                : profileData.id;

            const url = `${API_URL}/user/${id}`;

            const response = await axios.post<Profile>(url, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            return response.data;
        } catch (error) {
            console.error("Error al crear perfil:", error);
            return null;
        }
    }

    /**
     * 🔹 Actualizar perfil (por ID)
     */
    async updateProfile(id: number, profile: Partial<Profile>): Promise<Profile | null> {
        try {
            const response = await axios.put<Profile>(`${API_URL}/${id}`, profile);
            return response.data;
        } catch (error) {
            console.error("Error al actualizar perfil:", error);
            return null;
        }
    }

    /**
     * 🔹 Eliminar perfil
     */
    async deleteProfile(id: number): Promise<boolean> {
        try {
            await axios.delete(`${API_URL}/${id}`);
            return true;
        } catch (error) {
            console.error("Error al eliminar perfil:", error);
            return false;
        }
    }
}

export const profileService = new ProfileService();
