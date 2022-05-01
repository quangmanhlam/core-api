const bcrypt = require("bcryptjs");
import {ApiResponse, ApiTags} from "@nestjs/swagger";
import {Body, Controller, Post, Req, Res} from '@nestjs/common';

import {BaseController} from "../base.controller";
import {
    UserService,
    SettingService,
    RoleService,
    ActionService,
    PermissionService,
    MigrationService,
} from '../../providers';

import {MigrationCollectionExists, MigrationInvalidApiKey} from "../../exceptions";
import {COLLECTION_NAMES, COLLECTIONS, MIGRATION_API_KEY} from "./constants";
import {CreateCommandDto, RollbackCommandDto, ResponseMigrationDto} from "./dtos";
import {
    ACTIONS,
    PERMISSIONS,
    ROLES,
    USERS,
} from "./data";

// documents Api tag
@ApiTags('migrations')
@ApiResponse({status: 200, description: 'Successful.'})
@ApiResponse({status: 400, description: 'Invalid request input.'})
@ApiResponse({status: 401, description: 'Unauthorized.'})
@ApiResponse({status: 403, description: 'Forbidden.'})
@ApiResponse({status: 404, description: 'Resource not found.'})

@Controller('migrations')
export class MigrationController extends BaseController {
    constructor(
        private migrationService: MigrationService,
        private userService: UserService,
        private settingService: SettingService,
        private userRoleService: RoleService,
        private userActionService: ActionService,
        private userPermissionService: PermissionService,
    ) {
        super();
    }

    @Post('/create')
    async create(@Body() data: CreateCommandDto, @Res() res: any, @Req() req: any) {
        let response = null;
        try {
            // set default collection name
            if (!data.collectionName) data.collectionName = COLLECTIONS.ALL;

            await this.validateCreate(data);

            await this.createData(data);

            response = new ResponseMigrationDto({
                total: 0,
                data: {success: true},
            });
            this.ok(res, response);
        } catch (e) {
            console.log(e);

            response = this.handleError(e);
            this.badRequest(res, response);

            throw e;
        }
    }

    async validateCreate(data: CreateCommandDto) {
        const {collectionName, apiKey} = data;

        // check api key
        if (apiKey !== 'migration') throw new MigrationInvalidApiKey('Invalid api key');

        // check name is all
        if (collectionName !== COLLECTIONS.ALL) {
            // check collection have create
            const collection = await this.migrationService.getByName(collectionName);
            if (collection) throw new MigrationCollectionExists('Collection exists');
        }
    }

    async createData(data: CreateCommandDto) {
        const {collectionName} = data;

        const collectionNames = collectionName === COLLECTIONS.ALL ? COLLECTION_NAMES : [collectionName];
        for (let i = 0; i < collectionNames.length; i++) {
            // check collection have created
            const collection = await this.migrationService.getByName(collectionNames[i]);
            if (collection) continue;

            const migrationData = {collectionName: collectionNames[i]};
            await this.migrationService.insertOrUpdate(migrationData);

            switch (collectionNames[i]) {
                case COLLECTIONS.USERS: {
                    for (let i = 0; i < USERS.length; i++) {
                        USERS[i].password = bcrypt.hashSync(USERS[i].passwordOriginal, 10);
                    }
                    await this.userService.createMany(USERS);
                    break;
                }
                case COLLECTIONS.ACTIONS: {
                    await this.userActionService.createMany(ACTIONS);
                    break;
                }
                case COLLECTIONS.PERMISSIONS: {
                    await this.userPermissionService.createMany(PERMISSIONS);
                    break;
                }
                case COLLECTIONS.ROLES: {
                    await this.userRoleService.createMany(ROLES);
                    break;
                }
                default: {
                    break;
                }
            }
        }
    }

    @Post('/rollback')
    async rollback(@Body() data: CreateCommandDto, @Res() res: any, @Req() req: any) {
        let response = null;
        try {
            // set default collection name
            if (!data.collectionName) data.collectionName = COLLECTIONS.ALL;

            // check api key
            if (data.apiKey === 'migration') throw new MigrationInvalidApiKey('Invalid api key');

            await this.rollbackData(data);

            response = new ResponseMigrationDto({
                total: 0,
                data: {success: true},
            });
            this.ok(res, response);
        } catch (e) {
            console.log(e);

            response = this.handleError(e);
            this.badRequest(res, response);

            throw e;
        }
    }

    async rollbackData(data: RollbackCommandDto) {
        const {collectionName} = data;

        const collectionNames = collectionName === COLLECTIONS.ALL ? COLLECTION_NAMES : [collectionName];
        for (let i = 0; i < collectionNames.length; i++) {
            // check collection have created
            const collection = await this.migrationService.getByName(collectionNames[i]);
            if (!collection) continue;

            await this.migrationService.deleteOne(collectionNames[i]);

            switch (collectionNames[i]) {
                case COLLECTIONS.USERS: {
                    const ids = USERS.map(item => item._id);
                    await this.userService.deleteManyByIds(ids);
                    break;
                }
                case COLLECTIONS.ACTIONS: {
                    const ids = ACTIONS.map(item => item._id);
                    await this.userActionService.deleteManyByIds(ids);
                    break;
                }
                case COLLECTIONS.PERMISSIONS: {
                    const ids = PERMISSIONS.map(item => item._id);
                    await this.userPermissionService.deleteManyByIds(ids);
                    break;
                }
                case COLLECTIONS.ROLES: {
                    const ids = ROLES.map(item => item._id);
                    await this.userRoleService.deleteManyByIds(ids);
                    break;
                }
                default: {
                    break;
                }
            }
        }
    }

    @Post('/fakedata')
    async fakedata(@Body() data: CreateCommandDto, @Res() res: any, @Req() req: any) {
        let response = null;
        try {
            const {collectionName} = data;
            // check api key
            const setting = await this.settingService.getByKey(MIGRATION_API_KEY);
            if (!setting || setting.value !== data.apiKey) throw new MigrationInvalidApiKey('Invalid api key');

            // run fake data
            switch (collectionName) {
                case COLLECTIONS.USERS: {
                    // const url = 'https://random-data-api.com/api/users/random_user?size=100';
                    // const responseData = await axios.get(url);
                    // const users = responseData?.data || [];
                    // if (users.length > 0) {
                    //     let data = [];
                    //     for (let i = 0; i < users.length; i++) {
                    //         const incrementId = 100 + i;
                    //         const code = generateCodeWithPrefix(USER_PREFIX_CODE, incrementId);
                    //         data.push({
                    //             name: users[i].first_name,
                    //             username: users[i].username.trim().toLowerCase(),
                    //             email: users[i].email,
                    //             password: bcrypt.hashSync(users[i].password, 10),
                    //             phone: users[i].phone_number,
                    //             type : "USER",
                    //             roleId : "60fa71b3d9e9c889d69facca",
                    //             status : "ACTIVE",
                    //             incrementId,
                    //             code,
                    //         });
                    //     }
                    //
                    //     await this.userService.createMany(data);
                    // }
                    break;
                }
                default: {
                    break;
                }
            }

            response = new ResponseMigrationDto({
                total: 0,
                data: {success: true},
            });
            this.ok(res, response);
        } catch (e) {
            console.log(e);

            response = this.handleError(e);
            this.badRequest(res, response);

            throw e;
        }
    }
}
