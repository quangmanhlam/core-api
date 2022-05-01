import {BaseRequestError} from '../base-request-error';
import {ErrorCodes, INVALID_DATA} from '../../constants';

export class UserInvalid extends BaseRequestError {
    constructor(message?: string) {
        super(message, {
            type: INVALID_DATA,
            code: ErrorCodes.USER_INVALID,
        });
        this.name = 'InvalidUser';
    }
}
