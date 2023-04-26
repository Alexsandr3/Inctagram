import { Module } from '@nestjs/common';
import { AuthController } from './api/auth.controller';
import { ConfirmRegistrationUseCase } from './application/use-cases/confirm-registration.use-case';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { LogoutUseCase } from './application/use-cases/logout.use-case';
import { NewPasswordUseCase } from './application/use-cases/new-password.use-case';
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
import {
  IPasswordRecoveryRepository,
  PrismaPasswordRecoveryRepository,
} from './infrastructure/password-recovery.repository';
import { CheckPasswordRecoveryCodeUseCase } from './application/use-cases/check-password-recovery-code.use-case';
import { RegisterUserUseCase } from './application/use-cases/register-user.use-case';
import { GenerateNewTokensUseCase } from './application/use-cases/update-tokens.use-case';
import { GoogleOAuthController } from './api/google-oauth.controller';
import { GoogleOAuthStrategy } from './api/strategies/google-oauth.strategy';
import { GithubOauthController } from './api/github-oauth.controller';
import { GithubOauthStrategy } from './api/strategies/github-oauth.strategy';

const useCases = [
  RegisterUserUseCase,
  ConfirmRegistrationUseCase,
  LoginUseCase,
  ResendRegistrationEmailUseCase,
  NewPasswordUseCase,
  PasswordRecoveryUseCase,
  GenerateNewTokensUseCase,
  LogoutUseCase,
  CheckPasswordRecoveryCodeUseCase,
];

const strategies = [BasicStrategy, LocalStrategy, JwtStrategy, GoogleOAuthStrategy, GithubOauthStrategy];

@Module({
  imports: [CqrsModule, ApiConfigModule, ApiJwtModule, SessionsModule, PassportModule, UsersModule],
  controllers: [AuthController, GoogleOAuthController, GithubOauthController],
  providers: [
    AuthService,
    {
      provide: IPasswordRecoveryRepository,
      useClass: PrismaPasswordRecoveryRepository,
    },
    ...useCases,
    ...strategies,
  ],
  exports: [AuthService],
})
export class AuthModule {}
