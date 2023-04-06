import { ApiConfigService } from '../../modules/api-config/api.config.service';
import { Injectable, Logger } from '@nestjs/common';
import { RecaptchaResponse } from './recaptcha-response.type';

@Injectable()
export class RecaptchaAdapter {
  private readonly logger = new Logger(RecaptchaAdapter.name);
  constructor(private readonly configService: ApiConfigService) {}

  async validateRecaptcha(recaptcha: string): Promise<RecaptchaResponse> {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${this.configService.RECAPTCHA_SECRET_KEY}&response=${recaptcha}`,
    });
    this.logger.log('Recaptcha response: ' + response);
    return response.json();
  }
}
