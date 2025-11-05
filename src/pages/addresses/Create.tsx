import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Typography, Box, Alert } from "@mui/material";
import GenericForm from "../../components/Generics/MUI/GenericForm";
import { Address } from "../../models/Address";
import { addressService } from "../../services/addressService";
import Swal from "sweetalert2";

const CreateAddress: React.FC = () => {
  const navigate = useNavigate();

  const addressFields = [
    { name: "street", label: "Calle", type: "text", required: true },
    { name: "number", label: "Número", type: "text", required: true },
    { name: "latitude", label: "Latitud", type: "number" },
    { name: "longitude", label: "Longitud", type: "number" },
    { name: "user_id", label: "ID de Usuario", type: "number", required: true },
  ];

  const initialValues: Partial<Address> = {
    street: "",
    number: "",
    latitude: undefined,
    longitude: undefined,
    user_id: undefined,
  };

  const handleSubmit = async (values: Record<string, any>) => {
    try {
      console.log("📦 Datos del formulario:", values);
      
      const userId = parseInt(values.user_id);
      
      if (isNaN(userId)) {
        Swal.fire({
          title: "Error",
          text: "El ID de usuario debe ser un número válido",
          icon: "error",
        });
        return;
      }

      const addressData = {
        street: values.street,
        number: values.number,
        latitude: values.latitude ? parseFloat(values.latitude) : null,
        longitude: values.longitude ? parseFloat(values.longitude) : null,
        user_id: userId,
      };

      console.log("🚀 Enviando datos al backend:", addressData);

      const address = await addressService.createAddress(userId, addressData);
      
      if (address) {
        Swal.fire({
          title: "Éxito",
          text: "Dirección creada correctamente",
          icon: "success",
          timer: 3000
        });
        navigate("/addresses");
      } else {
        Swal.fire({
          title: "Error",
          text: "Error al crear la dirección",
          icon: "error",
        });
      }
    } catch (error: any) {
      console.error("❌ Error completo:", error);
      Swal.fire({
        title: "Error",
        text: error.message || "Error al crear la dirección",
        icon: "error",
      });
    }
  };

  const handleCancel = () => {
    navigate("/addresses");
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Crear Nueva Dirección
      </Typography>
      
      <Alert severity="info" sx={{ mb: 2 }}>
        💡 <strong>Nota:</strong> Asegúrate de que el ID de usuario exista en la base de datos.
      </Alert>
      
      <Box sx={{ mt: 3 }}>
        <GenericForm
          title="Información de la Dirección"
          fields={addressFields}
          initialValues={initialValues}
          onSubmit={handleSubmit}
          submitLabel="Crear Dirección"
          onCancel={handleCancel}
        />
      </Box>
    </Container>
  );
};

export default CreateAddress;