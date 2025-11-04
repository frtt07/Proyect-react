import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Typography, Box } from "@mui/material";
import GenericForm from "../../components/Generics/MUI/GenericForm";
import { Role } from "../../models/Role";
import { roleService } from "../../services/roleService";
import Swal from "sweetalert2";

const CreateRole: React.FC = () => {
  const navigate = useNavigate();

  const roleFields = [
    { name: "name", label: "Nombre del Rol", type: "text", required: true },
    { name: "description", label: "Descripción", type: "text", multiline: true, rows: 3 },
    { name: "isActive", label: "Activo", type: "boolean" },
  ];

  const initialValues: Partial<Role> = {
    name: "",
    description: "",
    isActive: true,
  };

  const handleSubmit = async (values: Record<string, any>) => {
    try {
      const role = await roleService.createRole(values as Role);
      if (role) {
        Swal.fire({
          title: "Éxito",
          text: "Rol creado correctamente",
          icon: "success",
          timer: 3000
        });
        navigate("/roles");
      } else {
        Swal.fire({
          title: "Error",
          text: "Error al crear el rol",
          icon: "error",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Error al crear el rol",
        icon: "error",
      });
    }
  };

  const handleCancel = () => {
    navigate("/roles");
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Crear Nuevo Rol
      </Typography>
      
      <Box sx={{ mt: 3 }}>
        <GenericForm
          title="Información del Rol"
          fields={roleFields}
          initialValues={initialValues}
          onSubmit={handleSubmit}
          submitLabel="Crear Rol"
          onCancel={handleCancel}
        />
      </Box>
    </Container>
  );
};

export default CreateRole;