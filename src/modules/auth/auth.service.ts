import {JwtService} from '@nestjs/jwt';
import {Injectable} from '@nestjs/common';

import {RoleService, ActionService, PermissionService} from '../../providers';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private roleService: RoleService,
        private actionService: ActionService,
        private permissionService: PermissionService,
    ) {
    }

    sign(payload: any) {
        return this.jwtService.sign(payload);
    }

    async getRoleById(roleId: string) {
        let listPermission: any = [];

        // get role
        const role = await this.roleService.getOne({ id: roleId });
        if (!role) return listPermission;

        // get user permissions
        let permissionIds = [];
        let actionsIds:any = [];
        for (let i = 0; i < role.permissions.length; i++) {
            const {id, actionIds} = role.permissions[i];
            permissionIds.push(id);
            actionsIds = actionsIds.concat(actionIds);
        }

        // get permissions
        let filterPermission: any = {ids: permissionIds};
        if (role.isRootAdmin) filterPermission = {};
        const permissions = await this.permissionService.find(filterPermission);

        // get user actions
        let filterAction: any = {ids: actionsIds};
        if (role.isRootAdmin) filterAction = {};
        const ACTION_FIELDS = {name: 1, url: 1, key: 1, method: 1};
        const actions = await this.actionService.find(filterAction, ACTION_FIELDS);

        // map data into role.
        for (let i = 0; i < permissions.length; i++) {
            const {id, key, name, actionIds} = permissions[i];
            // filter actions of permission
            let listAction = [];
            for (let j = 0; j < actionIds.length; j++) {
                const action = actions.find(item => actionIds[j] === item._id.toString());
                listAction.push(action);
            }
            listPermission.push({
                name,
                key,
                actions: listAction,
            });
        }

        return listPermission;
    }
}
