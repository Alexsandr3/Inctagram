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

  get CORS_ORIGIN(): string {
    return this.configService.get('CORS_ORIGIN', { infer: true });
  }

  get CURRENT_APP_BASE_URL(): string {
    return this.configService.get('dev.CURRENT_APP_BASE_URL', { infer: true });
  }

  get DATABASE_URL(): string {
    return this.configService.get('database.DATABASE_URL', { infer: true });
  }

  get MAIL_USER(): string {
    return this.configService.get('mail.MAIL_USER', { infer: true });
  }

  get MAIL_PASSWORD(): string {
    return this.configService.get('mail.MAIL_PASSWORD', { infer: true });
  }

  get MAIL_FROM(): string {
    return this.configService.get('mail.MAIL_FROM', { infer: true });
  }

  get CLIENT_URL(): string {
    return this.configService.get('CLIENT_URL', { infer: true });
  }

  get SERVER_URL(): string {
    return this.configService.get('SERVER_URL', { infer: true });
  }

  get ACCESS_TOKEN_SECRET(): string {
    return this.configService.get('auth.jwt.ACCESS_TOKEN_SECRET', { infer: true });
  }

  get EXPIRED_ACCESS(): string {
    return this.configService.get('auth.jwt.EXPIRED_ACCESS', { infer: true });
  }

  get REFRESH_TOKEN_SECRET(): string {
    return this.configService.get('auth.jwt.REFRESH_TOKEN_SECRET', { infer: true });
  }

  get EXPIRED_REFRESH(): string {
    return this.configService.get('auth.jwt.EXPIRED_REFRESH', { infer: true });
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

  get AWS_REGION(): string {
    return this.configService.get('awsStorage.AWS_REGION', { infer: true });
  }

  get GOOGLE_CLIENT_ID(): string {
    return this.configService.get('auth.google.GOOGLE_CLIENT_ID', { infer: true });
  }

  get GOOGLE_CLIENT_SECRET(): string {
    return this.configService.get('auth.google.GOOGLE_CLIENT_SECRET', { infer: true });
  }

  get GOOGLE_AUTHORIZATION_CALLBACK_URL(): string {
    return this.configService.get('auth.google.GOOGLE_AUTHORIZATION_CALLBACK_URL', { infer: true });
  }

  get GOOGLE_REGISTRATION_CALLBACK_URL(): string {
    return this.configService.get('auth.google.GOOGLE_REGISTRATION_CALLBACK_URL', { infer: true });
  }

  get GITHUB_CLIENT_ID(): string {
    return this.configService.get('auth.github.GITHUB_CLIENT_ID', { infer: true });
  }

  get GITHUB_CLIENT_SECRET(): string {
    return this.configService.get('auth.github.GITHUB_CLIENT_SECRET', { infer: true });
  }

  get GITHUB_AUTHORIZATION_CALLBACK_URL(): string {
    return this.configService.get('auth.github.GITHUB_AUTHORIZATION_CALLBACK_URL', { infer: true });
  }

  get GITHUB_REGISTRATION_CALLBACK_URL(): string {
    return this.configService.get('auth.github.GITHUB_REGISTRATION_CALLBACK_URL', { infer: true });
  }

  get TOKEN_TELEGRAM(): number {
    return this.configService.get('TOKEN_TELEGRAM', { infer: true });
  }

  get API_KEY_STRIPE(): string {
    return this.configService.get('payment.stripe.API_KEY_STRIPE', { infer: true });
  }

  get SECRET_HOOK_STRIPE(): string {
    return this.configService.get('payment.stripe.SECRET_HOOK_STRIPE', { infer: true });
  }

  get SA_LOGIN(): string {
    return this.configService.get('auth.admin.SA_LOGIN', { infer: true });
  }

  get SA_PASSWORD(): string {
    return this.configService.get('auth.admin.SA_PASSWORD', { infer: true });
  }

  get IP_RESTRICTION(): boolean {
    return this.configService.get('IP_RESTRICTION') !== false;
  }

  get RECAPTCHA_SECRET_KEY(): boolean {
    return this.configService.get('recaptcha.RECAPTCHA_SECRET_KEY', { infer: true });
  }

  get RECAPTCHA_ENTERPRISE_API_KEY(): boolean {
    return this.configService.get('recaptcha.RECAPTCHA_ENTERPRISE_API_KEY', { infer: true });
  }

  get RECAPTCHA_ENTERPRISE_PUBLIC_SITE_KEY(): boolean {
    return this.configService.get('recaptcha.RECAPTCHA_ENTERPRISE_PUBLIC_SITE_KEY', { infer: true });
  }

  get RECAPTCHA_ENTERPRISE_PROJECT_ID(): boolean {
    return this.configService.get('recaptcha.RECAPTCHA_ENTERPRISE_PROJECT_ID', { infer: true });
  }

  get TOKEN_NGROK(): string {
    return this.configService.get('dev.TOKEN_NGROK', { infer: true });
  }

  get COST_SUBSCRIPTION(): number {
    return this.configService.get('subscription.COST_SUBSCRIPTION', { infer: true });
  }
  get STRIPE_MONTHLY_SUBSCRIPTION_PRICE_ID(): string {
    return this.configService.get('subscription.stripe.STRIPE_MONTHLY_SUBSCRIPTION_PRICE_ID', { infer: true });
  }
  get STRIPE_SEMIANNUAL_SUBSCRIPTION_PRICE_ID(): string {
    return this.configService.get('subscription.stripe.STRIPE_SEMIANNUAL_SUBSCRIPTION_PRICE_ID', { infer: true });
  }
  get STRIPE_YEARLY_SUBSCRIPTION_PRICE_ID(): string {
    return this.configService.get('subscription.stripe.STRIPE_YEARLY_SUBSCRIPTION_PRICE_ID', { infer: true });
  }

  get TEST_CLIENT_URL(): string {
    return this.configService.get('dev.TEST_CLIENT_URL', { infer: true });
  }
}
