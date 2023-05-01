import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { ApiConfigService } from '../../../api-config/api.config.service';
import { Profile } from 'passport-google-oauth20';
import { Request } from 'express';
import { RegisterFromGoogleOrGitHubInputDto } from '../input-dto/register-from-google-or-github.input.dto';
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

  async validate(req: Request, accessToken: string, _refreshToken: string, profile: Profile): Promise<any> {
    const registerInputDto = RegisterFromGoogleOrGitHubInputDto.create(profile);
    await this.validatorService.ValidateInstanceAndThrowError(registerInputDto);

    req.payLoad = registerInputDto;
    return true;
  }
}
