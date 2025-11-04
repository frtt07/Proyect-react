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
  Chip,
} from "@mui/material";
import GenericTable from "../../components/Generics/MUI/GenericList";
import { Password } from "../../models/Password";
import { passwordService } from "../../services/passwordService";

const UserPasswordsList: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [passwords, setPasswords] = useState<Password[]>([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as any });

  useEffect(() => {
    if (userId) {
      fetchPasswords(parseInt(userId));
    }
  }, [userId]);

  const fetchPasswords = async (userId: number) => {
    try {
      const passwordsData = await passwordService.getUserPasswords(userId);
      setPasswords(passwordsData);
    } catch (error) {
      showSnackbar("Error al cargar historial de contraseñas", "error");
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleAction = async (action: string, password: Password) => {
    // Aquí puedes agregar acciones específicas para contraseñas si es necesario
    console.log("Action:", action, "Password:", password);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const processedData = passwords.map(pwd => ({
    ...pwd,
    createdAt: formatDate(pwd.createdAt!),
    status: pwd.isActive ? 
      <Chip label="Activa" color="success" size="small" /> : 
      <Chip label="Inactiva" color="default" size="small" />
  }));

  if (loading) {
    return <Typography>Cargando...</Typography>;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Historial de Contraseñas
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6">
            Usuario ID: {userId}
          </Typography>
          <Typography color="textSecondary">
            Total de contraseñas en historial: {passwords.length}
          </Typography>
        </CardContent>
      </Card>

      <GenericTable
        data={processedData}
        columns={["id", "createdAt", "status"]}
        actions={[
          { name: "view", label: "Ver Detalles", color: "info" },
        ]}
        onAction={handleAction}
        title="Contraseñas del Usuario"
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

export default UserPasswordsList;