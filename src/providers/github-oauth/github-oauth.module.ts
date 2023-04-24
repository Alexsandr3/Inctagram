import { Module } from '@nestjs/common';

import { GithubOauthController } from './api/github-oauth.controller';
import { GithubOauthStrategy } from './api/strategy/github-oauth.strategy';
import { UsersModule } from '../../modules/users/users.module';
import { ApiConfigModule } from '../../modules/api-config/api.config.module';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [ApiConfigModule, CqrsModule, UsersModule],
  controllers: [GithubOauthController],
  providers: [GithubOauthStrategy],
})
export class GithubOauthModule {}
