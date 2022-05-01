import {format} from 'util';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger} from '@nestjs/common';

import {configs} from '../configs';

@Injectable()
export class DefaultInterceptor implements NestInterceptor {

    private readonly logger = new Logger(DefaultInterceptor.name);

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const host = context.switchToHttp();
        const request = host.getRequest<Request>();
        return next
            .handle()
            .pipe(
                tap((response) => {
                    // check config env is development
                    if (configs.env === 'development') {
                        this.logger.log(format(
                          '%s - %s - %s - %s - %s',
                          request.method,
                          request.url,
                          JSON.stringify(request.headers),
                          JSON.stringify(request.body),
                          JSON.stringify(response),
                        ));
                    }
                }),
            );
    }
}
