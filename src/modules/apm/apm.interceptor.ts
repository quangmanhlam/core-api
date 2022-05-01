import {CallHandler, ExecutionContext, Injectable, NestInterceptor} from '@nestjs/common';
import {catchError, tap} from 'rxjs/operators';
import {Observable, EMPTY} from 'rxjs';
import {ApmService} from './apm.service';

@Injectable()
export class ApmInterceptor implements NestInterceptor {
    constructor(private readonly apmService: ApmService) {
    }

    intercept(
        context: ExecutionContext,
        next: CallHandler
    ): Observable<Response> {
        const host = context.switchToHttp();
        const request = host.getRequest<Request>();

        // start transaction
        this.apmService.startTransaction(request.url, 'transactions');

        // assign apm service to request
        // @ts-ignore
        request.apmService = this.apmService;

        return next
            .handle()
            .pipe(
                tap(() => {
                    // end transaction success
                    this.apmService.endTransaction('success');
                }),
                catchError(error => {
                    console.log('catchError: ', error);
                    // end transaction error
                    this.apmService.endTransaction('error');

                    // capture error with data
                    this.apmService.captureError(error, {
                        custom: {
                            body: request.body,
                            url: request.url,
                            method: request.method,
                            headers: request.headers,
                            // @ts-ignore
                            user: request && request.user ? request.user : null,
                        }
                    });

                    if (error.status === 400) throw error;

                    return EMPTY;
                })
            );
    }
}
