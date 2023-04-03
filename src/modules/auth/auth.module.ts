import { Module } from '@nestjs/common';
import { AuthController } from './api/auth.controller';
import { CreateUserHandler } from './application/use-cases/create-user.handler';
import { ConfirmByCodeHandler } from './application/use-cases/confirmation-by-code.handler';
import { LoginHandler } from './application/use-cases/login.handler';
import { LogoutHandler } from './application/use-cases/logout.handler';
import { NewPasswordHandler } from './application/use-cases/new-password.handler';
import { RefreshHandler } from './application/use-cases/refresh.handler';
import { RecoveryHandler } from './application/use-cases/recovery.handler';
import { ResendingHandler } from './application/use-cases/resending.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { PasswordResendingHandler } from './application/use-cases/password-resending.handler';
import { BasicStrategy } from './api/strategies/basic.strategy';
import { LocalStrategy } from './api/strategies/local.strategy';
import { JwtStrategy } from './api/strategies/jwt.strategy';
import { ApiConfigModule } from '../api-config/api.config.module';
import { ApiJwtModule } from '../api-jwt/api-jwt.module';
import { SessionsModule } from '../sessions/sessions.module';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './application/auth.service';
import { UsersModule } from '../users/users.module';
import { PasswordRecovery } from './domain/password-recovery.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordRecoveryRepository } from './infrastructure/password-recovery.repository';

const handlers = [
  ConfirmByCodeHandler,
  CreateUserHandler,
  LoginHandler,
  LogoutHandler,
  NewPasswordHandler,
  RefreshHandler,
  RecoveryHandler,
  ResendingHandler,
  PasswordResendingHandler,
];

const strategies = [BasicStrategy, LocalStrategy, JwtStrategy];
const entities = [PasswordRecovery];

@Module({
  imports: [
    TypeOrmModule.forFeature(entities),
    CqrsModule,
    ApiConfigModule,
    ApiJwtModule,
    SessionsModule,
    PassportModule,
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, PasswordRecoveryRepository, ...handlers, ...strategies],
  exports: [AuthService],
})
export class AuthModule {}
