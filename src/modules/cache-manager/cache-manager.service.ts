import {Model} from 'mongoose';
import {Cache} from 'cache-manager';
import {InjectModel} from '@nestjs/mongoose';
import {CACHE_MANAGER, Inject, Injectable} from '@nestjs/common';

import {
    ACTION_MODEL,
    ACTION_OPTIONS_SELECT,
    PERMISSION_MODEL,
    PERMISSION_OPTIONS_SELECT,
    PREFIX_ROLE,
    ROLE_MODEL
} from '../../constants';
import {RoleNotFound} from '../../exceptions';

@Injectable()
export class CacheManagerService {
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        @InjectModel(ROLE_MODEL) private roleModel: Model<any>,
        @InjectModel(ACTION_MODEL) private actionModel: Model<any>,
        @InjectModel(PERMISSION_MODEL) private permissionModel: Model<any>,
    ) {
    }

    /**
     * get cache by key, if cache not exists then get data from db and set new cache
     * @param {string} key
     * @return {any}
     */
    async get(key: string): Promise<any> {
        return await this.cacheManager.get(key);
    }

    /**
     * Set to cache
     * @param {string} key
     * @param {string} value
     * @param {number} ttl default is 60s.
     */
    async set(key: string, value: string, ttl: number = 60000) {
        await this.cacheManager.set(key, value, {ttl});
    }

    /**
     * Delete cache by key.
     * @param key
     */
    async deleteByKey(key: string) {
        return await this.cacheManager.del(key);
    }

    /**
     * Clear all cache data.
     */
    async clearAll() {
        return await this.cacheManager.reset();
    }

    /**
     * Get role by id in cache, if role not exists in cache, set to cache manager
     * @param {string} roleId
     * @param {number} ttl is default 5 minutes.
     */
    async getRoleById(roleId: string, ttl: number = 300000) {
        let role = null;
        try {
            // get from cache
            const key = `${PREFIX_ROLE}_${roleId}`;
            role = await this.cacheManager.get(key);
            if (role) role = JSON.parse(role);

            // get from db if cache not exists
            if (!role) {
                role = await this.createCacheToRole(roleId, ttl);
            }
        } catch (ex) {
            console.log(ex);
        }

        return role;
    }

    /**
     * Create cache for role id
     * @param roleId
     * @param {number} ttl default is 300 seconds
     */
    async createCacheToRole(roleId: string, ttl: number = 300000) {
        // get user role
        const userRole = await this.roleModel.findOne({_id: roleId});
        if (!userRole) throw new RoleNotFound('Role not found');
        const {permissions} = userRole.toJSON();

        // get user permissions
        let permissionIds = [];
        let actionsIds: any = [];
        for (let i = 0; i < permissions.length; i++) {
            const {id, actionIds} = permissions[i];
            permissionIds.push(id);
            actionsIds = actionsIds.concat(actionIds);
        }

        const filterPermission = {_id: {$in: permissionIds}};
        const userPermissions = await this.permissionModel.find(filterPermission, PERMISSION_OPTIONS_SELECT);

        // get user actions
        const filterAction = {_id: {$in: actionsIds}};
        const actions = await this.actionModel.find(filterAction, ACTION_OPTIONS_SELECT);

        // map data into role.
        const cacheData = {permissions: []};
        for (let i = 0; i < permissions.length; i++) {
            const {id, actionIds} = permissions[i];

            let key = '';
            let name = '';
            const userPermissionItem = userPermissions.find(item => item._id.toString() === id);
            if (userPermissionItem) {
                key = userPermissionItem.key;
                name = userPermissionItem.name;
            }

            // filter actions of permission
            let listAction = [];
            for (let j = 0; j < actionIds.length; j++) {
                const action = actions.find(item => actionIds[j] === item._id.toString());
                listAction.push(action);
            }

            if (key && listAction.length > 0) {
                cacheData.permissions.push({
                    name,
                    key,
                    actions: listAction,
                });
            }
        }

        const key = `${PREFIX_ROLE}_${roleId}`;
        await this.cacheManager.set(key, JSON.stringify(cacheData), {ttl});
        return cacheData;
    }
}
