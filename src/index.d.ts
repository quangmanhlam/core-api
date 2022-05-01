/**
 * Interface for request.user, type of Request express;
 * declare is variable global
 */
declare interface RequestUserData {
    userId: string;
    roleId: string;
    type?: string;
    phone?: string;
    email?: string;
    isRootAdmin: boolean;
}

declare interface EventData {
    headers?: any,
    type: string;
    payload: any;
    ack?: () => void;
}

declare interface MessageQueue {
    headers?: any,
    type: string;
    payload: any;
    ack?: () => void;
}

declare interface IFilterFields {
    name: string;
    fieldType: 'string' | 'boolean' | 'number';
}
