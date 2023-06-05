import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../../application/auth.service';
import { ApiConfigService } from '@common/modules/api-config/api.config.service';

@Injectable()
export class GoogleAuthorizationStrategy extends PassportStrategy(Strategy, 'google-authorization') {
  constructor(private apiConfigService: ApiConfigService, private readonly authService: AuthService) {
    super({
      clientID: apiConfigService.GOOGLE_CLIENT_ID,
      clientSecret: apiConfigService.GOOGLE_CLIENT_SECRET,
      callbackURL: apiConfigService.GOOGLE_AUTHORIZATION_CALLBACK_URL,
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, _refreshToken: string, profile: Profile): Promise<any> {
    const userId = await this.authService.checkCredentialsOfUserOAuth2({ providerId: profile.id });

    return { userId };
  }
}
