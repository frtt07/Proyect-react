import axios from "axios";
import { Profile } from "../models/Profile";

const API_URL = import.meta.env.VITE_API_URL + "/profiles"; // 👈 importante: en plural

class ProfileService {
    async getProfileById(id: number): Promise<Profile | null> {
        try {
            const response = await axios.get<Profile>(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error("Perfil no encontrado:", error);
            return null;
        }
    }

    async createProfile(profile: Profile): Promise<Profile | null> {
        try {
            // 🔹 Construimos la URL con el ID del usuario (backend espera /profiles/user/<id>)
            const url = `${API_URL}/user/${profile.id}`;

            // 🔹 Creamos el FormData para enviar los campos correctamente
            const formData = new FormData();
            formData.append("phone", profile.phone);

            // Si se incluye una foto, la agregamos
            if (profile.photoURL instanceof File) {
                formData.append("photo", profile.photoURL);
            }

            console.log("POST URL:", url);
            console.log("FormData entries:", Array.from(formData.entries()));

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

    async updateProfile(id: number, profile: Partial<Profile>): Promise<Profile | null> {
        try {
            const response = await axios.put<Profile>(`${API_URL}/${id}`, profile);
            return response.data;
        } catch (error) {
            console.error("Error al actualizar perfil:", error);
            return null;
        }
    }

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
