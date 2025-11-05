import React, { useEffect, useState } from "react";
import GenericTable from "../../components/Generics/GenericList";
import PermissionService from "../../services/permissionService";
import { Permission } from "../../models/Permission";
import Swal from "sweetalert2";

const ListPermissions: React.FC = () => {
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [loading, setLoading] = useState(true);

    // 🔹 Cargar permisos al montar el componente
    useEffect(() => {
        const fetchPermissions = async () => {
            try {
                const data = await PermissionService.getAllPermissions();
                if (data) {
                    setPermissions(data);
                } else {
                    setPermissions([]);
                }
            } catch (error) {
                console.error("❌ Error cargando permisos:", error);
                Swal.fire({
                    title: "Error",
                    text: "No se pudieron obtener los permisos",
                    icon: "error",
                    confirmButtonColor: "#d33",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchPermissions();
    }, []);

    // 🔹 Columnas para la tabla
    const columns = ["id", "entity", "url", "method"];
    const columnNames = {
        id: "ID",
        entity: "Entidad",
        url: "Ruta",
        method: "Método",
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100 py-10 px-6">
            <div className="w-full max-w-6xl">
                {loading ? (
                    <p className="text-gray-600 text-lg text-center">
                        Cargando permisos...
                    </p>
                ) : (
                    <GenericTable
                        data={permissions}
                        columns={columns}
                        columnNames={columnNames}
                        actions={[]} // 👈 Sin acciones (solo vista)
                        onAction={() => { }} // 👈 No hace nada
                        title="Listado de Permisos del Sistema"
                    />
                )}
            </div>
        </div>
    );
};

export default ListPermissions;
