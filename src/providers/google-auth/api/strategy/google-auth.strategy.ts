import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable, Logger } from '@nestjs/common';
import { ApiConfigService } from '../../../../modules/api-config/api.config.service';
import { GoogleUserType } from '../../types/google-user.type';
import { IUsersRepository } from '../../../../modules/users/infrastructure/users.repository';

@Injectable()
export class GoogleAuthStrategy extends PassportStrategy(Strategy, 'google') {
  private readonly logger = new Logger(GoogleAuthStrategy.name);
  constructor(private apiConfigService: ApiConfigService, private readonly usersRepository: IUsersRepository) {
    super({
      clientID: apiConfigService.GOOGLE_CLIENT_ID,
      clientSecret: apiConfigService.GOOGLE_CLIENT_SECRET,
      callbackURL: apiConfigService.GOOGLE_CALLBACK_URL,
      scope: ['email', 'profile'],
    });
  }
  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    const { name, emails, photos } = profile;
    const foundUser = await this.usersRepository.findUserByEmail(emails[0].value);
    if (!foundUser) {
      this.logger.log(`User with email ${emails[0].value} not found`);
      return done(null, false);
    }
    const user: GoogleUserType = {
      userId: foundUser.id,
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      accessToken,
    };
    done(null, user);
  }
}
