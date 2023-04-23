import { Controller, Get, Headers, Ip, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CommandBus } from '@nestjs/cqrs';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { SwaggerDecoratorsByAuthGoogle, SwaggerDecoratorsByLoginWithGoogle } from '../swagger.google-auth.decorators';
import { CurrentUserId } from '../../../main/decorators/user.decorator';
import { LoginCommand } from '../../../modules/auth/application/use-cases/login.use-case';
import { ResultNotification } from '../../../main/validators/result-notification';
import { TokensType } from '../../../modules/auth/application/types/types';
import { Response } from 'express';

@ApiTags('GoogleAuth')
@Controller('auth/google')
export class GoogleAuthController {
  constructor(private readonly commandBus: CommandBus) {}
  @SwaggerDecoratorsByAuthGoogle()
  @Get()
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {}

  @SwaggerDecoratorsByLoginWithGoogle()
  @Get('redirect')
  @UseGuards(GoogleAuthGuard)
  async handleGoogleAuthRedirect(
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
