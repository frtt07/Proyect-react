import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { userRoleService } from "../../services/userRoleService";
import { roleService } from "../../services/roleService";
import { userService } from "../../services/userService";
import { User } from "../../models/User";
import { Role } from "../../models/Role";
import { UserRole } from "../../models/UserRole";
import Swal from "sweetalert2";

const AssignRole: React.FC = () => {
  const [userId, setUserId] = useState<number | "">("");
  const [roleId, setRoleId] = useState<number | "">("");
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (userId) {
      loadUserRoles(userId);
    } else {
      setUserRoles([]);
    }
  }, [userId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [usersData, rolesData] = await Promise.all([
        userService.getUsers(),
        roleService.getRoles(),
      ]);
      setUsers(usersData);
      setRoles(rolesData);
    } catch (error) {
      console.error("Error loading data:", error);
      setError("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  // En la función loadUserRoles, cambia:
    const loadUserRoles = async (userId: number) => {
    try {
        const roles = await userRoleService.getRolesByUserId(userId);
        setUserRoles(roles);
    } catch (error) {
        console.error("Error loading user roles:", error);
        setError("Error al cargar los roles del usuario");
    }
    };

  const handleAssignRole = async () => {
    if (!userId || !roleId) {
      setError("Por favor selecciona un usuario y un rol");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      // Fechas por defecto
      const startAt = new Date().toISOString();
      const endAt = new Date();
      endAt.setFullYear(endAt.getFullYear() + 1); // 1 año por defecto

      const userRole = await userRoleService.assignRoleToUser(
        userId,
        roleId,
        startAt,
        endAt.toISOString()
      );

      if (userRole) {
        setSuccess(`Rol asignado correctamente al usuario`);
        Swal.fire({
          title: "Éxito",
          text: "Rol asignado correctamente",
          icon: "success",
          timer: 3000,
        });
        
        // Recargar los roles del usuario
        await loadUserRoles(userId);
        
        // Limpiar formulario
        setRoleId("");
      }
    } catch (error: any) {
      const errorMessage = error.message || "Error al asignar el rol";
      setError(errorMessage);
      Swal.fire({
        title: "Error",
        text: errorMessage,
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveRole = async (roleIdToRemove: number) => {
    if (!userId) return;

    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará el rol del usuario",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        const success = await userRoleService.removeRoleFromUser(userId, roleIdToRemove);
        if (success) {
          Swal.fire({
            title: "Eliminado",
            text: "Rol eliminado correctamente",
            icon: "success",
            timer: 3000,
          });
          await loadUserRoles(userId);
        }
      } catch (error: any) {
        Swal.fire({
          title: "Error",
          text: error.message || "Error al eliminar el rol",
          icon: "error",
        });
      }
    }
  };

  const getUserName = (userId: number) => {
    const user = users.find(u => u.id === userId);
    return user ? `${user.name} (${user.email})` : `Usuario ${userId}`;
  };

  const getRoleName = (roleId: number) => {
    const role = roles.find(r => r.id === roleId);
    return role ? role.name : `Rol ${roleId}`;
  };

  const getAvailableRoles = () => {
    if (!userId) return roles;
    
    const currentRoleIds = userRoles.map(ur => ur.roleId);
    return roles.filter(role => !currentRoleIds.includes(role.id));
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Asignar Roles a Usuarios
      </Typography>

      <Grid container spacing={3}>
        {/* Formulario de asignación */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Asignar Nuevo Rol
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            )}

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Usuario</InputLabel>
              <Select
                value={userId}
                label="Usuario"
                onChange={(e) => setUserId(e.target.value as number)}
              >
                <MenuItem value="">
                  <em>Seleccionar usuario</em>
                </MenuItem>
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.name} - {user.email}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Rol</InputLabel>
              <Select
                value={roleId}
                label="Rol"
                onChange={(e) => setRoleId(e.target.value as number)}
                disabled={!userId}
              >
                <MenuItem value="">
                  <em>Seleccionar rol</em>
                </MenuItem>
                {getAvailableRoles().map((role) => (
                  <MenuItem key={role.id} value={role.id}>
                    {role.name} - {role.description}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              variant="contained"
              color="primary"
              onClick={handleAssignRole}
              disabled={loading || !userId || !roleId}
              fullWidth
            >
              {loading ? "Asignando..." : "Asignar Rol"}
            </Button>
          </Paper>
        </Grid>

        {/* Roles actuales del usuario */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Roles Actuales del Usuario
            </Typography>

            {!userId ? (
              <Alert severity="info">
                Selecciona un usuario para ver sus roles
              </Alert>
            ) : userRoles.length === 0 ? (
              <Alert severity="warning">
                Este usuario no tiene roles asignados
              </Alert>
            ) : (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {userRoles.map((userRole) => (
                  <Card key={userRole.id} variant="outlined">
                    <CardContent sx={{ py: 1, "&:last-child": { pb: 1 } }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Box>
                          <Typography variant="subtitle1">
                            {getRoleName(userRole.roleId)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Desde: {new Date(userRole.startAt).toLocaleDateString()}
                            {userRole.endAt && ` • Hasta: ${new Date(userRole.endAt).toLocaleDateString()}`}
                          </Typography>
                        </Box>
                        <Button
                          size="small"
                          color="error"
                          onClick={() => handleRemoveRole(userRole.roleId)}
                        >
                          Quitar
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AssignRole;