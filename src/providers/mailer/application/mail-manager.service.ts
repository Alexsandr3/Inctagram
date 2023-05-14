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
    const url = `${this.configService.CLIENT_URL}/auth/registration-confirmation?code=${code}`;
    const subject = 'Finish registration';
    const template = `./confirmation.html`;
    await this.emailAdapter.sendEmail(email, url, subject, template);
  }

  /**
   * Send email to user with password recovery code
   * @param email
   * @param code
   */
  async sendPasswordRecoveryMessage(email: string, code: string) {
    const url = `${this.configService.CLIENT_URL}/auth/recovery?code=${code}`;
    const subject = 'Password recovery';
    const template = `./recovery.html`;
    await this.emailAdapter.sendEmail(email, url, subject, template);
  }

  /**
   * Send email to user with success registration message
   * @param email
   */
  async sendMailWithSuccessRegistration(email: string) {
    const url = `${this.configService.CLIENT_URL}`;
    const subject = '>Welcome to Inctagram: Your Registration is Complete';
    const template = `./finished-registration.html`;
    await this.emailAdapter.sendEmail(email, url, subject, template);
  }

  /**
   * Send email to user with confirmation code for adding external account
   * @param email
   * @param code
   */
  async sendUserConfirmationCodeForExternalAccount(email: string, code: string) {
    const url = `${this.configService.CLIENT_URL}/auth/registration/external-account?code=${code}&email=${email}`;
    const subject = 'Finish registration';
    const template = `./confirmAddition.html`;
    await this.emailAdapter.sendEmail(email, url, subject, template);
  }
}
