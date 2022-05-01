import { Injectable } from '@nestjs/common';
import * as APM from 'elastic-apm-node';

import {TRANSACTION_TYPE, TRANSACTION_STATUS} from './constants';

@Injectable()
export class ApmService {
    apm: any;

    constructor() {
        this.apm = APM;
    }

    captureError(data: any, options?: any) {
        this.apm.captureError(data, options);
    }

    startTransaction(name: string, type: string = TRANSACTION_TYPE): any {
        return this.apm.startTransaction(name, type);
    }

    /**
     * Set end transaction with default success.
     * @param status default is success
     */
    endTransaction(status: string = TRANSACTION_STATUS.SUCCESS): any {
        return this.apm.endTransaction(status);
    }

    setTransactionName(name: string) {
        return this.apm.setTransactionName(name);
    }

    startSpan(name: string) {
        return this.apm.startSpan(name);
    }

    setCustomContext(context: any) {
        return this.apm.setCustomContext(context);
    }

    setTag(name: string, value: any) {
        return this.apm.setTag(name, value);
    }
}
