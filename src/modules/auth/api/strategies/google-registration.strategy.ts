import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ApiConfigService } from '../../../api-config/api.config.service';
import { Request } from 'express';
import { RegisterUserFromExternalAccountInputDto } from '../input-dto/register-user-from-external-account-input.dto';
import { ValidatorService } from '../../../../providers/validation/validator.service';
import { AuthService } from '../../application/auth.service';

@Injectable()
export class GoogleRegistrationStrategy extends PassportStrategy(Strategy, 'google-registration') {
  constructor(
    private apiConfigService: ApiConfigService,
    private readonly validatorService: ValidatorService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: apiConfigService.GOOGLE_CLIENT_ID,
      clientSecret: apiConfigService.GOOGLE_CLIENT_SECRET,
      callbackURL: apiConfigService.GOOGLE_REGISTRATION_CALLBACK_URL,
      scope: ['email', 'profile'],
      passReqToCallback: true,
    });
  }

  /**
   * Check incoming data from external accounts and find user by providerId (Google)
   * and create input dto for register user from external account
   * @param req
   * @param accessToken
   * @param _refreshToken
   * @param profile
   */
  async validate(req: Request, accessToken: string, _refreshToken: string, profile: Profile) {
    //Checking incoming data from external accounts and find user by providerId (Google)
    await this.authService.checkIncomingDataFromExternalAccountAndFindUserByProviderId(profile, 'Google');
    //create input dto for register user from external account
    const registerUserFromExternalAccountInputDto = RegisterUserFromExternalAccountInputDto.create(profile);
    await this.validatorService.ValidateInstanceAndThrowError(registerUserFromExternalAccountInputDto);
    //set payload to request
    req.payLoad = registerUserFromExternalAccountInputDto;
    return true;
  }
}
