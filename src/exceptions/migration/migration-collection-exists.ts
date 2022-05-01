import {BaseRequestError} from '../base-request-error';
import {ErrorCodes, INVALID_DATA} from '../../constants';

export class MigrationCollectionExists extends BaseRequestError {
    constructor(message?: string) {
        super(message, {
            type: INVALID_DATA,
            code: ErrorCodes.MIGRATION_COLLECTION_EXISTS,
        });
        this.name = 'MigrationCollectionExists';
    }
}
