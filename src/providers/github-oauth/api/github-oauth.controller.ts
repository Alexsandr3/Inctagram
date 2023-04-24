import { Controller, Get, Headers, Ip, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { GithubOauthGuard } from './guards/github-oauth.guard';
import { LoginCommand } from '../../../modules/auth/application/use-cases/login.use-case';
import { ResultNotification } from '../../../main/validators/result-notification';
import { TokensType } from '../../../modules/auth/application/types/types';
import { CurrentUserId } from '../../../main/decorators/user.decorator';
import { CommandBus } from '@nestjs/cqrs';
import { SwaggerDecoratorsByAuthGithub, SwaggerDecoratorsByLoginWithGithub } from '../swagger.github-oauth.decorators';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('OAuth2-login')
@Controller('auth/github')
export class GithubOauthController {
  constructor(private readonly commandBus: CommandBus) {}

  @SwaggerDecoratorsByAuthGithub()
  @Get()
  @UseGuards(GithubOauthGuard)
  async githubAuth() {}

  @SwaggerDecoratorsByLoginWithGithub()
  @Get('redirect')
  @UseGuards(GithubOauthGuard)
  async githubAuthCallback(
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
