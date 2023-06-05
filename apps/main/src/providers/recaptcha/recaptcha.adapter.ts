import { Injectable, Logger } from '@nestjs/common';
import { RecaptchaResponse } from './recaptcha.response.type';
import axios from 'axios';
import { ApiConfigService } from '@common/modules/api-config/api.config.service';

@Injectable()
export class RecaptchaAdapter {
  private readonly logger = new Logger(RecaptchaAdapter.name);
  constructor(private readonly configService: ApiConfigService) {}

  async validateRecaptcha(recaptcha: string): Promise<RecaptchaResponse> {
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?response=${recaptcha}&secret=${this.configService.RECAPTCHA_SECRET_KEY}`,
    );
    this.logger.log('Recaptcha response: ', response.data);
    return response.data;
  }
}
