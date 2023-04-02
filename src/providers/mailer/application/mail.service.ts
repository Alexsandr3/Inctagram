import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ApiConfigService } from '../../../modules/api-config/api.config.service';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService, private configService: ApiConfigService) {}

  /**
   * Send email to user with confirmation code
   * @param email
   * @param code
   */
  async sendUserConfirmation(email: string, code: string) {
    try {
      const url = `${this.configService.CLIENT_URL}/registration-confirmation?code=${code}`;
      //const url = `${process.env.CLIENT_URL}/registration-confirmation?code=${code}`;
      await this.mailerService
        .sendMail({
          to: email,
          // from: '"Support Team" <support@example.com>', // override default from
          from: this.configService.MAIL_FROM, // sender address
          subject: 'Finish registration',
          template: `./confirmation.hbs`, // `.hbs` extension is appended automatically
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

  /**
   * Send email to user with password recovery code
   * @param email
   * @param code
   */
  async sendPasswordRecoveryMessage(email: string, code: string) {
    const url = `${this.configService.CLIENT_URL}/new-password?code=${code}`;
    await this.mailerService
      .sendMail({
        to: email,
        // from: '"Support Team" <support@example.com>', // override default from
        from: this.configService.MAIL_FROM, // sender address
        subject: 'Password recovery',
        template: `./recovery.hbs`, // `.hbs` extension is appended automatically
        context: {
          // ✏️ filling curly brackets with content
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
  }

  /**
   * Send email to user with password recovery code
   * @param email
   * @param code
   */
  async sendEmailRecoveryMessage(email: string, code: string) {
    const url = `${this.configService.CLIENT_URL}/registration-confirmation?code=${code}`;
    await this.mailerService
      .sendMail({
        to: email,
        // from: '"Support Team" <support@example.com>', // override default from
        from: this.configService.MAIL_FROM, // sender address
        subject: 'Finish password recovery',
        template: `./recovery.hbs`, // `.hbs` extension is appended automatically
        context: {
          // ✏️ filling curly brackets with content
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
  }
}
