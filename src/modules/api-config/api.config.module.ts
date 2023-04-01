import { Module } from '@nestjs/common';
import { ApiConfigService } from './api.config.service';
import { ConfigModule } from '@nestjs/config';
import { configuration } from './configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],

      // validationSchema: Joi.object({
      //   //NODE_ENV: Joi.string().valid('development', 'production', 'test', 'provision').default('development'),
      //   PORT: Joi.number(),
      //
      //   TYPEORM_USERNAME: Joi.string().required(),
      //   TYPEORM_PASSWORD: Joi.string().required(),
      //
      //   JWT_SECRET_FOR_ACCESSTOKEN: Joi.string().required(),
      //   EXPIRES_IN_TIME_OF_ACCESSTOKEN: Joi.string().required(),
      //   JWT_SECRET_FOR_REFRESHTOKEN: Joi.string().required(),
      //   EXPIRES_IN_TIME_OF_REFRESHTOKEN: Joi.string().required(),
      //
      //   SA_LOGIN: Joi.string().required(),
      //   SA_PASSWORD: Joi.string().required(),
      //
      //   EMAIL_PASSWORD: Joi.string().required(),
      //   EMAIL: Joi.string().email().required(),
      //   EMAIL_FROM: Joi.string().required(),
      //   MY_EMAIL: Joi.string().email().required(),
      //
      //   IP_RESTRICTION: Joi.boolean(),
      // }),
    }),
  ],
  providers: [ApiConfigService],
  exports: [ApiConfigService],
})
export class ApiConfigModule {}
