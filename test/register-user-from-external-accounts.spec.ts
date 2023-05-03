import { Test, TestingModule } from '@nestjs/testing';
import { IUsersRepository, PrismaUsersRepository } from '../src/modules/users/infrastructure/users.repository';
import {
  RegisterUserFromExternalAccountCommand,
  RegisterUserFromExternalAccountUseCase,
} from '../src/modules/auth/application/use-cases/register-user-from-external-account.use-case';
import { AuthService } from '../src/modules/auth/application/auth.service';
import { Provider } from '../src/modules/users/domain/ExternalAccountEntity';
import { PrismaService } from '../src/providers/prisma/prisma.service';
import { MailManager } from '../src/providers/mailer/application/mail-manager.service';

describe('test GoogleRegistrationStrategy', () => {
  let registerUserFromExternalAccountUseCase: RegisterUserFromExternalAccountUseCase;
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [],
      controllers: [],
      providers: [
        RegisterUserFromExternalAccountUseCase,
        AuthService,
        PrismaService,
        { provide: IUsersRepository, useClass: PrismaUsersRepository },
        MailManager,
      ],
    })
      .overrideProvider(MailManager)
      .useValue({ sendMailWithSuccessRegistration: () => true, sendUserConfirmation: () => true })
      .compile();

    registerUserFromExternalAccountUseCase = app.get<RegisterUserFromExternalAccountUseCase>(
      RegisterUserFromExternalAccountUseCase,
    );
  });
  afterAll(async () => {
    await app.close();
  });

  it('should pass strategy if user not register early', async () => {
    const command: RegisterUserFromExternalAccountCommand = {
      dto: {
        email: 'test1@test.tst',
        displayName: 'dis_pN_ame___433',
        provider: Provider.GOOGLE,
        providerId: 'xxx123456',
      },
    };
    const result = await registerUserFromExternalAccountUseCase.executeUseCase(command);

    expect(result).toBeUndefined();
  });
});
