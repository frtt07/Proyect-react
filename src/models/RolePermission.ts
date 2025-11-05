export interface RolePermission {
    id: string;
    roleId: number;
    permissionId: number;
    startAt: string | null;
    endAt: string | null;
}
