import { Module } from '@nestjs/common';
import { AuthController } from './api/auth.controller';
import { ConfirmRegistrationUseCase } from './application/use-cases/confirm-registration.use-case';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { LogoutUseCase } from './application/use-cases/logout.use-case';
import { NewPasswordUseCase } from './application/use-cases/new-password.use-case';
import { RefreshUseCase } from './application/use-cases/refresh.use-case';
import { PasswordRecoveryUseCase } from './application/use-cases/password-recovery.use-case';
import { ResendRegistrationEmailUseCase } from './application/use-cases/resend-registration-email.use-case';
import { CqrsModule } from '@nestjs/cqrs';
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
import { CheckPasswordRecoveryCodeUseCase } from './application/use-cases/check-password-recovery-code.use-case';
import { RecaptchaModule } from '../../providers/recaptcha/recaptcha.module';
import { RegisterUserUseCase } from './application/use-cases/register-user.use-case';

const useCases = [
  RegisterUserUseCase,
  ConfirmRegistrationUseCase,
  LoginUseCase,
  ResendRegistrationEmailUseCase,
  NewPasswordUseCase,
  PasswordRecoveryUseCase,
  RefreshUseCase,
  LogoutUseCase,
  CheckPasswordRecoveryCodeUseCase,
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
    RecaptchaModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, PasswordRecoveryRepository, ...useCases, ...strategies],
  exports: [AuthService],
})
export class AuthModule {}
