import {Reflector} from '@nestjs/core';
import {AuthGuard} from '@nestjs/passport';
import {ExecutionContext, Injectable} from '@nestjs/common';

import {IS_PUBLIC_KEY} from '../constants';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        let hasToken = false;
        const request = context.switchToHttp().getRequest();
        if (request && request.headers['Authorization'] || request.headers['authorization']) {
            hasToken = true;
        }

        // if method has tag @Public() is can access
        if (isPublic && !hasToken) {
            return true;
        }
        return super.canActivate(context);
    }
}
