import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvType } from './configuration';

@Injectable()
export class ApiConfigService {
  constructor(private configService: ConfigService<EnvType>) {}

  get NODE_ENV(): string {
    return this.configService.get('NODE_ENV', { infer: true });
  }

  get PORT(): number {
    return +this.configService.get('PORT', { infer: true }) || 3000;
  }

  get CURRENT_APP_BASE_URL(): string {
    return this.configService.get('CURRENT_APP_BASE_URL', { infer: true });
  }

  get DATABASE_URL(): string {
    return this.configService.get('DATABASE_URL', { infer: true });
  }

  get MAIL_USER(): string {
    return this.configService.get('MAIL_USER', { infer: true });
  }

  get MAIL_PASSWORD(): string {
    return this.configService.get('MAIL_PASSWORD', { infer: true });
  }

  get MAIL_FROM(): string {
    return this.configService.get('MAIL_FROM', { infer: true });
  }

  get CLIENT_URL(): string {
    return this.configService.get('CLIENT_URL', { infer: true });
  }

  get ACCESS_TOKEN_SECRET(): string {
    return this.configService.get('ACCESS_TOKEN_SECRET', { infer: true });
  }

  get EXPIRED_ACCESS(): string {
    return this.configService.get('EXPIRED_ACCESS', { infer: true });
  }

  get REFRESH_TOKEN_SECRET(): string {
    return this.configService.get('REFRESH_TOKEN_SECRET', { infer: true });
  }

  get EXPIRED_REFRESH(): string {
    return this.configService.get('EXPIRED_REFRESH', { infer: true });
  }

  get AWS_SECRET_ACCESS_KEY(): string {
    return this.configService.get('awsStorage.AWS_SECRET_ACCESS_KEY', { infer: true });
  }

  get AWS_ACCESS_KEY_ID(): string {
    return this.configService.get('awsStorage.AWS_ACCESS_KEY_ID', { infer: true });
  }

  get AWS_BUCKET(): string {
    return this.configService.get('awsStorage.AWS_BUCKET', { infer: true });
  }

  get AWS_ENDPOINT(): string {
    return this.configService.get('awsStorage.AWS_ENDPOINT', { infer: true });
  }

  get TOKEN_NGROK(): string {
    return this.configService.get('TOKEN_NGROK', { infer: true });
  }

  get TOKEN_TELEGRAM(): number {
    return this.configService.get('TOKEN_TELEGRAM', { infer: true });
  }

  get API_KEY_STRIPE(): string {
    return this.configService.get('API_KEY_STRIPE', { infer: true });
  }

  get SECRET_HOOK_STRIPE(): string {
    return this.configService.get('SECRET_HOOK_STRIPE', { infer: true });
  }

  get SA_LOGIN(): string {
    return this.configService.get('SA_LOGIN', { infer: true });
  }

  get SA_PASSWORD(): string {
    return this.configService.get('SA_PASSWORD', { infer: true });
  }

  get IP_RESTRICTION(): boolean {
    return this.configService.get('IP_RESTRICTION') !== false;
  }

  get RECAPTCHA_SECRET_KEY(): boolean {
    return this.configService.get('RECAPTCHA_SECRET_KEY', { infer: true });
  }
}
