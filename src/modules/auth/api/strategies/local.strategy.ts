import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor() {
    //private readonly authService: AuthService
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<{ userId: string }> {
    const userId = '1'; //await this.authService.checkCredentialsOfUser({ email, password });
    if (!userId) throw new UnauthorizedException();

    return { userId };
  }
}
