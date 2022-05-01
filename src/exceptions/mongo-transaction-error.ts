import {BaseRequestError, RequestOptions} from './base-request-error';
import {MONGO_TRANSACTION_ERROR, ErrorCodes} from '../constants';

const DEFAULT_OPTIONS = {
    type: MONGO_TRANSACTION_ERROR,
    code: ErrorCodes.MONGO_TRANSACTION_ERROR,
}

export class MongoTransactionError extends BaseRequestError {
    constructor(message: string, options: RequestOptions = DEFAULT_OPTIONS) {
        super(message, options);
        this.name = 'MongoTransactionError';
    }
}
