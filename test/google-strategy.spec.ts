import { Test, TestingModule } from '@nestjs/testing';
import { GoogleAuthorizationStrategy } from '../src/modules/auth/api/strategies/google-authorization.strategy';
import { AuthService } from '../src/modules/auth/application/auth.service';
import { ApiConfigModule } from '../src/modules/api-config/api.config.module';
import { IUsersRepository, PrismaUsersRepository } from '../src/modules/users/infrastructure/users.repository';
import { Profile } from 'passport-google-oauth20';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { GoogleRegistrationStrategy } from '../src/modules/auth/api/strategies/google-registration.strategy';
import { ValidatorService } from '../src/providers/validation/validator.service';
import { UserEntity } from '../src/modules/users/domain/user.entity';
import { PrismaService } from '../src/providers/prisma/prisma.service';

describe('test GoogleRegistrationStrategy', () => {
  let googleRegistrationStrategy: GoogleRegistrationStrategy;
  let app: TestingModule;
  const profile: any = {
    id: '1234567890',
    displayName: 'SuperTester',
    emails: [{ value: 'test@test.tst', verified: 'true' }],
    provider: 'google',
    profileUrl: 'https://example.com/profile',
    _raw: 'raw string',
    _json: {
      iss: 'https://accounts.google.com',
      aud: 'client-id',
      sub: '1234567890',
      iat: 1234567890,
      exp: 1234567890,
    },
  };
  let req: any = {};

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [ApiConfigModule],
      controllers: [],
      providers: [
        GoogleRegistrationStrategy,
        ValidatorService,
        PrismaService,
        { provide: IUsersRepository, useClass: PrismaUsersRepository },
      ],
    }).compile();

    googleRegistrationStrategy = app.get<GoogleRegistrationStrategy>(GoogleRegistrationStrategy);
  });
  afterAll(async () => {
    await app.close();
  });
  beforeEach(() => {
    req = {};
  });

  it('shouldn`t pass strategy if don`t get email', async () => {
    await expect(googleRegistrationStrategy.validate(req, '', '', { ...profile, emails: null })).rejects.toThrow(
      BadRequestException,
    );

    await expect(googleRegistrationStrategy.validate(req, '', '', { ...profile, emails: '' })).rejects.toThrow(
      BadRequestException,
    );

    await expect(
      googleRegistrationStrategy.validate(req, '', '', { ...profile, emails: [{ value: '' }] }),
    ).rejects.toThrow(BadRequestException);

    await expect(
      googleRegistrationStrategy.validate(req, '', '', { ...profile, emails: [{ value: 'qwerty' }] }),
    ).rejects.toThrow(BadRequestException);

    await expect(
      googleRegistrationStrategy.validate(req, '', '', { ...profile, emails: [{ value: undefined }] }),
    ).rejects.toThrow(BadRequestException);
  });
  it('shouldn`t pass strategy if don`t get provider', async () => {
    await expect(googleRegistrationStrategy.validate(req, '', '', { ...profile, provider: undefined })).rejects.toThrow(
      BadRequestException,
    );
    await expect(googleRegistrationStrategy.validate(req, '', '', { ...profile, provider: null })).rejects.toThrow(
      BadRequestException,
    );
    await expect(googleRegistrationStrategy.validate(req, '', '', { ...profile, provider: '' })).rejects.toThrow(
      BadRequestException,
    );
    await expect(googleRegistrationStrategy.validate(req, '', '', { ...profile, provider: 'google1' })).rejects.toThrow(
      BadRequestException,
    );
  });
  it('shouldn`t pass strategy if don`t get providerId', async () => {
    await expect(googleRegistrationStrategy.validate(req, '', '', { ...profile, id: null })).rejects.toThrow(
      BadRequestException,
    );
    await expect(googleRegistrationStrategy.validate(req, '', '', { ...profile, id: '' })).rejects.toThrow(
      BadRequestException,
    );
    await expect(googleRegistrationStrategy.validate(req, '', '', { ...profile, id: 1 })).rejects.toThrow(
      BadRequestException,
    );
  });
  it('shouldn`t pass strategy if user is already registered', async () => {
    jest
      .spyOn(googleRegistrationStrategy['usersRepository'], 'findUserByProviderId')
      .mockResolvedValueOnce(new UserEntity());
    await expect(googleRegistrationStrategy.validate(req, '', '', profile)).rejects.toThrow(BadRequestException);
  });
  it('should pass strategy if user not register early', async () => {
    const result = await googleRegistrationStrategy.validate(req, '', '', profile);

    expect(req.payLoad).toEqual({
      provider: profile.provider.toUpperCase(),
      providerId: profile.id,
      displayName: profile.displayName,
      email: profile.emails[0].value,
    });
    expect(result).toEqual(true);
  });
  it('should pass strategy if user not register early (transform email upper case)', async () => {
    const result = await googleRegistrationStrategy.validate(req, '', '', {
      ...profile,
      emails: [{ value: profile.emails[0].value.toUpperCase() }],
    });

    expect(req.payLoad).toEqual({
      provider: profile.provider.toUpperCase(),
      providerId: profile.id,
      displayName: profile.displayName,
      email: profile.emails[0].value,
    });
    expect(result).toEqual(true);
  });
  it('should pass strategy if user not register early and don`t get displayName', async () => {
    const profile: any = {
      id: '1234567890',
      emails: [{ value: 'test@test.tst', verified: 'true' }],
      provider: 'google',
      profileUrl: 'https://example.com/profile',
      _raw: 'raw string',
      _json: {
        iss: 'https://accounts.google.com',
        aud: 'client-id',
        sub: '1234567890',
        iat: 1234567890,
        exp: 1234567890,
      },
    };
    const result = await googleRegistrationStrategy.validate(req, '', '', profile);

    expect(req.payLoad).toEqual({
      provider: profile.provider.toUpperCase(),
      providerId: profile.id,
      displayName: undefined,
      email: profile.emails[0].value,
    });
    expect(result).toEqual(true);
  });
});

describe('GoogleAuthorizationStrategy', () => {
  let app: TestingModule;
  let strategy: GoogleAuthorizationStrategy;
  const profile: Profile = {
    id: '1234567890',
    displayName: 'SuperTester',
    emails: [{ value: 'test@test.tst', verified: 'true' }],
    provider: 'google',
    profileUrl: null,
    _raw: null,
    _json: null,
  };

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [ApiConfigModule],
      providers: [GoogleAuthorizationStrategy, AuthService],
    })
      .overrideProvider(AuthService)
      .useValue({
        checkCredentialsOfUserOAuth2: () => 1,
      })
      .compile();

    strategy = app.get<GoogleAuthorizationStrategy>(GoogleAuthorizationStrategy);
  });
  afterAll(async () => {
    await app.close();
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('should validate the user with valid access token, refreshToken and profile', async () => {
    const mockUserId = 1;
    jest.spyOn(strategy['authService'], 'checkCredentialsOfUserOAuth2').mockResolvedValueOnce(mockUserId);
    const result = await strategy.validate('validAccessToken', 'validRefreshToken', profile);
    expect(result).toEqual({ userId: mockUserId });
  });
  it('should throw UnauthorizedException when user is not valid', async () => {
    jest.spyOn(strategy['authService'], 'checkCredentialsOfUserOAuth2').mockResolvedValueOnce(null);
    await expect(strategy.validate('invalidAccessToken', 'invalidRefreshToken', profile)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException when accessToken, refreshToken and profile are not present', async () => {
    await expect(strategy.validate(null, null, null)).rejects.toThrow(TypeError);
  });
});
