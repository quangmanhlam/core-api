import { CacheModule, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { getSchemasByNames } from "../../schemas";
import { ActionService, PermissionService, RoleService, UserService } from "../../providers";
import { CacheManagerModule, CacheManagerService } from "../cache-manager";

import { UserController } from "./user.controller";
import { ProfileController } from "./profile.controller";

@Module({
    imports: [
        CacheModule.register(),
        MongooseModule.forFeatureAsync(getSchemasByNames()),
        CacheManagerModule
    ],
    controllers: [UserController, ProfileController],
    providers: [UserService, RoleService, CacheManagerService, PermissionService, ActionService],
    exports: [UserService]
})
export class UserModule {
}
