import {BaseRequestError} from '../base-request-error';
import {ErrorCodes, INVALID_DATA} from '../../constants';

export class AuthWrongPassword extends BaseRequestError {
    constructor(message: string) {
        super(message, {
            type: INVALID_DATA,
            code: ErrorCodes.AUTH_WRONG_PASSWORD,
        });
        this.name = 'AuthWrongPassword';
    }
}
