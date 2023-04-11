import { Body, Controller, Get, Headers, HttpCode, Ip, Post, Res, UseGuards } from '@nestjs/common';
import { HTTP_Status } from '../../../main/enums/http-status.enum';
import { RegisterInputDto } from './input-dto/register.input.dto';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { CommandBus } from '@nestjs/cqrs';
import { ConfirmationCodeInputDto } from './input-dto/confirmation-code.input.dto';
import { PasswordRecoveryInputDto } from './input-dto/password-recovery.input.dto';
import { RegistrationEmailResendingInputDto } from './input-dto/registration-email-resending.input.dto';
import { NewPasswordInputDto } from './input-dto/new-password.input.dto';
import { NewPasswordCommand } from '../application/use-cases/new-password.use-case';
import { Response } from 'express';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RefreshTokenGuard } from '../../../main/guards/refresh-token.guard';
import { SessionDto } from '../../sessions/application/dto/SessionDto';
import { SessionData } from '../../../main/decorators/session-data.decorator';
import { PasswordRecoveryCodeInputDto } from './input-dto/password-recovery-code.input.dto';
import { CheckPasswordRecoveryCodeCommand } from '../application/use-cases/check-password-recovery-code.use-case';
import { PasswordRecoveryViewDto } from './view-dto/password-recovery-view.dto';
import { ResendRegistrationEmailCommand } from '../application/use-cases/resend-registration-email.use-case';
import { LoginCommand } from '../application/use-cases/login.use-case';
import { PasswordRecoveryCommand } from '../application/use-cases/password-recovery.use-case';
import { LogoutCommand } from '../application/use-cases/logout.use-case';
import { ConfirmRegistrationCommand } from '../application/use-cases/confirm-registration.use-case';
import { ResultNotification } from '../../../main/validators/result-notification';
import { LoginSuccessViewDto } from './view-dto/login-success.view.dto';
import { TokensType } from '../application/types/types';
import { RegisterUserCommand } from '../application/use-cases/register-user.use-case';
import { CheckLoginBodyFieldsGuard } from '../../../main/guards/check-login-body-fields.guard';
import { LoginInputDto } from './input-dto/login.input.dto';
import {
  SwaggerDecoratorsByCheckPasswordRecovery,
  SwaggerDecoratorsByConfirmationRegistration,
  SwaggerDecoratorsByLogin,
  SwaggerDecoratorsByLogout,
  SwaggerDecoratorsByMe,
  SwaggerDecoratorsByNewPassword,
  SwaggerDecoratorsByPasswordRecovery,
  SwaggerDecoratorsByRegistration,
  SwaggerDecoratorsByRegistrationEmailResending,
  SwaggerDecoratorsByUpdateTokens,
} from './swagger.auth.decorators';
import { UpdateTokensCommand } from '../application/use-cases/update-tokens.use-case';
import { CurrentUserId } from '../../../main/decorators/user.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { MeViewDto } from './view-dto/me.view.dto';
import { IUsersQueryRepository } from '../../users/infrastructure/users.query-repository';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly commandBus: CommandBus, private usersQueryRepository: IUsersQueryRepository) {}

  /**
   * @description Registration in the system
   * @param body
   */
  @SwaggerDecoratorsByRegistration()
  @Post('registration')
  @HttpCode(HTTP_Status.NO_CONTENT_204)
  async applyDecoratorsByRegistration(@Body() body: RegisterInputDto): Promise<null> {
    const notification = await this.commandBus.execute<RegisterUserCommand, ResultNotification<null>>(
      new RegisterUserCommand(body),
    );
    //notification.setCode(HTTP_Status.CREATED_201);
    return notification.getData();
  }

  /**
   * @description Confirm registration via email
   * @param body
   */
  @SwaggerDecoratorsByConfirmationRegistration()
  @Post('registration-confirmation')
  @HttpCode(HTTP_Status.NO_CONTENT_204)
  async registrationConfirmation(@Body() body: ConfirmationCodeInputDto): Promise<null> {
    const notification = await this.commandBus.execute<ConfirmRegistrationCommand, ResultNotification<null>>(
      new ConfirmRegistrationCommand(body),
    );
    return notification.getData();
  }

  /**
   * @description Resend confirmation registration Email if user exists
   * @param body
   */
  @SwaggerDecoratorsByRegistrationEmailResending()
  @Post('registration-email-resending')
  @HttpCode(HTTP_Status.NO_CONTENT_204)
  async registrationEmailResending(@Body() body: RegistrationEmailResendingInputDto): Promise<null> {
    const notification = await this.commandBus.execute<ResendRegistrationEmailCommand, ResultNotification<null>>(
      new ResendRegistrationEmailCommand(body),
    );
    return notification.getData();
  }

  /**
   * @description Login user to the system
   * @param ip
   * @param deviceName
   * @param res
   * @param userId
   * @param body
   */
  @SwaggerDecoratorsByLogin()
  @Post('login')
  @UseGuards(LocalAuthGuard)
  @UseGuards(CheckLoginBodyFieldsGuard)
  @HttpCode(HTTP_Status.OK_200)
  async login(
    @Ip() ip: string,
    @Headers('user-agent') deviceName = 'unknown',
    @Res({ passthrough: true }) res: Response,
    @CurrentUserId() userId: number,
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
  @SwaggerDecoratorsByPasswordRecovery()
  @Post('password-recovery')
  @HttpCode(HTTP_Status.NO_CONTENT_204)
  async passwordRecovery(@Body() body: PasswordRecoveryInputDto): Promise<null> {
    const notification = await this.commandBus.execute<PasswordRecoveryCommand, ResultNotification<null>>(
      new PasswordRecoveryCommand(body.email, false, body.recaptcha),
    );
    return notification.getData();
  }

  /**
   * @description Check recovery code for valid
   * @param body
   */
  @SwaggerDecoratorsByCheckPasswordRecovery()
  @Post('check-recovery-code')
  @HttpCode(HTTP_Status.OK_200)
  async checkPasswordRecovery(@Body() body: PasswordRecoveryCodeInputDto): Promise<PasswordRecoveryViewDto> {
    const notification = await this.commandBus.execute<
      CheckPasswordRecoveryCodeCommand,
      ResultNotification<PasswordRecoveryViewDto>
    >(new CheckPasswordRecoveryCodeCommand(body));
    return notification.getData();
  }

  /**
   * @description Confirm password recovery via email
   * @param body
   */
  @SwaggerDecoratorsByNewPassword()
  @Post('new-password')
  @HttpCode(HTTP_Status.NO_CONTENT_204)
  async newPassword(@Body() body: NewPasswordInputDto): Promise<null> {
    const notification = await this.commandBus.execute<NewPasswordCommand, ResultNotification<null>>(
      new NewPasswordCommand(body),
    );
    return notification.getData();
  }

  /**
   * @description Logout user from the system
   */
  @SwaggerDecoratorsByLogout()
  @Post('logout')
  @UseGuards(RefreshTokenGuard)
  @HttpCode(HTTP_Status.NO_CONTENT_204)
  async logout(@SessionData() sessionData: SessionDto, @Res({ passthrough: true }) res: Response): Promise<null> {
    const notification = await this.commandBus.execute<LogoutCommand, ResultNotification<null>>(
      new LogoutCommand(sessionData.userId, sessionData.deviceId),
    );
    res.clearCookie('refreshToken');
    return notification.getData();
  }

  @SwaggerDecoratorsByUpdateTokens()
  @Post('update-tokens')
  @UseGuards(RefreshTokenGuard)
  @HttpCode(HTTP_Status.OK_200)
  async updateTokens(
    @SessionData() sessionData: SessionDto,
    @Ip() ip: string,
    @Headers('user-agent') deviceName = 'unknown',
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginSuccessViewDto> {
    const notification = await this.commandBus.execute<UpdateTokensCommand, ResultNotification<TokensType>>(
      new UpdateTokensCommand({ oldSessionData: sessionData, ip, deviceName }),
    );

    const { accessToken, refreshToken } = notification.getData();
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });

    return { accessToken };
  }

  //need for testing recaptcha --- > remove in production
  @ApiExcludeEndpoint()
  @Post('password-recovery-test')
  @HttpCode(HTTP_Status.NO_CONTENT_204)
  async passwordRecoveryTest(@Body() body: PasswordRecoveryInputDto): Promise<null> {
    const notification = await this.commandBus.execute<PasswordRecoveryCommand, ResultNotification<null>>(
      new PasswordRecoveryCommand(body.email, true, body.recaptcha),
    );
    return notification.getData();
  }

  @SwaggerDecoratorsByMe()
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMyInfo(@CurrentUserId() userId: number): Promise<MeViewDto> {
    const user = await this.usersQueryRepository.findUserById(userId);
    return new MeViewDto(user);
  }
}
