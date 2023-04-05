import { ApiConfigService } from '../../modules/api-config/api.config.service';
import { Injectable } from '@nestjs/common';
import { RecaptchaResponse } from './recaptcha-response.type';

@Injectable()
export class RecaptchaAdapter {
  constructor(private readonly recaptcha: string, private readonly configService: ApiConfigService) {}

  async requestGoogle(recaptcha: string) {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${this.configService.RECAPTCHA_SECRET_KEY}&response=${recaptcha}`,
    });
    const result: RecaptchaResponse = await response.json();
    return result;
  }
}
