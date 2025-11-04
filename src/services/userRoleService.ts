import { UserRole } from "../models/UserRole";
import api from "../interceptors/axiosInterceptor";

const API_URL = "/user-roles";

class UserRoleService {
  async getUserRoles(userId: number): Promise<UserRole[]> {
    try {
      const response = await api.get(`${API_URL}/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener roles del usuario:", error);
      return [];
    }
  }

  // MÉTODO CORREGIDO - con parámetros correctos
  async assignRoleToUser(
    userId: number, 
    roleId: number, 
    startAt?: string, 
    endAt?: string
  ): Promise<UserRole | null> {
    try {
      const payload = {
        startAt: startAt || new Date().toISOString().slice(0, 19).replace('T', ' '),
        endAt: endAt || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' ')
      };
      
      console.log("🎯 Asignando rol", roleId, "al usuario", userId);
      console.log("📦 Payload:", payload);
      
      const response = await api.post<UserRole>(`${API_URL}/user/${userId}/role/${roleId}`, payload);
      return response.data;
    } catch (error) {
      console.error("Error al asignar rol:", error);
      return null;
    }
  }

  // MÉTODO NUEVO - para eliminar rol por userId y roleId
  async removeRoleFromUser(userId: number, roleId: number): Promise<boolean> {
    try {
      // Primero obtener todas las asignaciones del usuario
      const userRoles = await this.getUserRoles(userId);
      // Encontrar la asignación específica para este rol
      const assignment = userRoles.find(ur => ur.roleId === roleId);
      
      if (assignment && assignment.id) {
        await api.delete(`${API_URL}/${assignment.id}`);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error al remover rol:", error);
      return false;
    }
  }

  // MÉTODO NUEVO - que usa AssignRole.tsx
  async getRolesByUserId(userId: number): Promise<UserRole[]> {
    return this.getUserRoles(userId);
  }

  // MÉTODO NUEVO - que usa UserRoles/List.tsx
  async getUserRolesWithDetails(userId: number): Promise<UserRole[]> {
    return this.getUserRoles(userId);
  }

  async updateUserRole(userRoleId: string, userRoleData: any): Promise<UserRole | null> {
    try {
      const response = await api.put<UserRole>(`${API_URL}/${userRoleId}`, userRoleData);
      return response.data;
    } catch (error) {
      console.error("Error al actualizar user role:", error);
      return null;
    }
  }
}

export const userRoleService = new UserRoleService();