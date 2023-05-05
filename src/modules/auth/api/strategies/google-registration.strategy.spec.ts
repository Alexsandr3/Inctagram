import { Test, TestingModule } from '@nestjs/testing';
import { ApiConfigModule } from '../../../api-config/api.config.module';
import { BadRequestException } from '@nestjs/common';
import { GoogleRegistrationStrategy } from './google-registration.strategy';
import { ValidatorService } from '../../../../providers/validation/validator.service';
import { PrismaService } from '../../../../providers/prisma/prisma.service';

describe('test GoogleRegistrationStrategy', () => {
  let googleRegistrationStrategy: GoogleRegistrationStrategy;
  let app: TestingModule;
  const profile: any = {
    id: '1234567890',
    displayName: 'SuperTester',
    emails: [{ value: 'test@int.tst', verified: 'true' }],
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
      providers: [GoogleRegistrationStrategy, ValidatorService, PrismaService],
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
  it('should pass strategy with full data', async () => {
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
      emails: [{ value: 'test@int.tst', verified: 'true' }],
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
