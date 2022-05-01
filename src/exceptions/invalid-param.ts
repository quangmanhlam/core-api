import {BaseRequestError, RequestOptions} from './base-request-error';
import {INVALID_PARAM, ErrorCodes} from '../constants';

const DEFAULT_OPTIONS = {
    type: INVALID_PARAM,
    code: ErrorCodes.INVALID_PARAM,
}

export class InvalidParam extends BaseRequestError {
    constructor(message: string, options: RequestOptions = DEFAULT_OPTIONS) {
        super(message, options);
        this.name = 'InvalidParam';
    }
}
