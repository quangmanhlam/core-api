import {BaseRequestError} from '../base-request-error';
import {ErrorCodes, RESOURCE_NOT_FOUND} from '../../constants';

export class RoleNotFound extends BaseRequestError {
    constructor(message: string = 'Role not found') {
        super(message, {
            type: RESOURCE_NOT_FOUND,
            code: ErrorCodes.ROLE_NOT_FOUND,
        });
        this.name = 'RoleNotFound';
    }
}
