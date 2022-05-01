import {Reflector} from '@nestjs/core';
import {CanActivate, ExecutionContext, Injectable} from '@nestjs/common';

import {PermissionType} from '../types';
import {IS_PUBLIC_KEY, PERMISSIONS_KEY} from '../constants';
import {CacheManagerService} from '../../cache-manager';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private cacheManagerService: CacheManagerService,
    ) {}

    /**
     * Check can activate.
     * @param context
     */
    async canActivate(context: ExecutionContext): Promise<boolean> {
        // check is public
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) return true;

        // if no require roles then return true.
        const requirePermissions = this.reflector.get<Array<string | PermissionType>>(PERMISSIONS_KEY, context.getHandler());
        if (!requirePermissions) return true;

        // match require permissions
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        // assign function check permission
        request.checkPermission = this.isMatchRoles.bind(this);
        return await this.isMatchRoles(requirePermissions, user, true);
    }

    /**
     * Check user role match in list roles has required
     * @param {Array<string>} requirePermissions
     * @param {RequestUserData} user
     * @param isCheckAdmin
     */
    async isMatchRoles(
        requirePermissions: Array<string | PermissionType> = [],
        user: RequestUserData,
        isCheckAdmin: boolean = false,
    ): Promise<boolean> {
        try {
            if (!user) return false;
            const {roleId, isRootAdmin, type} = user;

            // admin has full permissions.
            if (isRootAdmin && isCheckAdmin) return true;

            // get permission by role from cache manager.
            const result = await this.cacheManagerService.getRoleById(roleId, 5000);
            const permissions = result.permissions;

            // check roles
            let isValid = false;
            for (let i = 0; i < requirePermissions.length; i++) {
                let requirePermissionName = '';
                // check permission type
                if (typeof requirePermissions[i] === 'object') {
                    // @ts-ignore
                    const {userType, permission} = requirePermissions[i];
                    if (userType !== type) continue;

                    if (userType && !permission && userType === type) {
                        isValid = true;
                        break;
                    }

                    if (userType && permission && userType === type) {
                        requirePermissionName = permission;
                    }
                } else {
                    // @ts-ignore
                    requirePermissionName = requirePermissions[i];
                }

                // @ts-ignore
                const items = requirePermissionName.split('.');
                if (!items || items.length < 2) continue;

                const permissionKey = items[0];
                const actionKey = items[1];

                // check permission
                const permission = permissions.find(item => item.key === permissionKey);
                if (!permission) continue;

                // check action
                const action = permission.actions.find(item => item.key === actionKey);
                if (action) {
                    isValid = true;
                    break;
                }
            }

            return isValid;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

}
