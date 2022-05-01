import {BaseRequestError} from '../base-request-error';
import {ErrorCodes, INVALID_DATA} from '../../constants';

export class UserExists extends BaseRequestError {
    constructor(message?: string) {
        super(message, {
            type: INVALID_DATA,
            code: ErrorCodes.USER_EXITS,
        });
        this.name = 'UserExists';
    }
}
