import { RegisterInputDto, registerInputDtoFieldParameters } from './register.input.dto';
import { Profile } from 'passport-google-oauth20';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';

export class RegisterFromGoogleOrGitHubInputDto extends RegisterInputDto {
  static create(profile: Profile): RegisterFromGoogleOrGitHubInputDto {
    const registerInputDto = new RegisterFromGoogleOrGitHubInputDto();

    if (profile.emails[0]) registerInputDto.email = profile.emails[0].value;
    registerInputDto.userName = registerInputDto.setUserName(profile.displayName);
    registerInputDto.password = randomStringGenerator().slice(0, registerInputDtoFieldParameters.passwordLength.max);

    return registerInputDto;
  }

  private setUserName(userName: string): string {
    //if don`t get userName from GitHub or userName length longer than needed - generate it
    if (!userName || userName.length > registerInputDtoFieldParameters.userNameLength.max) {
      userName = 'user_' + (Date.now() - new Date().setDate(0));
    }

    //if userName length shorter than needed - extend it value
    if (userName.length < registerInputDtoFieldParameters.userNameLength.min) {
      const countCorrectingSymbols = registerInputDtoFieldParameters.userNameLength.min - userName.length;
      userName = this.correctTheUserName(userName, countCorrectingSymbols);
    }

    return userName;
  }

  private correctTheUserName(userName: string, countCorrectingSymbols): string {
    userName += '_0' + '0'.repeat(countCorrectingSymbols < 3 ? 0 : countCorrectingSymbols - 2);
    return userName;
  }
}
