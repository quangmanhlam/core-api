import {BaseRequestError} from './base-request-error';
import {ErrorCodes, PERMISSION_DENIED} from '../constants';

export class PermissionDenied extends BaseRequestError {
    constructor(message: string) {
        super(message, {
            type: PERMISSION_DENIED,
            code: ErrorCodes.PERMISSION_DENIED,
        });
        this.name = 'PermissionDenied';
    }
}
