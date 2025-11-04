import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Button,
  Alert,
  Snackbar,
  Grid,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { Address } from "../../models/Address";
import { addressService } from "../../services/addressService";
import Swal from "sweetalert2";

const ListAddresses: React.FC = () => {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as any });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const addressesData = await addressService.getAddresses();
      setAddresses(addressesData);
    } catch (error) {
      showSnackbar("Error al cargar direcciones", "error");
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleDelete = async (address: Address) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed && address.id) {
        const success = await addressService.deleteAddress(address.id);
        if (success) {
          showSnackbar("Dirección eliminada correctamente", "success");
          fetchAddresses();
        } else {
          showSnackbar("Error al eliminar la dirección", "error");
        }
      }
    });
  };

  if (loading) {
    return <Typography>Cargando...</Typography>;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Gestión de Direcciones
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate("/addresses/crear")}
        >
          Nueva Dirección
        </Button>
      </Box>

      <Grid container spacing={3}>
        {addresses.map((address) => (
          <Grid item xs={12} md={6} key={address.id}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {address.street} {address.number}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  {address.city}, {address.state}
                </Typography>
                <Typography variant="body2">
                  {address.country} - {address.postalCode}
                </Typography>
                {address.user && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <strong>Usuario:</strong> {address.user.name}
                  </Typography>
                )}
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  startIcon={<Edit />}
                  onClick={() => navigate(`/addresses/editar/${address.id}`)}
                >
                  Editar
                </Button>
                <Button
                  size="small"
                  startIcon={<Delete />}
                  color="error"
                  onClick={() => handleDelete(address)}
                >
                  Eliminar
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {addresses.length === 0 && (
        <Box textAlign="center" sx={{ mt: 4 }}>
          <Typography variant="h6" color="textSecondary">
            No hay direcciones registradas
          </Typography>
        </Box>
      )}

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

export default ListAddresses;