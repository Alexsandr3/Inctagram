import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ApiConfigService } from '../../../api-config/api.config.service';
import { ValidatorService } from '../../../../providers/validation/validator.service';
import { RegisterFromGoogleInputDto } from '../input-dto/register-from-google.input.dto';
import { Request } from 'express';

@Injectable()
export class GoogleRegistrationStrategy extends PassportStrategy(Strategy, 'google-registration') {
  constructor(private apiConfigService: ApiConfigService, private readonly validatorService: ValidatorService) {
    super({
      clientID: apiConfigService.GOOGLE_CLIENT_ID,
      clientSecret: apiConfigService.GOOGLE_CLIENT_SECRET,
      callbackURL: apiConfigService.GOOGLE_REGISTRATION_CALLBACK_URL,
      scope: ['email', 'profile'],
      passReqToCallback: true,
    });
  }

  async validate(req: Request, accessToken: string, _refreshToken: string, profile: Profile) {
    const registerInputDto = RegisterFromGoogleInputDto.create(profile);
    await this.validatorService.ValidateInstanceAndThrowError(registerInputDto);

    req.payLoad = registerInputDto;
    return true;
  }
}
