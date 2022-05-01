import {DynamicModule, Global} from '@nestjs/common';
import {APP_INTERCEPTOR} from '@nestjs/core';

import {ApmService} from './apm.service';
import {ApmInterceptor} from './apm.interceptor';

@Global()
export class ApmModule {
    static register(): DynamicModule {
        return {
            module: ApmModule,
            imports: [],
            providers: [
                ApmService,
                {
                    provide: APP_INTERCEPTOR,
                    useClass: ApmInterceptor
                }
            ],
            exports: [ApmService]
        };
    }
}
