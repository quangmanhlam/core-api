import {BaseRequestError, RequestOptions} from './base-request-error';
import {UNAUTHORIZED, ErrorCodes} from '../constants';

const DEFAULT_OPTIONS = {
    type: UNAUTHORIZED,
    code: ErrorCodes.UNAUTHORIZED,
}

export class Unauthorized extends BaseRequestError {
    constructor(message: string, options: RequestOptions = DEFAULT_OPTIONS) {
        super(message, options);
        this.name = 'Unauthorized';
    }
}
