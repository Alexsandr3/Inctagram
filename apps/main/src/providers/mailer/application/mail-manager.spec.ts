import { MailManager } from './mail-manager.service';
import { EmailAdapter } from '../email.adapter';
import { ApiConfigService } from '@common/modules/api-config/api.config.service';

describe('MailManager', () => {
  const emailAdapterMock = {
    sendEmail: jest.fn(),
  } as unknown as EmailAdapter;

  const configServiceMock = {
    CLIENT_URL: 'http://localhost:3000',
  } as ApiConfigService;

  const mailService = new MailManager(emailAdapterMock, configServiceMock);

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('sendUserConfirmation', () => {
    it('should send email with confirmation link', async () => {
      const email = 'user@example.com';
      const code = '123456';
      const expectedUrl = 'http://localhost:3000/auth/registration-confirmation?code=123456';
      const expectedSubject = 'Finish registration';
      const expectedTemplate = './confirmation.html';

      await mailService.sendUserConfirmation(email, code);

      expect(emailAdapterMock.sendEmail).toHaveBeenCalledWith(email, expectedUrl, expectedSubject, expectedTemplate);
    });
  });

  describe('sendPasswordRecoveryMessage', () => {
    it('should send email with password recovery link', async () => {
      const email = 'user@example.com';
      const code = '123456';
      const expectedUrl = 'http://localhost:3000/auth/recovery?code=123456';
      const expectedSubject = 'Password recovery';
      const expectedTemplate = './recovery.html';

      await mailService.sendPasswordRecoveryMessage(email, code);

      expect(emailAdapterMock.sendEmail).toHaveBeenCalledWith(email, expectedUrl, expectedSubject, expectedTemplate);
    });
  });
});
