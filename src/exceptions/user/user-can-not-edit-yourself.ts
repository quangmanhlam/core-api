import {BaseRequestError} from '../base-request-error';
import {ErrorCodes, INVALID_DATA} from '../../constants';

export class UserCanNotEditYourself extends BaseRequestError {
    constructor(message?: string) {
        super(message, {
            type: INVALID_DATA,
            code: ErrorCodes.USER_CAN_NOT_EDIT_YOURSELF,
        });
        this.name = 'UserCanNotEditYourself';
    }
}
