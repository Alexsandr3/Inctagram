import { Module } from '@nestjs/common';
import { GoogleOAuthStrategy } from './api/strategy/google-oauth.strategy';
import { ApiConfigModule } from '../../modules/api-config/api.config.module';
import { CqrsModule } from '@nestjs/cqrs';
import { GoogleOAuthController } from './api/google-oauth.controller';
import { UsersModule } from '../../modules/users/users.module';

@Module({
  imports: [ApiConfigModule, CqrsModule, UsersModule],
  controllers: [GoogleOAuthController],
  providers: [GoogleOAuthStrategy],
})
export class GoogleOAuthModule {}
