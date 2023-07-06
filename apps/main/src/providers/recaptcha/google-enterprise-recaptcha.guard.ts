import { BadRequestException, CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { GoogleRecaptchaNetwork } from './enums/google-recaptcha-network';
import axios from 'axios';
import { RecaptchaEnterpriseResponse } from './recaptcha-enterprise.response';
import { ApiConfigService } from '@common/modules/api-config/api.config.service';

@Injectable()
export class GoogleEnterpriseRecaptchaGuard implements CanActivate {
  private readonly logger = new Logger(GoogleEnterpriseRecaptchaGuard.name);
  constructor(private readonly configService: ApiConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { recaptcha } = request.body;
    if (!recaptcha) return false;
    const url = GoogleRecaptchaNetwork.GoogleEnterprise;
    const response = await axios.post(
      `${url}${this.configService.RECAPTCHA_ENTERPRISE_PROJECT_ID}/assessments?key=${this.configService.RECAPTCHA_ENTERPRISE_API_KEY}`,
      {
        event: {
          token: recaptcha,
          siteKey: this.configService.RECAPTCHA_ENTERPRISE_PUBLIC_SITE_KEY,
          expectedAction: 'password_reset',
        },
      },
    );
    const data: RecaptchaEnterpriseResponse = response.data;
    if (data.tokenProperties.valid) return true;
    this.logger.log('Recaptcha response: ', JSON.stringify(data));
    throw new BadRequestException([{ message: 'Recaptcha is not valid', field: 'recaptcha' }]);
  }
}
