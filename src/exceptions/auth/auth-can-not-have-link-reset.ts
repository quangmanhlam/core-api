import {BaseRequestError} from '../base-request-error';
import {ErrorCodes, INVALID_DATA} from '../../constants';

export class AuthCanNotHaveLinkReset extends BaseRequestError {
    constructor(message: string = 'Can not have link reset pass') {
        super(message, {
            type: INVALID_DATA,
            code: ErrorCodes.AUTH_CAN_NOT_HAVE_LINK_RESET,
        });
        this.name = 'AuthCanNotHaveLinkReset';
    }
}
