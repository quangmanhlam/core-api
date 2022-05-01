import { CacheModule, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { MongooseModule } from "@nestjs/mongoose";

import { AuthService } from "./auth.service";
import { JwtStrategy } from "./strategies";

import { configs } from "../../configs";
import {
    ActionService,
    PermissionService,
    RoleService,
    SettingService,
    UserResetPassService,
    UserService
} from "../../providers";
import { AuthController } from "./auth.controller";
import { ApmModule, ApmService } from "../apm";
import { getSchemasByNames } from "../../schemas";
import { MailModule, MailService } from "../mail";
import { CacheManagerService } from "../cache-manager";


@Module({
    imports: [
        CacheModule.register(),
        PassportModule,
        JwtModule.register({
            secret: configs.jwt?.secret || "secretkey",
            signOptions: { expiresIn: `${configs.jwt?.expiresIn || 3600}s` }
        }),
        MongooseModule.forFeatureAsync(getSchemasByNames()),
        ApmModule,
        MailModule
    ],
    controllers: [AuthController],
    providers: [
        ApmService,
        AuthService,
        UserService,
        JwtStrategy,
        MailService,
        RoleService,
        SettingService,
        PermissionService,
        ActionService,
        CacheManagerService,
        UserResetPassService,
    ],
    exports: [AuthService, CacheManagerService]
})
export class AuthModule {
}
