import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ApiConfigService } from '../../../api-config/api.config.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private apiConfigService: ApiConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: apiConfigService.ACCESS_TOKEN_SECRET,
    });
  }

  async validate(payload: any): Promise<{ userId: string }> {
    return { userId: payload.userId };
  }
}
