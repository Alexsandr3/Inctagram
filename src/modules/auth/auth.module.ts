import { Module } from '@nestjs/common';
import { AuthController } from './api/auth.controller';
import { BasicStrategy } from './api/strategies/basic.strategy';
import { LocalStrategy } from './api/strategies/local.strategy';
import { JwtStrategy } from './api/strategies/jwt.strategy';
import { ApiConfigModule } from '../api-config/api.config.module';

@Module({
  imports: [ApiConfigModule],
  controllers: [AuthController],
  providers: [BasicStrategy, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
