import { Controller, Get, Headers, HttpCode, Ip, Res, UseGuards } from '@nestjs/common';
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
import { GitHubRegistrationGuard } from './guards/github-registration.guard';
import { RegisterUserFromExternalAccountAndAuthorizeIfNewCommand } from '../application/use-cases/register-user-from-external-account-and-authorize-if-new-use.case';
import { RegisterUserFromExternalAccountInputDto } from './input-dto/register-user-from-external-account-input.dto';
import { HTTP_Status } from '../../../main/enums/http-status.enum';
import { ApiConfigService } from '../../api-config/api.config.service';

@ApiTags('GitHub-OAuth2')
@Controller('auth/github')
export class GitHubOauthController {
  private clientUrl: string;
  constructor(private readonly commandBus: CommandBus, private readonly apiConfigService: ApiConfigService) {
    this.clientUrl = apiConfigService.CLIENT_URL;
  }
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

  @SwaggerDecoratorsByGitHubRegistration()
  @Get('registration')
  @UseGuards(GitHubRegistrationGuard)
  async githubRegistration() {}

  @SwaggerDecoratorsByGitHubRegistrationHandler()
  @Get('registration/redirect')
  @UseGuards(GitHubRegistrationGuard)
  @HttpCode(HTTP_Status.NO_CONTENT_204)
  async githubRegistrationHandler(
    @Ip() ip: string,
    @Headers('user-agent') deviceName = 'unknown',
    @Headers('referer') refererUrl,
    @PayloadData() dto: RegisterUserFromExternalAccountInputDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<null> {
    const notification = await this.commandBus.execute<
      RegisterUserFromExternalAccountAndAuthorizeIfNewCommand,
      ResultNotification<TokensType | null>
    >(new RegisterUserFromExternalAccountAndAuthorizeIfNewCommand(dto, ip, deviceName));

    if (notification.getData()) {
      const refreshToken = notification.getData().refreshToken;
      res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'none' });
    }

    res.redirect(`${this.clientUrl}/auth/login?status_code=${HTTP_Status.NO_CONTENT_204}`);
    return;
  }
}
