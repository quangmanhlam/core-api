import {BaseRequestError} from '../base-request-error';
import {ErrorCodes, INVALID_DATA} from '../../constants';

export class UserInvalidType extends BaseRequestError {
    constructor(message?: string) {
        super(message, {
            type: INVALID_DATA,
            code: ErrorCodes.USER_INVALID_TYPE,
        });
        this.name = 'UserInvalidType';
    }
}
