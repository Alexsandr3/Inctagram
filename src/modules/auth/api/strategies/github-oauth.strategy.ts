import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { ApiConfigService } from '../../../api-config/api.config.service';
import { Profile } from 'passport-google-oauth20';
import { AuthService } from '../../application/auth.service';

@Injectable()
export class GithubOauthStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(private apiConfigService: ApiConfigService, private readonly authService: AuthService) {
    super({
      clientID: apiConfigService.GITHUB_CLIENT_ID,
      clientSecret: apiConfigService.GITHUB_CLIENT_SECRET,
      callbackURL: apiConfigService.GITHUB_CALLBACK_URL,
      userAgent: 'google.com',
      scope: ['none'],
    });
  }

  async validate(accessToken: string, _refreshToken: string, profile: Profile): Promise<any> {
    const email = profile.emails[0];

    const userId = await this.authService.checkCredentialsOfUserOAth2({ email: email.value });
    if (!userId) throw new UnauthorizedException();

    return { userId };
  }
}
