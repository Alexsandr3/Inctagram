import { BadRequestException, CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { RecaptchaResponse } from './recaptcha.response.type';
import { GoogleRecaptchaNetwork } from './enums/google-recaptcha-network';
import { ApiConfigService } from '@common/modules/api-config/api.config.service';

@Injectable()
export class GoogleRecaptchaGuard implements CanActivate {
  private readonly logger = new Logger(GoogleRecaptchaGuard.name);
  constructor(private readonly configService: ApiConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { recaptcha } = request.body;
    if (!recaptcha) return false;
    const url = GoogleRecaptchaNetwork.Google;
    const response = await axios.post(`${url}?response=${recaptcha}&secret=${this.configService.RECAPTCHA_SECRET_KEY}`);
    const data: RecaptchaResponse = response.data;
    if (data.success) return true;
    this.logger.log('Recaptcha response: ', data['error-codes']);
    throw new BadRequestException([{ message: 'Recaptcha is not valid', field: 'recaptcha' }]);
  }
}
