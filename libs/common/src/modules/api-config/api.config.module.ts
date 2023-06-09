import { Module } from '@nestjs/common';
import { ApiConfigService } from './api.config.service';
import { ConfigModule } from '@nestjs/config';
import { configuration } from './configuration';
import Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'production', 'test', 'provision').default('development'),
        PORT: Joi.number(),
        PORT_IMAGES: Joi.number(),
        PORT_PAYMENTS: Joi.number(),
        //urls of apps
        SERVER_URL_MAIN: Joi.string(),
        SERVER_URL_IMAGES: Joi.string(),
        SERVER_URL_PAYMENTS: Joi.string(),

        CORS_ORIGIN: Joi.string().required(),

        CURRENT_APP_BASE_URL: Joi.string(),

        DATABASE_URL: Joi.string().required(),

        MAIL_USER: Joi.string().required(),
        MAIL_PASSWORD: Joi.string().required(),
        MAIL_FROM: Joi.string().required(),

        CLIENT_URL: Joi.string().required(),
        SERVER_URL: Joi.string().required(),

        //ACCESS_TOKEN_SECRET: Joi.string().required(),
        //EXPIRED_ACCESS: Joi.string().required(),
        //REFRESH_TOKEN_SECRET: Joi.string().required(),
        //EXPIRED_REFRESH: Joi.string().required(),

        AWS_SECRET_ACCESS_KEY: Joi.string().required(),
        AWS_ACCESS_KEY_ID: Joi.string().required(),
        AWS_BUCKET: Joi.string().required(),
        AWS_ENDPOINT: Joi.string().required(),
        AWS_REGION: Joi.string().required(),

        GOOGLE_CLIENT_ID: Joi.string().required(),
        GOOGLE_CLIENT_SECRET: Joi.string().required(),
        GOOGLE_AUTHORIZATION_CALLBACK_URL: Joi.string().required(),
        GOOGLE_REGISTRATION_CALLBACK_URL: Joi.string().required(),

        GITHUB_CLIENT_ID: Joi.string().required(),
        GITHUB_CLIENT_SECRET: Joi.string().required(),
        GITHUB_AUTHORIZATION_CALLBACK_URL: Joi.string().required(),
        GITHUB_REGISTRATION_CALLBACK_URL: Joi.string().required(),

        TOKEN_NGROK: Joi.string(),

        //TOKEN_TELEGRAM: Joi.string(),

        API_KEY_STRIPE: Joi.string(),
        SECRET_HOOK_STRIPE: Joi.string(),

        SA_LOGIN: Joi.string().required(),
        SA_PASSWORD: Joi.string().required(),

        RECAPTCHA_SECRET_KEY: Joi.string().required(),
        RECAPTCHA_ENTERPRISE_API_KEY: Joi.string().required(),
        RECAPTCHA_ENTERPRISE_PUBLIC_SITE_KEY: Joi.string().required(),
        RECAPTCHA_ENTERPRISE_PROJECT_ID: Joi.string().required(),

        //--payments
        COST_SUBSCRIPTION: Joi.number().required(),
        STRIPE_MONTHLY_SUBSCRIPTION_PRICE_ID: Joi.string().required(),
        STRIPE_SEMIANNUAL_SUBSCRIPTION_PRICE_ID: Joi.string().required(),
        STRIPE_YEARLY_SUBSCRIPTION_PRICE_ID: Joi.string().required(),

        PAYPAL_CLIENT_ID: Joi.string().required(),
        PAYPAL_APP_SECRET: Joi.string().required(),

        IP_RESTRICTION: Joi.boolean(),
        TEST_CLIENT_URL: Joi.string(),

        GRAPHQL_PLAYGROUND: Joi.boolean(),

        RABBITMQ_URL: Joi.string().required(),
      }),
      expandVariables: true,
    }),
  ],
  providers: [ApiConfigService],
  exports: [ApiConfigService],
})
export class ApiConfigModule {}
