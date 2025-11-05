import React, { useEffect, useState } from "react";
import { Role } from "../../models/Role";
import { Permission } from "../../models/Permission";
import { RolePermission } from "../../models/RolePermission";
import { roleService } from "../../services/roleService";
import PermissionService from "../../services/permissionService";

const RolePermissionPage: React.FC = () => {
    const [roles, setRoles] = useState<Role[]>([]);
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const [rolesData, permissionsData] = await Promise.all([
                roleService.getRoles(),
                PermissionService.getAllPermissions(),
            ]);
            setRoles(rolesData);
            setPermissions(permissionsData || []);
        };
        fetchData();
    }, []);

    const handleToggle = (roleId: number, permissionId: number) => {
        setRolePermissions((prev) => {
            const existing = prev.find(
                (rp) => rp.roleId === roleId && rp.permissionId === permissionId
            );
            if (existing) {
                return prev.filter((rp) => rp !== existing);
            } else {
                const now = new Date().toISOString();
                return [
                    ...prev,
                    {
                        id: `${roleId}-${permissionId}`,
                        roleId,
                        permissionId,
                        startAt: now,
                        endAt: null,
                    },
                ];
            }
        });
    };

    const handleDateChange = (
        roleId: number,
        permissionId: number,
        field: "startAt" | "endAt",
        value: string
    ) => {
        setRolePermissions((prev) =>
            prev.map((rp) =>
                rp.roleId === roleId && rp.permissionId === permissionId
                    ? { ...rp, [field]: value }
                    : rp
            )
        );
    };

    const isPermissionAssigned = (roleId: number, permissionId: number) =>
        rolePermissions.some(
            (rp) => rp.roleId === roleId && rp.permissionId === permissionId
        );

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
                Gestión de Roles y Permisos
            </h1>

            <div className="overflow-x-auto shadow rounded-lg border border-gray-200 bg-white">
                <table className="w-full text-sm text-left text-gray-700">
                    <thead className="bg-gray-100 border-b text-gray-900">
                        <tr>
                            <th className="px-6 py-3 font-semibold text-sm">Rol</th>
                            {permissions.map((perm) => (
                                <th key={perm.id} className="px-6 py-3 text-center font-semibold text-sm">
                                    {perm.url} <span className="text-blue-600 font-mono">({perm.method})</span>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {roles.map((role) => (
                            <tr
                                key={role.id}
                                className="border-b last:border-0 hover:bg-gray-50 transition"
                            >
                                <td className="px-6 py-3 font-medium text-gray-800">{role.name}</td>

                                {permissions.map((perm) => {
                                    const assigned = isPermissionAssigned(role.id!, perm.id);
                                    const rp = rolePermissions.find(
                                        (r) =>
                                            r.roleId === role.id && r.permissionId === perm.id
                                    );

                                    return (
                                        <td key={perm.id} className="px-4 py-3 text-center align-top">
                                            <input
                                                type="checkbox"
                                                checked={assigned}
                                                onChange={() => handleToggle(role.id!, perm.id)}
                                                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                                            />
                                            {assigned && (
                                                <div className="mt-2 flex flex-col gap-2">
                                                    <div className="flex flex-col">
                                                        <label className="text-xs text-gray-500">Inicio</label>
                                                        <input
                                                            type="datetime-local"
                                                            value={rp?.startAt ? rp.startAt.substring(0, 16) : ""}
                                                            onChange={(e) =>
                                                                handleDateChange(
                                                                    role.id!,
                                                                    perm.id,
                                                                    "startAt",
                                                                    e.target.value
                                                                )
                                                            }
                                                            className="border rounded-md px-2 py-1 text-xs focus:ring-2 focus:ring-blue-400 outline-none"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <label className="text-xs text-gray-500">Fin</label>
                                                        <input
                                                            type="datetime-local"
                                                            value={rp?.endAt ? rp.endAt.substring(0, 16) : ""}
                                                            onChange={(e) =>
                                                                handleDateChange(
                                                                    role.id!,
                                                                    perm.id,
                                                                    "endAt",
                                                                    e.target.value
                                                                )
                                                            }
                                                            className="border rounded-md px-2 py-1 text-xs focus:ring-2 focus:ring-blue-400 outline-none"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RolePermissionPage;
