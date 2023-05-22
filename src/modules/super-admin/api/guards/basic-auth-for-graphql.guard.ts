import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { ApiConfigService } from '../../../api-config/api.config.service';

@Injectable()
export class BasicAuthForGraphqlGuard implements CanActivate {
  constructor(private reflector: Reflector, private apiConfigService: ApiConfigService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();
    const { authorization } = req.headers;
    const encoderAut = Buffer.from(`${this.apiConfigService.SA_LOGIN}:${this.apiConfigService.SA_PASSWORD}`).toString(
      'base64',
    );
    const validHeader = `Basic ${encoderAut}`;
    if (validHeader !== authorization) {
      throw new UnauthorizedException();
    }
    return true;
  }
}
