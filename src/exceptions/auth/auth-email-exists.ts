import {BaseRequestError} from '../base-request-error';
import {ErrorCodes, INVALID_DATA} from '../../constants';

export class AuthEmailExists extends BaseRequestError {
    constructor(message: string = 'Email is exists') {
        super(message, {
            type: INVALID_DATA,
            code: ErrorCodes.AUTH_EMAIL_EXISTS,
        });
        this.name = 'AuthEmailExists';
    }
}
