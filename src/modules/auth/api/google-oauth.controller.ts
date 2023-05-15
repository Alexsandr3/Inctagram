import { Controller, Get, Headers, HttpCode, Ip, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CommandBus } from '@nestjs/cqrs';
import {
  SwaggerDecoratorsByGoogleAuthorization,
  SwaggerDecoratorsByGoogleAuthorizationHandler,
  SwaggerDecoratorsByGoogleRegistration,
  SwaggerDecoratorsByGoogleRegistrationHandler,
} from '../swagger/swagger.google-oauth.decorators';
import { CurrentUserId } from '../../../main/decorators/user.decorator';
import { LoginCommand } from '../application/use-cases/login.use-case';
import { ResultNotification } from '../../../main/validators/result-notification';
import { TokensType } from '../application/types/types';
import { Response } from 'express';
import { GoogleRegistrationGuard } from './guards/google-registration.guard';
import { PayloadData } from '../../../main/decorators/payload-data.decorator';
import { RegisterUserFromExternalAccountAndAuthorizeIfNewCommand } from '../application/use-cases/register-user-from-external-account-and-authorize-if-new-use.case';
import { RegisterUserFromExternalAccountInputDto } from './input-dto/register-user-from-external-account-input.dto';
import { HTTP_Status } from '../../../main/enums/http-status.enum';
import { GoogleAuthorizationGuard } from './guards/google-authorization.guard';
import { ApiConfigService } from '../../api-config/api.config.service';

@ApiTags('Google-OAuth2')
@Controller('auth/google')
export class GoogleOAuthController {
  private clientUrl: string;
  constructor(private readonly commandBus: CommandBus, private readonly apiConfigService: ApiConfigService) {
    this.clientUrl = apiConfigService.CLIENT_URL;
  }

  @SwaggerDecoratorsByGoogleAuthorization()
  @Get('authorization')
  @UseGuards(GoogleAuthorizationGuard)
  async googleAuthorization() {}

  @SwaggerDecoratorsByGoogleAuthorizationHandler()
  @Get('authorization/redirect')
  @UseGuards(GoogleAuthorizationGuard)
  async googleAuthorizationHandler(
    @Ip() ip: string,
    @Headers('user-agent') deviceName = 'unknown',
    @Headers('referer') refererUrl,
    @Res({ passthrough: true }) res: Response,
    @CurrentUserId() userId: number,
  ) {
    const notification = await this.commandBus.execute<LoginCommand, ResultNotification<TokensType>>(
      new LoginCommand(userId, ip, deviceName),
    );
    const refreshToken = notification.getData().refreshToken;
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'none' });
    res.redirect(`${this.clientUrl}/auth/login?status_code=${HTTP_Status.OK_200}`);
  }

  @SwaggerDecoratorsByGoogleRegistration()
  @Get('registration')
  @UseGuards(GoogleRegistrationGuard)
  async googleRegistration() {}

  @SwaggerDecoratorsByGoogleRegistrationHandler()
  @Get('registration/redirect')
  @UseGuards(GoogleRegistrationGuard)
  @HttpCode(HTTP_Status.NO_CONTENT_204)
  async googleRegistrationHandler(
    @Ip() ip: string,
    @Headers('user-agent') deviceName = 'unknown',
    @Headers('referer') refererUrl,
    @PayloadData() dto: RegisterUserFromExternalAccountInputDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const notification = await this.commandBus.execute<
      RegisterUserFromExternalAccountAndAuthorizeIfNewCommand,
      ResultNotification<TokensType | null>
    >(new RegisterUserFromExternalAccountAndAuthorizeIfNewCommand(dto, ip, deviceName));

    if (notification.getData()) {
      const refreshToken = notification.getData().refreshToken;
      res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'none' });
      res.redirect(`${this.clientUrl}/auth/login?status_code=${HTTP_Status.NO_CONTENT_204}`);
      return;
    } else {
      res.redirect(`${this.clientUrl}/auth/login?status_code=${HTTP_Status.NO_CONTENT_204}`);
      return;
    }
  }
}
