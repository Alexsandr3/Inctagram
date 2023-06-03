import { EmailAdapter } from './email.adapter';
import { MailerService } from '@nestjs-modules/mailer';
import { ApiConfigService } from '@common/modules/api-config/api.config.service';

describe('EmailAdapter', () => {
  const mailerServiceMock = {
    sendMail: jest.fn(),
  } as unknown as MailerService;

  const configServiceMock = {
    MAIL_FROM: 'support@example.com',
  } as ApiConfigService;

  const emailAdapter = new EmailAdapter(mailerServiceMock, configServiceMock);

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('sendEmail', () => {
    it('should send email with the correct data', async () => {
      const email = 'user@example.com';
      const url = 'http://localhost:3000/auth/registration-confirmation?code=123456';
      const subject = 'Finish registration';
      const template = './confirmation.html';
      const expectedFrom = 'support@example.com';
      const expectedContext = { name: email, url };

      await emailAdapter.sendEmail(email, url, subject, template);

      expect(mailerServiceMock.sendMail).toHaveBeenCalledWith({
        to: email,
        from: expectedFrom,
        subject,
        template,
        context: expectedContext,
      });
    });
  });
});
