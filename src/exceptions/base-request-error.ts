export interface RequestOptions {
    name?: string;
    code?: number;
    type?: string;
    subCode?: number;
    data?: any;
}

export class BaseRequestError extends Error {
    type?: string;
    code?: number;
    subCode?: number;
    data?: any;

    constructor(message: string, options?: RequestOptions) {
        super(message);

        const {code, type, subCode, data, name} = options || {};
        this.name = 'BaseRequestError';
        if (type) this.type = type;
        if (code) this.code = code;
        if (subCode) this.subCode = subCode;
        if (data) this.data = data;
        if (name) this.name = name;
    }
}
