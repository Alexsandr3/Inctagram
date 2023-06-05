import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GitHubRegistrationGuard extends AuthGuard('github-registration') {}
