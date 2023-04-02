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

@Module({
  imports: [CqrsModule],
  controllers: [AuthController],
  providers: [...handlers],
})
export class AuthModule {}
