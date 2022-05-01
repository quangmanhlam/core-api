import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';

import {getSchemasByNames} from '../../schemas';
import {
    UserService,
    SettingService,
    RoleService,
    ActionService,
    PermissionService,
    MigrationService,
} from '../../providers';

import {MigrationController} from './migration.controller';

@Module({
    imports: [
        MongooseModule.forFeatureAsync(getSchemasByNames()),
    ],
    controllers: [MigrationController],
    providers: [
        UserService,
        RoleService,
        ActionService,
        SettingService,
        MigrationService,
        PermissionService,
    ],
    exports: [MigrationService],
})
export class MigrationModule {
}
