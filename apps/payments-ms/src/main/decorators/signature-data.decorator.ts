import { createParamDecorator, ExecutionContext, RawBodyRequest } from '@nestjs/common';
import { Request } from 'express';

export const Signature = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const req: RawBodyRequest<Request> = ctx.switchToHttp().getRequest();
  const body = req.rawBody;
  const signature = req.headers['stripe-signature'];
  const hook: PaymentInputData = {
    body: body,
    signature: signature,
  };
  return (req.paymentData = hook);
});

export type PaymentInputData = {
  body: Buffer;
  signature: string | string[];
};

//try {
//       const signature = request.headers['stripe-signature'];
//
//       const endpointSecret = <string>(
//         this.configService.get<string>('stripe.webhookSecret')
//       );
//
//       console.log(
//         this.stripe.webhooks.constructEvent(
//           request.rawBody,
//           signature,
//           endpointSecret,
//         ),
//       );
//
//       return true;
//     } catch (e) {}
