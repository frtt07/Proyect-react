import Listar, { Column } from "../components/Genericas/Listar";

// --- Definimos el tipo de datos que viene del backend ---
interface Role {
  id: number;
  name: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role?: Role;
}

export default function Usuarios() {
  const columns: Column<User>[] = [
    { header: "ID", accessor: "id", render: (item) => <strong>{item.id}</strong> },
    { header: "Nombre", accessor: "name" },
    { header: "Correo", accessor: "email" },
    {
      header: "Rol",
      accessor: "role",
      render: (role) => (role ? role.name : "Sin rol"),
    },
  ];

  return (
    <Listar<User>
      endpoint="/users"
      columns={columns}
      title="Listado de Usuarios"
    />
  );
}
