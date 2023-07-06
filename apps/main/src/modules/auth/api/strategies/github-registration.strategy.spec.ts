import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { ValidatorService } from '../../validator.service';
import { PrismaService } from '@common/modules/prisma/prisma.service';
import { GitHubRegistrationStrategy } from './github-registration.strategy';
import { AuthService } from '../../application/auth.service';
import { IUsersRepository, PrismaUsersRepository } from '../../../users/infrastructure/users.repository';
import { ApiConfigModule } from '@common/modules/api-config/api.config.module';

describe('test GitHubRegistrationStrategy', () => {
  let gitHubRegistrationStrategy: GitHubRegistrationStrategy;
  let app: TestingModule;
  const profile: any = {
    id: '1234567890',
    displayName: 'SuperTester',
    emails: [{ value: 'test@int.tst', verified: 'true' }],
    provider: 'github',
    profileUrl: 'https://example.com/profile',
    _raw: 'raw string',
    _json: {
      iss: 'https://accounts.github.com',
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
        GitHubRegistrationStrategy,
        ValidatorService,
        PrismaService,
        AuthService,
        { provide: IUsersRepository, useClass: PrismaUsersRepository },
      ],
    }).compile();

    gitHubRegistrationStrategy = app.get<GitHubRegistrationStrategy>(GitHubRegistrationStrategy);
  });
  afterAll(async () => {
    await app.close();
  });
  beforeEach(() => {
    req = {};
  });

  it('shouldn`t pass strategies if don`t get email', async () => {
    await expect(gitHubRegistrationStrategy.validate(req, '', '', { ...profile, emails: null })).rejects.toThrow(
      BadRequestException,
    );

    await expect(gitHubRegistrationStrategy.validate(req, '', '', { ...profile, emails: '' })).rejects.toThrow(
      BadRequestException,
    );

    await expect(
      gitHubRegistrationStrategy.validate(req, '', '', { ...profile, emails: [{ value: '' }] }),
    ).rejects.toThrow(BadRequestException);

    await expect(
      gitHubRegistrationStrategy.validate(req, '', '', { ...profile, emails: [{ value: 'qwerty' }] }),
    ).rejects.toThrow(BadRequestException);

    await expect(
      gitHubRegistrationStrategy.validate(req, '', '', { ...profile, emails: [{ value: undefined }] }),
    ).rejects.toThrow(BadRequestException);
  });
  it('shouldn`t pass strategies if don`t get provider', async () => {
    await expect(gitHubRegistrationStrategy.validate(req, '', '', { ...profile, provider: undefined })).rejects.toThrow(
      BadRequestException,
    );
    await expect(gitHubRegistrationStrategy.validate(req, '', '', { ...profile, provider: null })).rejects.toThrow(
      BadRequestException,
    );
    await expect(gitHubRegistrationStrategy.validate(req, '', '', { ...profile, provider: '' })).rejects.toThrow(
      BadRequestException,
    );
    await expect(gitHubRegistrationStrategy.validate(req, '', '', { ...profile, provider: 'google1' })).rejects.toThrow(
      BadRequestException,
    );
  });
  it('shouldn`t pass strategies if don`t get providerId', async () => {
    await expect(gitHubRegistrationStrategy.validate(req, '', '', { ...profile, id: null })).rejects.toThrow(
      BadRequestException,
    );
    await expect(gitHubRegistrationStrategy.validate(req, '', '', { ...profile, id: '' })).rejects.toThrow(
      BadRequestException,
    );
    await expect(gitHubRegistrationStrategy.validate(req, '', '', { ...profile, id: 1 })).rejects.toThrow(
      BadRequestException,
    );
  });
  it('should pass strategies with full data', async () => {
    const result = await gitHubRegistrationStrategy.validate(req, '', '', profile);

    expect(req.payLoad).toEqual({
      provider: profile.provider.toUpperCase(),
      providerId: profile.id,
      displayName: profile.displayName,
      email: profile.emails[0].value,
    });
    expect(result).toEqual(true);
  });
  it('should pass strategies if user not register early (transform email upper case)', async () => {
    const result = await gitHubRegistrationStrategy.validate(req, '', '', {
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
  it('should pass strategies if user not register early and don`t get displayName', async () => {
    const profile: any = {
      id: '1234567890',
      emails: [{ value: 'test@int.tst', verified: 'true' }],
      provider: 'github',
      profileUrl: 'https://example.com/profile',
      _raw: 'raw string',
      _json: {
        iss: 'https://accounts.github.com',
        aud: 'client-id',
        sub: '1234567890',
        iat: 1234567890,
        exp: 1234567890,
      },
    };
    const result = await gitHubRegistrationStrategy.validate(req, '', '', profile);

    expect(req.payLoad).toEqual({
      provider: profile.provider.toUpperCase(),
      providerId: profile.id,
      displayName: undefined,
      email: profile.emails[0].value,
    });
    expect(result).toEqual(true);
  });
});
