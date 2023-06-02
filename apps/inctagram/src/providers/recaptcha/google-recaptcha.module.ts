import { Module } from '@nestjs/common';
import { RecaptchaAdapter } from './recaptcha.adapter';
import { ApiConfigModule } from '../../modules/api-config/api.config.module';

@Module({
  imports: [ApiConfigModule],
  providers: [RecaptchaAdapter],
  exports: [RecaptchaAdapter],
})
export class GoogleRecaptchaModule {}
