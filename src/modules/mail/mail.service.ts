import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

import { IMailData } from './types';
import { ApmService } from '../apm';
import { configs } from '../../configs';
import { MAIL_OPTION_TYPE } from './constants';

@Injectable()
export class MailService {
    constructor(
        private mailerService: MailerService,
        private apmService: ApmService,
    ) {}

    /**
     * Send email
     * @param data
     */
    async sendMail(data: IMailData) {
        let result: any = {success: true, message: ''};
        try {
            const {subject, attachments, type, html} = data;

            let mailData: any = {
                to: data.email,
                from: `"Mỹ Thuật Bụi" ${configs.mail.emailSupport}`,
                subject,
                // template: './index',
                template: 'index',
            }
            if (attachments) mailData.attachments = attachments;
            if (type && type === MAIL_OPTION_TYPE.HTML) {
                mailData.html = html;
            } else {
                mailData.context = data;
            }

            // send email
            const resultSend = await this.mailerService.sendMail(mailData);

            if (resultSend && typeof resultSend === 'object') result = {...resultSend};
            result.success = !!(resultSend && resultSend.messageId);
        } catch (e) {
            console.log(e);
            result.success = false;
            result.message = e.message;
            this.apmService.captureError(e, {
                custom: {data}
            });
        }
        return result;
    }
}
