import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ApiConfigService } from '../../../api-config/api.config.service';
import { Request } from 'express';
import { RegisterUserFromExternalAccountInputDto } from '../input-dto/register-user-from-external-account-input.dto';
import { ValidatorService } from '../../../../providers/validation/validator.service';

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
    if (!profile.emails || profile.emails.length === 0 || !profile.emails[0].value)
      throw new BadRequestException([
        {
          message: 'Can`t register user without email. Don`t get email from Google',
          field: 'email',
        },
      ]);

    if (!profile.id)
      throw new BadRequestException([
        {
          message: 'Can`t register user without Google id. Don`t get id from Google',
          field: 'Google id',
        },
      ]);

    const registerUserFromExternalAccountInputDto = RegisterUserFromExternalAccountInputDto.create(profile);
    await this.validatorService.ValidateInstanceAndThrowError(registerUserFromExternalAccountInputDto);

    req.payLoad = registerUserFromExternalAccountInputDto;
    return true;
  }
}
