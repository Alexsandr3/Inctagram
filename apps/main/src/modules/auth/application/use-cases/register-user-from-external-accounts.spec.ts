import { Test, TestingModule } from '@nestjs/testing';
import { IUsersRepository, PrismaUsersRepository } from '../../../users/infrastructure/users.repository';
import {
  RegisterUserFromExternalAccountAndAuthorizeIfNewCommand,
  RegisterUserFromExternalAccountAndAuthorizeIfNewUseCase,
} from './register-user-from-external-account-and-authorize-if-new-use.case';
import { AuthService } from '../auth.service';
import { Provider } from '../../../users/domain/external-account.entity';
import { PrismaService } from '../../../../providers/prisma/prisma.service';
import { MailManager } from '../../../../providers/mailer/application/mail-manager.service';

describe('test RegisterUserFromExternalAccountUseCase', () => {
  let registerUserFromExternalAccountUseCase: RegisterUserFromExternalAccountAndAuthorizeIfNewUseCase;
  let prismaService: PrismaService;
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [],
      controllers: [],
      providers: [
        RegisterUserFromExternalAccountAndAuthorizeIfNewUseCase,
        AuthService,
        PrismaService,
        { provide: IUsersRepository, useClass: PrismaUsersRepository },
        MailManager,
      ],
    })
      .overrideProvider(MailManager)
      .useValue({ sendMailWithSuccessRegistration: () => true, sendUserConfirmation: () => true })
      .compile();

    registerUserFromExternalAccountUseCase = app.get<RegisterUserFromExternalAccountAndAuthorizeIfNewUseCase>(
      RegisterUserFromExternalAccountAndAuthorizeIfNewUseCase,
    );
    prismaService = app.get<PrismaService>(PrismaService);
    await prismaService.user.deleteMany();
  });
  afterAll(async () => {
    await app.close();
  });

  it('should register new user by Google', async () => {
    const command: RegisterUserFromExternalAccountAndAuthorizeIfNewCommand = {
      dto: {
        email: 'test1@test.tst',
        displayName: 'dis_pN_ame___433',
        provider: Provider.GOOGLE,
        providerId: 'xxx123456',
      },
      ip: 'some ip',
      deviceName: 'some deviceName',
    };
    const result = await registerUserFromExternalAccountUseCase.executeUseCase(command);

    expect(result).toBeUndefined();
  });
  it('should add second Google account to exist user', async () => {
    const command: RegisterUserFromExternalAccountAndAuthorizeIfNewCommand = {
      dto: {
        email: 'test1@test.tst',
        displayName: 'dis_pN_ame___433n',
        provider: Provider.GOOGLE,
        providerId: 'xxx123456n',
      },
      ip: 'some ip',
      deviceName: 'some deviceName',
    };
    const result = await registerUserFromExternalAccountUseCase.executeUseCase(command);

    expect(result).toBeUndefined();
  });
});
