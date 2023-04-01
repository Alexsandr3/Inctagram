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
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test', 'provision')
          .default('development'),
        PORT: Joi.number(),

        CURRENT_APP_BASE_URL: Joi.string(),

        //PGSQL_URL: Joi.string(),

        //MAIL_USER: Joi.string().required(),
        //MAIL_PASSWORD: Joi.string().required(),
        //MAIL_FROM: Joi.string().required(),

        CLIENT_URL: Joi.string().required(),

        //ACCESS_TOKEN_SECRET: Joi.string().required(),
        //EXPIRED_ACCESS: Joi.string().required(),
        //REFRESH_TOKEN_SECRET: Joi.string().required(),
        //EXPIRED_REFRESH: Joi.string().required(),

        //SECRET_ACCESS_KEY: Joi.string(),
        //ACCESS_KEY_ID: Joi.string(),
        //BUCKET: Joi.string(),
        //ENDPOINT: Joi.string(),

        //TOKEN_NGROK: Joi.string(),

        //TOKEN_TELEGRAM: Joi.string(),

        //API_KEY_STRIPE: Joi.string(),
        //SECRET_HOOK_STRIPE: Joi.string(),

        SA_LOGIN: Joi.string().required(),
        SA_PASSWORD: Joi.string().required(),

        IP_RESTRICTION: Joi.boolean(),
      }),
    }),
  ],
  providers: [ApiConfigService],
  exports: [ApiConfigService],
})
export class ApiConfigModule {}
