import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ApiConfigService } from '../../../api-config/api.config.service';
import { AuthService } from '../../application/auth.service';

@Injectable()
export class GoogleOAuthStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private apiConfigService: ApiConfigService, private readonly authService: AuthService) {
    super({
      clientID: apiConfigService.GOOGLE_CLIENT_ID,
      clientSecret: apiConfigService.GOOGLE_CLIENT_SECRET,
      callbackURL: apiConfigService.GOOGLE_CALLBACK_URL,
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, _refreshToken: string, profile: Profile): Promise<any> {
    const email = profile.emails[0];

    const userId = await this.authService.checkCredentialsOfUserOAth2({ email: email.value });
    if (!userId) throw new UnauthorizedException();

    return { userId };
  }
}
