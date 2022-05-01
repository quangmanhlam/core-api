import {BaseRequestError} from '../base-request-error';
import {ErrorCodes, INVALID_DATA} from '../../constants';

export class MigrationInvalidApiKey extends BaseRequestError {
    constructor(message?: string) {
        super(message, {
            type: INVALID_DATA,
            code: ErrorCodes.MIGRATION_INVALID_API_KEY,
        });
        this.name = 'MigrationInvalidApiKey';
    }
}
