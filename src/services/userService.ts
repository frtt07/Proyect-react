import { User } from "../models/User";
import api from "../interceptors/axiosInterceptor";

const API_URL = "/users"; // api ya tiene la baseURL incluida

class UserService {
  async getUsers(): Promise<User[]> {
    try {
      const response = await api.get(API_URL);
      return response.data;
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      return [];
    }
  }

  async getUserById(id: number): Promise<User | null> {
    try {
      const response = await api.get<User>(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Usuario no encontrado:", error);
      return null;
    }
  }

  async createUser(user: Omit<User, "id">): Promise<User | null> {
    try {
      const response = await api.post<User>(API_URL, user);
      return response.data;
    } catch (error) {
      console.error("Error al crear usuario:", error);
      return null;
    }
  }

  async updateUser(id: number, user: Partial<User>): Promise<User | null> {
    try {
      const response = await api.put<User>(`${API_URL}/${id}`, user);
      return response.data;
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      return null;
    }
  }

  async deleteUser(id: number): Promise<boolean> {
    try {
      await api.delete(`${API_URL}/${id}`);
      return true;
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      return false;
    }
  }
}

export const userService = new UserService();
