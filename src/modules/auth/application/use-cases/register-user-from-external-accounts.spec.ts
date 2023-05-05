import { Test, TestingModule } from '@nestjs/testing';
import { IUsersRepository, PrismaUsersRepository } from '../../../users/infrastructure/users.repository';
import {
  RegisterUserFromExternalAccountCommand,
  RegisterUserFromExternalAccountUseCase,
} from './register-user-from-external-account.use-case';
import { AuthService } from '../auth.service';
import { Provider } from '../../../users/domain/ExternalAccountEntity';
import { PrismaService } from '../../../../providers/prisma/prisma.service';
import { MailManager } from '../../../../providers/mailer/application/mail-manager.service';

describe('test RegisterUserFromExternalAccountUseCase', () => {
  let registerUserFromExternalAccountUseCase: RegisterUserFromExternalAccountUseCase;
  let prismaService: PrismaService;
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
    prismaService = app.get<PrismaService>(PrismaService);
    await prismaService.user.deleteMany();
  });
  afterAll(async () => {
    await app.close();
  });

  it('should register new user by Google', async () => {
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
  it('should add second Google account to exist user', async () => {
    const command: RegisterUserFromExternalAccountCommand = {
      dto: {
        email: 'test1@test.tst',
        displayName: 'dis_pN_ame___433n',
        provider: Provider.GOOGLE,
        providerId: 'xxx123456n',
      },
    };
    const result = await registerUserFromExternalAccountUseCase.executeUseCase(command);

    expect(result).toBeUndefined();
  });
});
