import { Injectable } from '@nestjs/common';
import { ApiConfigService } from '../../../modules/api-config/api.config.service';
import { EmailAdapter } from '../email.adapter';

@Injectable()
export class MailManager {
  constructor(private readonly emailAdapter: EmailAdapter, private readonly configService: ApiConfigService) {}

  /**
   * Send email to user with confirmation code
   * @param email
   * @param code
   */
  async sendUserConfirmation(email: string, code: string) {
    const url = `${this.configService.CLIENT_URL}/registration-confirmation?code=${code}`;
    const subject = 'Finish registration';
    const template = `./confirmation.hbs`;
    await this.emailAdapter.sendEmail(email, url, subject, template);
  }

  /**
   * Send email to user with password recovery code
   * @param email
   * @param code
   */
  async sendPasswordRecoveryMessage(email: string, code: string) {
    const url = `${this.configService.CLIENT_URL}/new-password?code=${code}`;
    const subject = 'Password recovery';
    const template = `./recovery.hbs`;
    await this.emailAdapter.sendEmail(email, url, subject, template);
  }

  /**
   * Send email to user with password recovery code
   * @param email
   * @param code
   */
  async sendEmailRecoveryMessage(email: string, code: string) {
    const url = `${this.configService.CLIENT_URL}/registration-confirmation?code=${code}`;
    const subject = 'Email recovery';
    const template = `./recovery.hbs`;
    await this.emailAdapter.sendEmail(email, url, subject, template);
  }
}
