import { Body, Controller, Headers, HttpCode, Ip, Post, Res, UseGuards } from '@nestjs/common';
import { HTTP_Status } from '../../../main/enums/http-status.enum';
import { RegisterInputDto } from './input-dto/register.input.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CommandBus } from '@nestjs/cqrs';
import { ConfirmationCodeInputDto } from './input-dto/confirmation-code.input.dto';
import { PasswordRecoveryInputDto } from './input-dto/password-recovery.input.dto';
import { RegistrationEmailResendingInputDto } from './input-dto/registration-email-resending.input.dto';
import { NewPasswordInputDto } from './input-dto/new-password.input.dto';
import { NewPasswordCommand } from '../application/use-cases/new-password.use-case';
import { ApiErrorResultDto } from '../../../main/validators/api-error-result.dto';
import { TokenTypeSwaggerDto } from '../../../configuration/swagger/swaggers/token-type-swagger.dto';
import { Response } from 'express';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RefreshTokenGuard } from '../../../main/guards/refresh-token.guard';
import { SessionDto } from '../../sessions/application/dto/SessionDto';
import { SessionData } from '../../../main/decorators/session-data.decorator';
import { UserId } from '../../../main/decorators/user.decorator';
import { LoginInputDto } from './input-dto/login.input.dto';
import { PasswordRecoveryCodeInputDto } from './input-dto/password-recovery-code.input.dto';
import { CheckPasswordRecoveryCodeCommand } from '../application/use-cases/check-password-recovery-code.use-case';
import { PasswordRecoveryViewDto } from './view-dto/password-recovery-view.dto';
import { CheckerNotificationErrors } from '../../../main/validators/checker-notification.errors';
import { CreateUserCommand } from '../application/use-cases/create-user.use-case';
import { ResendingCommand } from '../application/use-cases/resending.use-case';
import { LoginCommand } from '../application/use-cases/login.use-case';
import { RecoveryCommand } from '../application/use-cases/recovery.use-case';
import { LogoutCommand } from '../application/use-cases/logout.use-case';
import { ConfirmByCodeCommand } from '../application/use-cases/confirmation-by-code.use-case';
import { ResultNotification } from '../../../main/validators/result-notification';
import { LoginSuccessViewDto } from './view-dto/login-success.view.dto';
import { TokensType } from '../application/types/types';

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
    const notification = await this.commandBus.execute<CreateUserCommand, ResultNotification>(
      new CreateUserCommand(body),
    );
    if (notification.hasError()) throw new CheckerNotificationErrors('Error', notification);
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
  async registrationConfirmation(@Body() body: ConfirmationCodeInputDto) {
    const notification = await this.commandBus.execute<ConfirmByCodeCommand, ResultNotification>(
      new ConfirmByCodeCommand(body),
    );
    if (notification.hasError()) throw new CheckerNotificationErrors('Error', notification);
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
  async registrationEmailResending(@Body() body: RegistrationEmailResendingInputDto) {
    const notification = await this.commandBus.execute<ResendingCommand, ResultNotification>(
      new ResendingCommand(body),
    );
    if (notification.hasError()) throw new CheckerNotificationErrors('Error', notification);
    return;
  }

  /**
   * @description Login user to the system
   * @param ip
   * @param deviceName
   * @param res
   * @param userId
   * @param body
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
    @Ip() ip: string,
    @Headers('user-agent') deviceName = 'unknown',
    @Res({ passthrough: true }) res: Response,
    @UserId() userId: number,
    @Body() body: LoginInputDto, //need for swagger
  ): Promise<LoginSuccessViewDto> {
    const notification = await this.commandBus.execute<LoginCommand, ResultNotification<TokensType>>(
      new LoginCommand(userId, ip, deviceName),
    );
    const { accessToken, refreshToken } = notification.getData();
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });
    return { accessToken };
  }

  /**
   * @description Recovery password via email
   * @param body
   */
  @ApiOperation({
    summary: 'Password recovery via Email confirmation. Email should be sent with RecoveryCode inside',
  })
  @ApiResponse({ status: 204, description: 'success' })
  @ApiResponse({ status: 400, description: 'Incorrect input data by field or reCaptcha' })
  @Post('password-recovery')
  @HttpCode(HTTP_Status.NO_CONTENT_204)
  async passwordRecovery(@Body() body: PasswordRecoveryInputDto) {
    const notification = await this.commandBus.execute<RecoveryCommand, ResultNotification>(
      new RecoveryCommand(body.email, true, body.recaptcha),
    );
    if (notification.hasError()) throw new CheckerNotificationErrors('Error', notification);
    return;
  }

  /**
   * @description Check recovery code for valid
   * @param body
   */
  @ApiOperation({ summary: 'Check recovery code for valid' })
  @ApiResponse({ status: 200, description: 'Recovery code is valid', type: PasswordRecoveryViewDto })
  @ApiResponse({ status: 400, description: 'If the recovery code is incorrect, expired or already been applied' })
  @ApiResponse({
    status: 429,
    description: 'More than 5 attempts from one IP-address during 10 seconds',
  })
  @Post('check-recovery-code')
  @HttpCode(HTTP_Status.OK_200)
  async checkPasswordRecovery(@Body() body: PasswordRecoveryCodeInputDto): Promise<PasswordRecoveryViewDto> {
    const notification = await this.commandBus.execute<CheckPasswordRecoveryCodeCommand, ResultNotification>(
      new CheckPasswordRecoveryCodeCommand(body),
    );
    if (notification.hasError()) throw new CheckerNotificationErrors('Error', notification);
    const email = notification.getData();
    return { email };
  }

  /**
   * @description Confirm password recovery via email
   * @param body
   */
  @ApiOperation({ summary: 'password recovery via Email resending' })
  @ApiResponse({ status: 204, description: 'success' })
  @ApiResponse({ status: 400, description: 'Incorrect input data by field' })
  @Post('password-recovery-email-resending')
  @HttpCode(HTTP_Status.NO_CONTENT_204)
  async passwordRecoveryEmailResending(@Body() body: RegistrationEmailResendingInputDto): Promise<boolean> {
    const notification = await this.commandBus.execute<RecoveryCommand, ResultNotification>(
      new RecoveryCommand(body.email, false),
    );
    if (notification.hasError()) throw new CheckerNotificationErrors('Error', notification);
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
  async newPassword(@Body() body: NewPasswordInputDto) {
    const notification = await this.commandBus.execute<NewPasswordCommand, ResultNotification>(
      new NewPasswordCommand(body),
    );
    if (notification.hasError()) throw new CheckerNotificationErrors('Error', notification);
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
  async logout(@SessionData() sessionData: SessionDto, @Res({ passthrough: true }) res: Response) {
    const notification = await this.commandBus.execute<LogoutCommand, ResultNotification>(
      new LogoutCommand(sessionData.userId, sessionData.deviceId),
    );
    if (notification.hasError()) throw new CheckerNotificationErrors('Error', notification);
    res.clearCookie('refreshToken');
  }
}
