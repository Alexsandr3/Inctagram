import { Test, TestingModule } from '@nestjs/testing';
import { GoogleAuthorizationStrategy } from './google-authorization.strategy';
import { AuthService } from '../../application/auth.service';
import { ApiConfigModule } from '../../../api-config/api.config.module';
import { Profile } from 'passport-google-oauth20';
import { UnauthorizedException } from '@nestjs/common';
import { IUsersRepository, PrismaUsersRepository } from '../../../users/infrastructure/users.repository';
import { UserEntity } from '../../../users/domain/user.entity';
import { ExternalAccountEntity } from '../../../users/domain/ExternalAccountEntity';

describe('test GoogleAuthorizationStrategy', () => {
  let app: TestingModule;
  let strategy: GoogleAuthorizationStrategy;
  let usersRepository: IUsersRepository;
  const profile: Profile = {
    id: '1234567890',
    displayName: 'SuperTester',
    emails: [{ value: 'test@int.tst', verified: 'true' }],
    provider: 'google',
    profileUrl: null,
    _raw: null,
    _json: null,
  };

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [ApiConfigModule],
      providers: [
        GoogleAuthorizationStrategy,
        AuthService,
        { provide: IUsersRepository, useClass: PrismaUsersRepository },
      ],
    })
      .overrideProvider(IUsersRepository)
      .useValue({
        findUserByProviderId: () => {
          const user = new UserEntity();
          const externalAccount = new ExternalAccountEntity();
          user.id = 1;
          externalAccount.providerId = profile.id;
          externalAccount.isConfirmed = true;
          user.externalAccounts = [externalAccount];
          return user;
        },
      })
      .compile();

    strategy = app.get<GoogleAuthorizationStrategy>(GoogleAuthorizationStrategy);
    usersRepository = app.get<IUsersRepository>(IUsersRepository);
  });
  afterAll(async () => {
    await app.close();
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('should validate the user with valid access token, refreshToken and profile', async () => {
    const result = await strategy.validate('validAccessToken', 'validRefreshToken', profile);
    expect(result).toEqual({ userId: expect.any(Number) });
  });
  it('should throw UnauthorizedException when user is not exist', async () => {
    jest.spyOn(usersRepository, 'findUserByProviderId').mockResolvedValueOnce(null);
    await expect(strategy.validate('invalidAccessToken', 'invalidRefreshToken', profile)).rejects.toThrow(
      UnauthorizedException,
    );
  });
  it('should throw UnauthorizedException when user is not confirm added account', async () => {
    jest.spyOn(usersRepository, 'findUserByProviderId').mockImplementation(async () => {
      const user = new UserEntity();
      const externalAccount = new ExternalAccountEntity();
      user.id = 1;
      externalAccount.providerId = profile.id;
      externalAccount.isConfirmed = false;
      user.externalAccounts = [externalAccount];
      return user;
    });
    await expect(strategy.validate('invalidAccessToken', 'invalidRefreshToken', profile)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException when accessToken, refreshToken and profile are not present', async () => {
    await expect(strategy.validate(null, null, null)).rejects.toThrow(TypeError);
  });
});
