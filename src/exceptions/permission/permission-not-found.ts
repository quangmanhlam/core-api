import {BaseRequestError} from '../base-request-error';
import {ErrorCodes, RESOURCE_NOT_FOUND} from '../../constants';

export class PermissionNotFound extends BaseRequestError {
    constructor(message: string) {
        super(message, {
            type: RESOURCE_NOT_FOUND,
            code: ErrorCodes.PERMISSION_NOT_FOUND,
        });
        this.name = 'PermissionNotFound';
    }
}
