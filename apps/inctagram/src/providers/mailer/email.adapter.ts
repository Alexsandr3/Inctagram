import { MailerService } from '@nestjs-modules/mailer';
import { ApiConfigService } from '../../../../../libs/common/src/modules/api-config/api.config.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailAdapter {
  constructor(private readonly mailerService: MailerService, private readonly configService: ApiConfigService) {}

  /**
   * Send email to user with confirmation code
   * @param email
   * @param url
   * @param subject
   * @param template
   */
  async sendEmail(email: string, url: string, subject: string, template: string) {
    try {
      await this.mailerService
        .sendMail({
          to: email,
          // from: '"Support Team" <support@example.com>', // override default from
          from: this.configService.MAIL_FROM, // sender address
          subject: subject,
          template: template, // `.hbs` extension is appended automatically
          context: {
            // filling curly brackets with content
            name: email,
            url,
          },
        })
        .then(res => {
          console.log('Email:response:', res);
        })
        .catch(err => {
          console.log('Email:error:', err);
        });
    } catch (e) {
      console.log(e);
    }
  }
}
