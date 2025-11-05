import React, { useEffect, useState } from 'react';
import GenericTable from '../../components/Generics/GenericList';
import { User } from '../../models/User';
import { userService } from '../../services/userService';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';

const ListUsers: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const users = await userService.getUsers();
      setUsers(users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleAction = async (action: string, item: User) => {
    if (action === 'edit') {
      navigate(`/users/editar/${item.id}`); // ✅ ruta actualizada
    } else if (action === 'delete') {
      Swal.fire({
        title: 'Eliminación',
        text: '¿Está seguro de querer eliminar el registro?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'No',
      }).then(async (result) => {
        if (result.isConfirmed) {
          const success = await userService.deleteUser(item.id!);
          if (success) {
            Swal.fire({
              title: 'Eliminado',
              text: 'El registro se ha eliminado correctamente',
              icon: 'success',
            });
            fetchData(); // recarga la lista
          }
        }
      });
    } else if (action === 'signature') {
      navigate(`/digital-signature/${item.id}`);
    } else if (action === 'answers') {
      navigate(`/answers/${item.id}`);
    } else if (action === 'device') {
      navigate(`/device/${item.id}`);
    }
  };

  return (
    <div className="container mt-4">
      {/* --- Título y botones --- */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Usuarios</h2>

        {/* Agrupamos los botones en un solo contenedor */}
        <div className="d-flex gap-2">
          <Button
            variant="secondary"
            className="text-white fw-semibold"
            onClick={() => navigate('/security-questions')}
          >
            Preguntas de Seguridad
          </Button>
          <Button
            variant="success"
            className="text-white fw-semibold"
            onClick={() => navigate('/users/crear')}
          >
            Crear Usuario
          </Button>
        </div>
      </div>

      {/* --- Tabla genérica --- */}
      <GenericTable
        data={users}
        columns={['id', 'name', 'email']}
        actions={[
          { name: 'edit', label: 'Editar', color: 'info' },
          { name: 'delete', label: 'Eliminar', color: 'error' },
          { name: 'signature', label: 'Firma', color: 'secondary' },
          { name: 'answers', label: 'Respuestas', color: 'success' },
          { name: 'device', label: 'Dispositivos', color: 'info' },
        ]}
        onAction={handleAction}
      />
    </div>
  );
};

export default ListUsers;
