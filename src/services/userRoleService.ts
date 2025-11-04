import { UserRole } from "../models/UserRole";
import { Role } from "../models/Role";
import api from "../interceptors/axiosInterceptor";

const API_URL = "/user-roles";

class UserRoleService {
  async getUserRoles(userId: number): Promise<UserRole[]> {
    try {
      const response = await api.get(`${API_URL}/user/${userId}`);
      // MAPEAR LOS DATOS DEL BACKEND AL FRONTEND
      const backendData = response.data;
      return backendData.map((item: any) => ({
        id: item.id,
        userId: item.user_id, // Mapear user_id → userId
        roleId: item.role_id, // Mapear role_id → roleId
        startAt: item.startAt,
        endAt: item.endAt,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      }));
    } catch (error) {
      console.error("Error al obtener roles del usuario:", error);
      return [];
    }
  }

  // MÉTODO NUEVO: Obtener user roles con información de roles
  async getUserRolesWithRoleDetails(userId: number): Promise<UserRole[]> {
    try {
      const userRoles = await this.getUserRoles(userId);
      
      if (userRoles.length === 0) return [];
      
      // Obtener todos los roles para mapear los nombres
      const rolesResponse = await api.get("/roles");
      const allRoles: Role[] = rolesResponse.data;
      
      // Combinar userRoles con información de roles
      return userRoles.map(userRole => ({
        ...userRole,
        role: allRoles.find(role => role.id === userRole.roleId) || { 
          id: userRole.roleId, 
          name: `Rol ${userRole.roleId}` 
        }
      }));
    } catch (error) {
      console.error("Error al obtener roles del usuario con detalles:", error);
      return this.getUserRoles(userId); // Fallback a datos básicos
    }
  }

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
      
      const response = await api.post<any>(`${API_URL}/user/${userId}/role/${roleId}`, payload);
      
      // MAPEAR LA RESPUESTA DEL BACKEND
      const backendData = response.data;
      return {
        id: backendData.id,
        userId: backendData.user_id, // Mapear user_id → userId
        roleId: backendData.role_id, // Mapear role_id → roleId
        startAt: backendData.startAt,
        endAt: backendData.endAt,
        createdAt: backendData.created_at,
        updatedAt: backendData.updated_at
      };
    } catch (error) {
      console.error("Error al asignar rol:", error);
      return null;
    }
  }

  async removeRoleFromUser(userId: number, roleId: number): Promise<boolean> {
    try {
      const userRoles = await this.getUserRoles(userId);
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

  // MÉTODO ACTUALIZADO - usar el nuevo método con detalles
  async getRolesByUserId(userId: number): Promise<UserRole[]> {
    return this.getUserRolesWithRoleDetails(userId);
  }

  // MÉTODO ACTUALIZADO - usar el nuevo método con detalles
  async getUserRolesWithDetails(userId: number): Promise<UserRole[]> {
    return this.getUserRolesWithRoleDetails(userId);
  }

  async updateUserRole(userRoleId: string, userRoleData: any): Promise<UserRole | null> {
    try {
      const response = await api.put<any>(`${API_URL}/${userRoleId}`, userRoleData);
      
      // MAPEAR LA RESPUESTA DEL BACKEND
      const backendData = response.data;
      return {
        id: backendData.id,
        userId: backendData.user_id, // Mapear user_id → userId
        roleId: backendData.role_id, // Mapear role_id → roleId
        startAt: backendData.startAt,
        endAt: backendData.endAt,
        createdAt: backendData.created_at,
        updatedAt: backendData.updated_at
      };
    } catch (error) {
      console.error("Error al actualizar user role:", error);
      return null;
    }
  }
}

export const userRoleService = new UserRoleService();