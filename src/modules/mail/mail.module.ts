import {Module} from '@nestjs/common';
import {MailerModule} from '@nestjs-modules/mailer';
import {HandlebarsAdapter} from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

import {configs} from '../../configs';
import {ApmModule, ApmService} from '../apm';
import {MailService} from './mail.service';

const path = `${__dirname}/templates`;

@Module({
    imports: [
        MailerModule.forRoot({
            transport: {
                host: configs.mail.smtpDomain,
                secure: false,
                auth: {
                    user: configs.mail.user,
                    pass: configs.mail.pass,
                },
                port: 587,
            },
            template: {
                dir: path,
                adapter: new HandlebarsAdapter(),
                options: {
                    strict: true,
                },
            },
        }),
        ApmModule,
    ],
    providers: [MailService, ApmService],
    exports: [MailService],
})
export class MailModule {
}
