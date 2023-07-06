import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ISessionsRepository } from '../../../sessions/infrastructure/sessions-repository';
import { ApiConfigService } from '@common/modules/api-config/api.config.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private apiConfigService: ApiConfigService, protected securityRepository: ISessionsRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: apiConfigService.ACCESS_TOKEN_SECRET,
    });
  }

  async validate(payload: any): Promise<{ userId: string }> {
    //check if device is existed
    const foundSession = await this.securityRepository.findSessionByDeviceId(payload.deviceId);
    if (!foundSession) {
      throw new UnauthorizedException();
    }
    return { userId: payload.userId };
  }
}
