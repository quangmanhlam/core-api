import {BaseRequestError, RequestOptions} from './base-request-error';
import {RESOURCE_NOT_FOUND, ErrorCodes} from '../constants';

const DEFAULT_OPTIONS = {
    type: RESOURCE_NOT_FOUND,
    code: ErrorCodes.RESOURCE_NOT_FOUND,
}

export class ResourceNotFound extends BaseRequestError {
    constructor(message: string, options: RequestOptions = DEFAULT_OPTIONS) {
        super(message, options);
        this.name = 'ResourceNotFound';
    }
}
