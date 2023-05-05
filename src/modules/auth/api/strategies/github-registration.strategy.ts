import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { ApiConfigService } from '../../../api-config/api.config.service';
import { Profile } from 'passport-google-oauth20';
import { Request } from 'express';
import { RegisterUserFromExternalAccountInputDto } from '../input-dto/register-user-from-external-account-input.dto';
import { ValidatorService } from '../../../../providers/validation/validator.service';
import { AuthService } from '../../application/auth.service';

@Injectable()
export class GitHubRegistrationStrategy extends PassportStrategy(Strategy, 'github-registration') {
  constructor(
    private apiConfigService: ApiConfigService,
    private readonly validatorService: ValidatorService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: apiConfigService.GITHUB_CLIENT_ID,
      clientSecret: apiConfigService.GITHUB_CLIENT_SECRET,
      callbackURL: apiConfigService.GITHUB_REGISTRATION_CALLBACK_URL,
      userAgent: apiConfigService.CURRENT_APP_BASE_URL,
      scope: ['none'],
      passReqToCallback: true,
    });
  }

  /**
   * Check incoming data from external accounts and find user by providerId (GitHub)
   * and create input dto for register user from external account
   * @param req
   * @param accessToken
   * @param _refreshToken
   * @param profile
   */
  async validate(req: Request, accessToken: string, _refreshToken: string, profile: Profile) {
    //Checking incoming data from external accounts and find user by providerId (GitHub)
    await this.authService.checkIncomingDataFromExternalAccountAndFindUserByProviderId(profile, 'GitHub');
    //create input dto for register user from external account
    const registerUserFromExternalAccountInputDto = RegisterUserFromExternalAccountInputDto.create(profile);
    await this.validatorService.ValidateInstanceAndThrowError(registerUserFromExternalAccountInputDto);
    //set payload to request
    req.payLoad = registerUserFromExternalAccountInputDto;
    return true;
  }
}
