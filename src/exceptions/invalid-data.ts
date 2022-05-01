import {BaseRequestError, RequestOptions} from './base-request-error';
import {INVALID_DATA, ErrorCodes} from '../constants';

const DEFAULT_OPTIONS = {
    type: INVALID_DATA,
    code: ErrorCodes.INVALID_DATA,
}

export class InvalidData extends BaseRequestError {
    constructor(message, options: RequestOptions = DEFAULT_OPTIONS) {
        super(message, options);
        this.name = 'InvalidData';
    }
}
