import { Controller, Get, Headers, HttpCode, Ip, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CommandBus } from '@nestjs/cqrs';
import { GoogleAuthorizationGuard } from './guards/google-authorization.guard';
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
import { RegisterUserFromExternalAccountCommand } from '../application/use-cases/register-user-from-external-account.use-case';
import { RegisterUserFromExternalAccountInputDto } from './input-dto/register-user-from-external-account-input.dto';
import { HTTP_Status } from '../../../main/enums/http-status.enum';

@ApiTags('Google-OAuth2')
@Controller('auth/google')
export class GoogleOAuthController {
  constructor(private readonly commandBus: CommandBus) {}

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
    @Res({ passthrough: true }) res: Response,
    @CurrentUserId() userId: number,
  ) {
    const notification = await this.commandBus.execute<LoginCommand, ResultNotification<TokensType>>(
      new LoginCommand(userId, ip, deviceName),
    );
    const { accessToken, refreshToken } = notification.getData();
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'none' });
    return { accessToken };
  }

  @SwaggerDecoratorsByGoogleRegistration()
  @Get('registration')
  @UseGuards(GoogleRegistrationGuard)
  async googleRegistration() {}

  @SwaggerDecoratorsByGoogleRegistrationHandler()
  @Get('registration/redirect')
  @UseGuards(GoogleRegistrationGuard)
  @HttpCode(HTTP_Status.NO_CONTENT_204)
  async googleRegistrationHandler(@PayloadData() dto: RegisterUserFromExternalAccountInputDto): Promise<null> {
    const notification = await this.commandBus.execute<RegisterUserFromExternalAccountCommand, ResultNotification>(
      new RegisterUserFromExternalAccountCommand(dto),
    );
    return notification.getData();
  }
}
