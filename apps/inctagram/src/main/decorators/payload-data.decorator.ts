import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const PayloadData = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const req: Request = ctx.switchToHttp().getRequest();
  return req.payLoad;
});
