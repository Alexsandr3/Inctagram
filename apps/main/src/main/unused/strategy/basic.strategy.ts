import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { BasicStrategy as Strategy } from 'passport-http';
import { ApiConfigService } from '@common/modules/api-config/api.config.service';

@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy) {
  constructor(private apiConfigService: ApiConfigService) {
    super();
  }

  async validate(userName: string, password: string) {
    console.log('BasicStrategy.validate', userName, password);
    if (userName !== this.apiConfigService.SA_LOGIN || password !== this.apiConfigService.SA_PASSWORD)
      throw new UnauthorizedException();
    return true;
  }
}
