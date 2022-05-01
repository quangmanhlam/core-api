interface IAttachment {
    filename: string;
    content?: any;
    path?: string;
    contentType?: string;
    cid?: string;
}

export interface IMailData {
    email: string;
    content?: string;
    subject: string;
    type?: string;
    html?: any;
    attachments?: Array<IAttachment>;
}
