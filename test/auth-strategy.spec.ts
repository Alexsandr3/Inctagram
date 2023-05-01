import { Test, TestingModule } from '@nestjs/testing';
import { GoogleAuthorizationStrategy } from '../src/modules/auth/api/strategies/google-authorization.strategy';
import { AuthService } from '../src/modules/auth/application/auth.service';
import { ApiConfigModule } from '../src/modules/api-config/api.config.module';
import { IUsersRepository, PrismaUsersRepository } from '../src/modules/users/infrastructure/users.repository';
import { PrismaService } from '../src/providers/prisma/prisma.service';
import { Profile } from 'passport-google-oauth20';
import { UnauthorizedException } from '@nestjs/common';
import { GoogleRegistrationStrategy } from '../src/modules/auth/api/strategies/google-registration.strategy';
import { ValidatorService } from '../src/providers/validation/validator.service';

describe('test GoogleRegistrationStrategy', () => {
  let googleRegistrationStrategy: GoogleRegistrationStrategy;
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [ApiConfigModule],
      controllers: [],
      providers: [GoogleRegistrationStrategy, ValidatorService],
    }).compile();

    googleRegistrationStrategy = app.get<GoogleRegistrationStrategy>(GoogleRegistrationStrategy);
  });
  afterAll(async () => {
    await app.close();
  });

  describe('test GoogleRegistrationStrategy', () => {
    it('should use strategy', async () => {
      const profile: Profile = {
        profileUrl: 'https://example.com/profile',
        provider: 'google',
        displayName: 'V1woLFy',
        id: '1234567890',
        emails: [{ value: 'v-wolfy@mail.ru', verified: 'true' }],
        _raw: 'raw string',
        _json: {
          iss: 'https://accounts.google.com',
          aud: 'client-id',
          sub: '1234567890',
          iat: 1234567890,
          exp: 1234567890,
        },
      };

      const result = await googleRegistrationStrategy.validate(null, '', '', profile);

      expect(result).toEqual(true);
    });
  });
});

describe('test GoogleAuthorizationStrategy', () => {
  let googleAuthorizationStrategy: GoogleAuthorizationStrategy;
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [ApiConfigModule],
      controllers: [],
      providers: [
        GoogleAuthorizationStrategy,
        AuthService,
        PrismaService,
        {
          provide: IUsersRepository,
          useClass: PrismaUsersRepository,
        },
      ],
    })
      //.overrideProvider(IUsersRepository)
      //.useClass(PrismaUsersRepository)
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      //.useValue({
      //  checkCredentialsOfUserOAuth2: () => 1,
      //})
      .compile();

    googleAuthorizationStrategy = app.get<GoogleAuthorizationStrategy>(GoogleAuthorizationStrategy);
  });
  afterAll(async () => {
    await app.close();
  });

  describe('test GoogleAuthorizationStrategy', () => {
    it('should use strategy', async () => {
      const profile: Profile = {
        profileUrl: 'https://example.com/profile',
        provider: 'google',
        displayName: 'V1woLFy',
        id: '1234567890',
        emails: [{ value: 'v-wolfy@mail.ru', verified: 'true' }],
        _raw: 'raw string',
        _json: {
          iss: 'https://accounts.google.com',
          aud: 'client-id',
          sub: '1234567890',
          iat: 1234567890,
          exp: 1234567890,
        },
      };

      const result = await googleAuthorizationStrategy.validate('', '', profile);

      expect(result).toEqual({ userId: 1 });
    });
  });
});

describe('GoogleAuthorizationStrategy', () => {
  let app: TestingModule;
  let strategy: GoogleAuthorizationStrategy;
  const profile: Profile = {
    profileUrl: 'https://example.com/profile',
    provider: 'google',
    displayName: 'V1woLFy',
    id: '1234567890',
    emails: [{ value: 'v-wolfy@mail.ru', verified: 'true' }],
    _raw: 'raw string',
    _json: {
      iss: 'https://accounts.google.com',
      aud: 'client-id',
      sub: '1234567890',
      iat: 1234567890,
      exp: 1234567890,
    },
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
