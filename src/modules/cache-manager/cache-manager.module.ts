import { MongooseModule } from "@nestjs/mongoose";
import { CacheModule, Module } from "@nestjs/common";

import { getSchemasByNames } from "../../schemas";

import { CacheManagerService } from "./cache-manager.service";
import { CacheManagerController } from "./cache-manager.controller";

@Module({
    imports: [
        CacheModule.register(),
        MongooseModule.forFeatureAsync(getSchemasByNames())
    ],
    controllers: [CacheManagerController],
    providers: [
        CacheManagerService
    ],
    exports: [CacheManagerService]
})
export class CacheManagerModule {
}
