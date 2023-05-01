import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GitHubAuthorizationGuard extends AuthGuard('github-authorization') {}
