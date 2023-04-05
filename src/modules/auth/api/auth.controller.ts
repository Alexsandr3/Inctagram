import { BadRequestException, Body, Controller, Headers, HttpCode, Ip, Post, Res, UseGuards } from '@nestjs/common';
import { HTTP_Status } from '../../../main/enums/http-status.enum';
import { RegisterInputDto } from './input-dto/register.input.dto';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserCommand } from '../application/use-cases/create-user-use-case';
import { ConfirmByCodeCommand } from '../application/use-cases/confirmation-by-code-use-case';
import { ConfirmationCodeInputDto } from './input-dto/confirmation-code.input.dto';
import { RecoveryCommand } from '../application/use-cases/recovery-use-case';
import { LoginCommand } from '../application/use-cases/login-use-case';
import { PasswordRecoveryInputDto } from './input-dto/password-recovery.input.dto';
import { RegistrationEmailResendingInputDto } from './input-dto/registration-email-resending.input.dto';
import { NewPasswordInputDto } from './input-dto/new-password.input.dto';
import { NewPasswordCommand } from '../application/use-cases/new-password-use-case';
import { LogoutCommand } from '../application/use-cases/logout-use-case';
import { ApiErrorResultDto } from '../../../configuration/swagger/swaggers/api-error-result.dto';
import { TokenTypeSwaggerDto } from '../../../configuration/swagger/swaggers/token-type-swagger.dto';
import { Response } from 'express';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RefreshTokenGuard } from '../../../main/guards/refresh-token.guard';
import { SessionDto } from '../../sessions/application/dto/SessionDto';
import { SessionData } from '../../../main/decorators/session-data.decorator';
import { ResendingCommand } from '../application/use-cases/resending-use-case';
import { LoginSuccessViewDto } from './view-dto/login-success.view.dto';
import { UserId } from '../../../main/decorators/user.decorator';
import { LoginInputDto } from './input-dto/login.input.dto';
import { PasswordRecoveryCodeInputDto } from './input-dto/password-recovery-code.input.dto';
import { CheckPasswordRecoveryCodeCommand } from '../application/use-cases/check-password-recovery-code-use-case';
import { CheckPasswordRecoveryViewDto } from './view-dto/check-password-recovery.view.dto';

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
  async registrationConfirmation(@Body() body: ConfirmationCodeInputDto) {
    const isConfirm = await this.commandBus.execute(new ConfirmByCodeCommand(body));
    if (!isConfirm) throw new BadRequestException(`Code isn't valid`, 'code');
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
    await this.commandBus.execute(new ResendingCommand(body));
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
    const { accessToken, refreshToken } = await this.commandBus.execute(new LoginCommand(userId, ip, deviceName));

    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });
    return { accessToken };
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
  async passwordRecovery(@Body() body: PasswordRecoveryInputDto) {
    await this.commandBus.execute(new RecoveryCommand(body));
  }

  /**
   * @description Check recovery code for valid
   * @param body
   */
  @ApiOperation({ summary: 'Check recovery code for valid' })
  @ApiResponse({ status: 200, description: 'Recovery code is valid', type: CheckPasswordRecoveryViewDto })
  @ApiResponse({ status: 400, description: 'If the recovery code is incorrect, expired or already been applied' })
  @ApiResponse({
    status: 429,
    description: 'More than 5 attempts from one IP-address during 10 seconds',
  })
  @Post('check-recovery-code')
  @HttpCode(HTTP_Status.OK_200)
  async checkPasswordRecovery(@Body() body: PasswordRecoveryCodeInputDto): Promise<CheckPasswordRecoveryViewDto> {
    const email = await this.commandBus.execute<CheckPasswordRecoveryCodeCommand, string>(
      new CheckPasswordRecoveryCodeCommand(body),
    );
    return { email };
  }

  /**
   * @description Confirm password recovery via email
   * @param body
   */
  @Post('password-recovery-email-resending')
  @HttpCode(HTTP_Status.NO_CONTENT_204)
  async passwordRecoveryEmailResending(@Body() body: RegistrationEmailResendingInputDto): Promise<boolean> {
    await this.commandBus.execute(new RecoveryCommand(body));
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
    const isChangedPassword = await this.commandBus.execute(new NewPasswordCommand(body));
    if (!isChangedPassword) throw new BadRequestException('Code is not valid', 'code');
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
    await this.commandBus.execute(new LogoutCommand(sessionData.userId, sessionData.deviceId));
    res.clearCookie('refreshToken');
  }
}
