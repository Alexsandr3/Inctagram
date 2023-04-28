import { Profile } from 'passport-google-oauth20';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { RegisterInputDto } from './register.input.dto';

export class RegisterFromGoogleInputDto extends RegisterInputDto {
  static create(profile: Profile): RegisterFromGoogleInputDto {
    const registerInputDto = new RegisterFromGoogleInputDto();

    if (profile.emails[0]) registerInputDto.email = profile.emails[0].value;
    if (profile.displayName) registerInputDto.userName = profile.displayName;
    registerInputDto.password = randomStringGenerator().slice(0, 19);

    return registerInputDto;
  }
}
