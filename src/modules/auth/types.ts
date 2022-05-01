export interface User {
    userId: string;
    roleId: string;
    phone: string;
    isRootAdmin: boolean;
}

export interface PermissionType {
    userType: string;
    permission?: string;
}
