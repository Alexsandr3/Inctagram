import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * @description Get current payload from request
 */
export const PayloadRefresh = createParamDecorator((data: string, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest();
  return request.payload;
});

/**
 * Payload type for JWT
 */
export class PayloadType {
  constructor(public userId: string, public deviceId: string, public iat: number, public exp: number) {}
}
