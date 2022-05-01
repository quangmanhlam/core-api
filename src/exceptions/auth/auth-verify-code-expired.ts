import {BaseRequestError} from '../base-request-error';
import {ErrorCodes, INVALID_DATA} from '../../constants';

export class AuthVerifyCodeExpired extends BaseRequestError {
    constructor(message: string = 'Verify code is expired') {
        super(message, {
            type: INVALID_DATA,
            code: ErrorCodes.AUTH_VERIFY_CODE_EXPIRED,
        });
        this.name = 'AuthVerifyCodeExpired';
    }
}
