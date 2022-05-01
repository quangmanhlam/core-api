import {BaseRequestError} from '../base-request-error';
import {ErrorCodes, RESOURCE_NOT_FOUND} from '../../constants';

export class UserNotFound extends BaseRequestError {
    constructor(message?: string) {
        super(message, {
            type: RESOURCE_NOT_FOUND,
            code: ErrorCodes.USER_NOT_FOUND,
        });
        this.name = 'UserNotFound';
    }
}
