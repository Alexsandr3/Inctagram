import { Module } from '@nestjs/common';
import { GoogleAuthStrategy } from './api/strategy/google-auth.strategy';
import { ApiConfigModule } from '../../modules/api-config/api.config.module';
import { CqrsModule } from '@nestjs/cqrs';
import { GoogleAuthController } from './api/google-auth.controller';
import { UsersModule } from '../../modules/users/users.module';

const strategies = [GoogleAuthStrategy];

@Module({
  imports: [ApiConfigModule, CqrsModule, UsersModule],
  controllers: [GoogleAuthController],
  providers: [...strategies],
})
export class GoogleAuthModule {}
