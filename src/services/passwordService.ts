import { Password } from "../models/Password";
import api from "../interceptors/axiosInterceptor";

const API_URL = "/passwords";

class PasswordService {
  async getUserPasswords(userId: number): Promise<Password[]> {
    try {
      const response = await api.get(`${API_URL}/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener contraseñas:", error);
      return [];
    }
  }

  async createPassword(userId: number, passwordData: any): Promise<Password | null> {
    try {
      const response = await api.post<Password>(`${API_URL}/user/${userId}`, passwordData);
      return response.data;
    } catch (error) {
      console.error("Error al crear contraseña:", error);
      return null;
    }
  }

  async updatePassword(passwordId: number, passwordData: any): Promise<Password | null> {
    try {
      const response = await api.put<Password>(`${API_URL}/${passwordId}`, passwordData);
      return response.data;
    } catch (error) {
      console.error("Error al actualizar contraseña:", error);
      return null;
    }
  }

  async deletePassword(passwordId: number): Promise<boolean> {
    try {
      await api.delete(`${API_URL}/${passwordId}`);
      return true;
    } catch (error) {
      console.error("Error al eliminar contraseña:", error);
      return false;
    }
  }
}

export const passwordService = new PasswordService();