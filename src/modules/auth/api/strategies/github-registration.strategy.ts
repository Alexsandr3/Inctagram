import { BadRequestException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { ApiConfigService } from '../../../api-config/api.config.service';
import { Profile } from 'passport-google-oauth20';
import { Request } from 'express';
import { RegisterUserFromExternalAccountInputDto } from '../input-dto/register-user-from-external-account-input.dto';
import { ValidatorService } from '../../../../providers/validation/validator.service';

@Injectable()
export class GitHubRegistrationStrategy extends PassportStrategy(Strategy, 'github-registration') {
  constructor(private apiConfigService: ApiConfigService, private readonly validatorService: ValidatorService) {
    super({
      clientID: apiConfigService.GITHUB_CLIENT_ID,
      clientSecret: apiConfigService.GITHUB_CLIENT_SECRET,
      callbackURL: apiConfigService.GITHUB_REGISTRATION_CALLBACK_URL,
      userAgent: apiConfigService.CURRENT_APP_BASE_URL,
      scope: ['none'],
      passReqToCallback: true,
    });
  }

  async validate(req: Request, accessToken: string, _refreshToken: string, profile: Profile) {
    if (!profile.emails || profile.emails.length === 0 || !profile.emails[0].value)
      throw new BadRequestException([
        {
          message: 'Can`t register user without email. Don`t get email from GitHub',
          field: 'email',
        },
      ]);

    if (!profile.id)
      throw new BadRequestException([
        {
          message: 'Can`t register user without GitHub id. Don`t get id from GitHub',
          field: 'GitHub id',
        },
      ]);

    const registerUserFromExternalAccountInputDto = RegisterUserFromExternalAccountInputDto.create(profile);
    await this.validatorService.ValidateInstanceAndThrowError(registerUserFromExternalAccountInputDto);

    req.payLoad = registerUserFromExternalAccountInputDto;
    return true;
  }
}
