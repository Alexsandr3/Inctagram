import { Profile } from 'passport-google-oauth20';
import { Provider } from '../../../users/domain/external-account.entity';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class RegisterUserFromExternalAccountInputDto {
  @IsEnum(Provider)
  provider: Provider;

  @IsString()
  @IsNotEmpty()
  providerId: string;

  @IsOptional()
  displayName?: string;

  @Matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')
  @IsEmail()
  email: string;

  static create(profile: Profile): RegisterUserFromExternalAccountInputDto {
    const registerInputDto = new RegisterUserFromExternalAccountInputDto();

    registerInputDto.provider = Provider[profile.provider?.toUpperCase()] ?? null;
    registerInputDto.providerId = profile.id;
    registerInputDto.displayName = profile.displayName;
    registerInputDto.email = profile.emails[0].value.toLowerCase();

    return registerInputDto;
  }
}
