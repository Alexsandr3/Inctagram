import { Controller, HttpCode, Post } from '@nestjs/common';
import { HTTP_Status } from '../../../main/enums/http-status.enum';

@Controller('auth')
export class AuthController {
  constructor() {}

  @Post('registration')
  @HttpCode(HTTP_Status.OK_200)
  async registration() {
    return { route: 'registration', status: 'OK' };
  }

  @Post('registration-confirmation')
  @HttpCode(HTTP_Status.OK_200)
  async registrationConfirmation() {
    return { route: 'registration-confirmation', status: 'OK' };
  }

  @Post('login')
  @HttpCode(HTTP_Status.OK_200)
  async login() {
    return { route: 'login', status: 'OK' };
  }

  @Post('registration-email-resending')
  @HttpCode(HTTP_Status.OK_200)
  async registrationEmailResending() {
    return { route: 'registration-email-resending', status: 'OK' };
  }

  @Post('password-recovery')
  @HttpCode(HTTP_Status.OK_200)
  async passwordRecovery() {
    return { route: 'password-recovery', status: 'OK' };
  }

  @Post('password-recovery-email-resending')
  @HttpCode(HTTP_Status.OK_200)
  async passwordRecoveryEmailResending() {
    return { route: 'password-recovery-email-resending', status: 'OK' };
  }

  @Post('new-password')
  @HttpCode(HTTP_Status.OK_200)
  async newPassword() {
    return { route: 'new-password', status: 'OK' };
  }

  @Post('logout')
  @HttpCode(HTTP_Status.OK_200)
  async logout() {
    return { route: 'logout', status: 'OK' };
  }
}
