import { useEffect, useState } from "react";
import api from "../../services/api";
import { Table, Button, Spinner } from "react-bootstrap";

// --- Tipos de datos ---
export interface Column<T> {
  header: string;                            // Título de la columna
  accessor: keyof T | string;                // Clave del campo (puede ser anidado)
  render?: (value: any, item: T) => JSX.Element | string;  // Función opcional para personalizar renderizado
}

interface ListarProps<T> {
  endpoint: string;      // Ruta del backend (ej. "/users")
  columns: Column<T>[];  // Columnas a mostrar
  title: string;         // Título de la tabla
}

// --- Componente genérico ---
export default function Listar<T extends { id: number | string }>({
  endpoint,
  columns,
  title,
}: ListarProps<T>) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get<T[]>(endpoint);
        setData(res.data);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint]);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h3>{title}</h3>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={String(col.accessor)}>{col.header}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              {columns.map((col) => {
                const value = (item as any)[col.accessor];
                return (
                  <td key={String(col.accessor)}>
                    {col.render ? col.render(value, item) : String(value ?? "")}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </Table>

      <Button variant="success">Crear nuevo</Button>
    </div>
  );
}
