import {BaseRequestError} from '../base-request-error';
import {RESOURCE_NOT_FOUND, ErrorCodes} from '../../constants';

export class ActionNotFound extends BaseRequestError {
    constructor(message: string) {
        super(message, {
            type: RESOURCE_NOT_FOUND,
            code: ErrorCodes.ACTION_NOT_FOUND,
        });
        this.name = 'ActionNotFound';
    }
}
