import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';
import { MailerService } from '@nestjs-modules/mailer';
import { ApiConfigService } from '../../../modules/api-config/api.config.service';

describe('MailService', () => {
  let mailService: MailService;
  let mailerService: MailerService;
  let configService: ApiConfigService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        {
          provide: MailerService,
          useValue: {
            sendMail: jest.fn(),
          },
        },
        {
          provide: ApiConfigService,
          useValue: {
            CLIENT_URL: 'http://localhost:3000',
            MAIL_FROM: 'test@example.com',
          },
        },
      ],
    }).compile();

    mailService = moduleRef.get<MailService>(MailService);
    mailerService = moduleRef.get<MailerService>(MailerService);
    configService = moduleRef.get<ApiConfigService>(ApiConfigService);
  });

  it('should be defined', () => {
    console.log('unit-----------');
    expect(mailService).toBeDefined();
  });

  describe('sendUserConfirmation', () => {
    it('should send email with correct template and context', async () => {
      const email = 'test@example.com';
      const code = '123456';

      await mailService.sendUserConfirmation(email, code);

      expect(mailerService.sendMail).toBeCalledWith({
        to: email,
        from: configService.MAIL_FROM,
        subject: 'Finish registration',
        template: `./confirmation.hbs`,
        context: {
          name: email,
          url: `${configService.CLIENT_URL}/registration-confirmation?code=${code}`,
        },
      });
    });
  });

  describe('sendPasswordRecoveryMessage', () => {
    it('should send email with correct template and context', async () => {
      const email = 'test@example.com';
      const code = '123456';

      await mailService.sendPasswordRecoveryMessage(email, code);

      expect(mailerService.sendMail).toBeCalledWith({
        to: email,
        from: configService.MAIL_FROM,
        subject: 'Password recovery',
        template: `./recovery.hbs`,
        context: {
          name: email,
          url: `${configService.CLIENT_URL}/new-password?code=${code}`,
        },
      });
    });
  });

  describe('sendEmailRecoveryMessage', () => {
    it('should send email with correct template and context', async () => {
      const email = 'test@example.com';
      const code = '123456';

      await mailService.sendEmailRecoveryMessage(email, code);

      expect(mailerService.sendMail).toBeCalledWith({
        to: email,
        from: configService.MAIL_FROM,
        subject: 'Finish password recovery',
        template: `./recovery.hbs`,
        context: {
          name: email,
          url: `${configService.CLIENT_URL}/registration-confirmation?code=${code}`,
        },
      });
    });
  });
});
