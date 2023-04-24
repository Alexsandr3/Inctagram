import { Controller, Get, Headers, Ip, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CommandBus } from '@nestjs/cqrs';
import { GoogleOAuthGuard } from './guards/google-oauth.guard';
import { SwaggerDecoratorsByAuthGoogle, SwaggerDecoratorsByLoginWithGoogle } from '../swagger.google-oauth.decorators';
import { CurrentUserId } from '../../../main/decorators/user.decorator';
import { LoginCommand } from '../../../modules/auth/application/use-cases/login.use-case';
import { ResultNotification } from '../../../main/validators/result-notification';
import { TokensType } from '../../../modules/auth/application/types/types';
import { Response } from 'express';

@ApiTags('OAuth2-login')
@Controller('auth/google')
export class GoogleOAuthController {
  constructor(private readonly commandBus: CommandBus) {}
  @SwaggerDecoratorsByAuthGoogle()
  @Get()
  @UseGuards(GoogleOAuthGuard)
  async googleAuth() {}

  @SwaggerDecoratorsByLoginWithGoogle()
  @Get('redirect')
  @UseGuards(GoogleOAuthGuard)
  async handleGoogleOAuthRedirect(
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
}
