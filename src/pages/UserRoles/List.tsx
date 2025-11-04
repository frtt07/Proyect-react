import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Alert,
  Snackbar,
  Card,
  CardContent,
} from "@mui/material";
import GenericTable from "../../components/Generics/MUI/GenericList";
import { UserRole } from "../../models/UserRole";
import { userRoleService } from "../../services/userRoleService";
import Swal from "sweetalert2";

const UserRolesList: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as any });

  useEffect(() => {
    if (userId) {
      fetchUserRoles(parseInt(userId));
    }
  }, [userId]);

  const fetchUserRoles = async (userId: number) => {
    try {
      setLoading(true);
      const roles = await userRoleService.getUserRolesWithDetails(userId);
      setUserRoles(roles);
    } catch (error) {
      console.error("Error cargando roles:", error);
      showSnackbar("Error al cargar roles del usuario", "error");
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleAction = async (action: string, item: Record<string, any>) => {
    // Convertir el item a UserRole
    const userRole = item as UserRole;
    
    if (action === "remove" && userRole.id && userId) {
      Swal.fire({
        title: "¿Estás seguro?",
        text: "El usuario perderá este rol",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, remover",
        cancelButtonText: "Cancelar",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            // Usar el método correcto - necesita userId y roleId
            const success = await userRoleService.removeRoleFromUser(
              parseInt(userId), 
              userRole.roleId
            );
            if (success) {
              showSnackbar("Rol removido correctamente", "success");
              fetchUserRoles(parseInt(userId));
            } else {
              showSnackbar("Error al remover el rol", "error");
            }
          } catch (error) {
            console.error("Error removiendo rol:", error);
            showSnackbar("Error al remover el rol", "error");
          }
        }
      });
    }
  };

  // Preparar datos para la tabla
  const tableData = userRoles.map(role => ({
    id: role.id,
    role: role.roleId, // O el nombre del rol si lo tienes
    assignedAt: role.startAt ? new Date(role.startAt).toLocaleDateString() : 'N/A'
  }));

  if (loading) {
    return <Typography>Cargando...</Typography>;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Roles del Usuario
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6">
            Usuario ID: {userId}
          </Typography>
          <Typography color="textSecondary">
            Total de roles asignados: {userRoles.length}
          </Typography>
        </CardContent>
      </Card>

      <GenericTable
        data={tableData}
        columns={["id", "role", "assignedAt"]}
        actions={[
          { name: "remove", label: "Remover Rol", color: "error" },
        ]}
        onAction={handleAction}
        title="Roles Asignados"
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default UserRolesList;