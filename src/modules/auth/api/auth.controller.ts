import { Body, Controller, HttpCode, Ip, Post, Request, Res, UseGuards } from '@nestjs/common';
import { HTTP_Status } from '../../../main/enums/http-status.enum';
import { RegisterInputDto } from './input-dto/register.input.dto';
import { LoginInputDto } from './input-dto/login.input.dto';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserCommand } from '../application/use-cases/create-user.handler';
import { ConfirmByCodeCommand } from '../application/use-cases/confirmation-by-code.handler';
import { ConfirmationCodeInputDto } from './input-dto/confirmation-code.input.dto';
import { RecoveryCommand } from '../application/use-cases/recovery.handler';
import { LoginCommand } from '../application/use-cases/login.handler';
import { PasswordRecoveryInputDto } from './input-dto/password-recovery.input.dto';
import { RegistrationEmailResendingInputDto } from './input-dto/registration-email-resending.input.dto';
import { NewPasswordInputDto } from './input-dto/new-password.input.dto';
import { NewPasswordCommand } from '../application/use-cases/new-password.handler';
import { LogoutCommand } from '../application/use-cases/logout.handler';
import { ApiErrorResultDto } from '../../../configuration/swagger/swaggers/api-error-result.dto';
import { TokenTypeSwaggerDto } from '../../../configuration/swagger/swaggers/token-type-swagger.dto';
import { PasswordResendingCommand } from '../application/use-cases/password-resending.handler';
import { Response } from 'express';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RefreshTokenGuard } from '../../../main/guards/refresh-token.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  /**
   * @description Registration in the system
   * @param body
   */
  @ApiOperation({
    summary: 'Registration in the system. Email with confirmation code will be send to passed email address',
  })
  @ApiResponse({
    status: 204,
    description: 'An email with a verification code has been sent to the specified email address',
  })
  @ApiResponse({
    status: 400,
    description: 'Incorrect input data',
    type: ApiErrorResultDto,
  })
  @ApiResponse({
    status: 429,
    description: 'More than 5 attempts from one IP-address during 10 seconds',
  })
  @Post('registration')
  @HttpCode(HTTP_Status.NO_CONTENT_204)
  async registration(@Body() body: RegisterInputDto): Promise<boolean> {
    await this.commandBus.execute(new CreateUserCommand(body));
    return;
  }

  /**
   * @description Confirm registration via email
   * @param body
   */
  @ApiOperation({ summary: 'Confirm registration' })
  @ApiResponse({
    status: 204,
    description: 'Email was verified. Account was activated',
  })
  @ApiResponse({
    status: 400,
    description: 'Incorrect input data',
    type: ApiErrorResultDto,
  })
  @ApiResponse({
    status: 429,
    description: 'More than 5 attempts from one IP-address during 10 seconds',
  })
  @Post('registration-confirmation')
  @HttpCode(HTTP_Status.NO_CONTENT_204)
  async registrationConfirmation(@Body() body: ConfirmationCodeInputDto): Promise<boolean> {
    await this.commandBus.execute(new ConfirmByCodeCommand(body));
    return;
  }

  /**
   * @description Resend confirmation registration Email if user exists
   * @param body
   */
  @ApiOperation({
    summary: 'Resend confirmation registration Email if user exists',
  })
  @ApiResponse({
    status: 204,
    description: 'An email with a verification code has been sent to the specified email address',
  })
  @ApiResponse({
    status: 400,
    description: 'Incorrect input data',
    type: ApiErrorResultDto,
  })
  @ApiResponse({
    status: 429,
    description: 'More than 5 attempts from one IP-address during 10 seconds',
  })
  @Post('registration-email-resending')
  @HttpCode(HTTP_Status.NO_CONTENT_204)
  async registrationEmailResending(@Body() body: RegistrationEmailResendingInputDto): Promise<boolean> {
    await this.commandBus.execute(new RecoveryCommand(body));
    return;
  }

  /**
   * @description Login user to the system
   * @param req
   * @param ip
   * @param loginInputModel
   * @param res
   */
  @ApiOperation({ summary: 'Try login user to the system' })
  @ApiResponse({
    status: 200,
    description: 'success',
    type: TokenTypeSwaggerDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Incorrect input data',
    type: ApiErrorResultDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 429,
    description: 'More than 5 attempts from one IP-address during 10 seconds',
  })
  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HTTP_Status.OK_200)
  async login(
    @Request() req,
    @Ip() ip,
    @Body() loginInputModel: LoginInputDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const deviceName = req.headers['user-agent'];
    const createdToken = await this.commandBus.execute(new LoginCommand(loginInputModel, ip, deviceName));
    // res.cookie('refreshToken', createdToken.refreshToken, {
    //   httpOnly: true,
    //   secure: true,
    // });
    return { accessToken: createdToken.accessToken };
  }

  /**
   * @description Recovery password via email
   * @param body
   */
  @ApiHeader({ name: 'password-recovery' })
  @ApiOperation({
    summary: 'Password recovery via Email confirmation. Email should be sent with RecoveryCode inside',
  })
  @ApiResponse({ status: 204, description: 'success' })
  @ApiResponse({ status: 400, description: 'Incorrect input data by field' })
  @ApiResponse({
    status: 429,
    description: 'More than 5 attempts from one IP-address during 10 seconds',
  })
  @Post('password-recovery')
  @HttpCode(HTTP_Status.NO_CONTENT_204)
  async passwordRecovery(@Body() body: PasswordRecoveryInputDto): Promise<boolean> {
    await this.commandBus.execute(new RecoveryCommand(body));
    return;
  }

  /**
   * @description Confirm password recovery via email
   * @param body
   */
  @Post('password-recovery-email-resending')
  @HttpCode(HTTP_Status.NO_CONTENT_204)
  async passwordRecoveryEmailResending(@Body() body: RegistrationEmailResendingInputDto): Promise<boolean> {
    await this.commandBus.execute(new PasswordResendingCommand(body));
    return;
  }

  /**
   * @description Confirm password recovery via email
   * @param body
   */
  @ApiOperation({ summary: 'Confirm Password recovery' })
  @ApiResponse({ status: 204, description: 'success' })
  @ApiResponse({ status: 400, description: 'Incorrect input data by field' })
  @ApiResponse({
    status: 429,
    description: 'More than 5 attempts from one IP-address during 10 seconds',
  })
  @Post('new-password')
  @HttpCode(HTTP_Status.NO_CONTENT_204)
  async newPassword(@Body() body: NewPasswordInputDto): Promise<boolean> {
    await this.commandBus.execute(new NewPasswordCommand(body));
    return;
  }

  /**
   * @description Logout user from the system
   */
  @ApiOperation({
    summary: 'In cookie client must send correct refresh Token that will be revoked',
  })
  @ApiResponse({ status: 204, description: 'success' })
  @ApiResponse({
    status: 401,
    description: 'JWT refreshToken inside cookie is missing, expired or incorrect',
  })
  @Post('logout')
  @UseGuards(RefreshTokenGuard)
  @HttpCode(HTTP_Status.NO_CONTENT_204)
  async logout() {
    await this.commandBus.execute(new LogoutCommand());
    return;
  }
}
