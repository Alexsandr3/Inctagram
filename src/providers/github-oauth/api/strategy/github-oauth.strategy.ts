import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { ApiConfigService } from '../../../../modules/api-config/api.config.service';
import { IUsersRepository } from '../../../../modules/users/infrastructure/users.repository';
import { VerifyCallback } from 'passport-google-oauth20';
import { GithubProfileType, GithubUserType } from '../../types/github-user.type';

@Injectable()
export class GithubOauthStrategy extends PassportStrategy(Strategy, 'github') {
  private readonly logger = new Logger(GithubOauthStrategy.name);
  constructor(private apiConfigService: ApiConfigService, private readonly usersRepository: IUsersRepository) {
    super({
      clientID: apiConfigService.GITHUB_CLIENT_ID,
      clientSecret: apiConfigService.GITHUB_CLIENT_SECRET,
      callbackURL: apiConfigService.GITHUB_CALLBACK_URL,
      scope: ['public_profile'],
    });
  }

  async validate(
    accessToken: string,
    _refreshToken: string,
    profile: GithubProfileType,
    done: VerifyCallback,
  ): Promise<any> {
    const { username, photos } = profile;
    //need search user by username
    const foundUser = await this.usersRepository.findUserByEmail(username);
    if (!foundUser) {
      this.logger.log(`User with email ${username} not found`);
      return done(null, false);
    }
    const user: GithubUserType = {
      userId: foundUser.id,
      email: 'username',
      provider: profile.provider,
      userName: username,
      picture: photos[0].value,
      accessToken,
    };
    done(null, user);
  }
}
