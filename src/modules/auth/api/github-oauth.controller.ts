import { Controller, Get, Headers, Ip, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { GitHubAuthorizationGuard } from './guards/github-authorization.guard';
import { LoginCommand } from '../application/use-cases/login.use-case';
import { ResultNotification } from '../../../main/validators/result-notification';
import { TokensType } from '../application/types/types';
import { CurrentUserId } from '../../../main/decorators/user.decorator';
import { CommandBus } from '@nestjs/cqrs';
import {
  SwaggerDecoratorsByGitHubAuthorization,
  SwaggerDecoratorsByGitHubAuthorizationHandler,
  SwaggerDecoratorsByGitHubRegistration,
  SwaggerDecoratorsByGitHubRegistrationHandler,
} from '../swagger/swagger.github-oauth.decorators';
import { ApiTags } from '@nestjs/swagger';
import { PayloadData } from '../../../main/decorators/payload-data.decorator';
import { RegisterInputDto } from './input-dto/register.input.dto';
import { RegisterUserCommand } from '../application/use-cases/register-user.use-case';
import { GitHubRegistrationGuard } from './guards/github-registration.guard';

@ApiTags('GitHub-OAuth2')
@Controller('auth/github')
export class GitHubOauthController {
  constructor(private readonly commandBus: CommandBus) {}

  @SwaggerDecoratorsByGitHubAuthorization()
  @Get('authorization')
  @UseGuards(GitHubAuthorizationGuard)
  async githubAuthorization() {}

  @SwaggerDecoratorsByGitHubAuthorizationHandler()
  @Get('authorization/redirect')
  @UseGuards(GitHubAuthorizationGuard)
  async githubAuthorizationHandler(
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

  @SwaggerDecoratorsByGitHubRegistration()
  @Get('registration')
  @UseGuards(GitHubRegistrationGuard)
  async githubRegistration() {}

  @SwaggerDecoratorsByGitHubRegistrationHandler()
  @Get('registration/redirect')
  @UseGuards(GitHubRegistrationGuard)
  async githubRegistrationHandler(@PayloadData() registerInputDto: RegisterInputDto): Promise<null> {
    const notification = await this.commandBus.execute<RegisterUserCommand, ResultNotification<null>>(
      new RegisterUserCommand(registerInputDto, true),
    );
    return notification.getData();
  }
}
