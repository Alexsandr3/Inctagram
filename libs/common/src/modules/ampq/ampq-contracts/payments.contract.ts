import { AmqpBaseRequestInterface } from '@common/modules/ampq/ampq-contracts/shared/amqp-base-request.interface';

export namespace PaymentsContract {
  // export const queue: QueueDeclarationInterface = {
  //   exchange: EXCHANGE_PAYMENTS,
  //   queue: `${EXCHANGE_PAYMENTS.name}-queue`,
  //   routingKey: `${EXCHANGE_PAYMENTS.name}-queue`,
  //   queueOptions: { durable: true },
  // };
  export type requestSuccess = AmqpBaseRequestInterface<SuccessfulPaymentRequestInterface>;
  export type requestFailed = AmqpBaseRequestInterface<FailedPaymentRequestInterface>;
  export const PaymentEventType = {
    successfulPayment: `successfulPayment`,
    failedPayment: `failedPayment`,
  };
}

export interface SuccessfulPaymentRequestInterface {
  sessionId: string;
  customer: string;
  subscription: string;
}
export interface FailedPaymentRequestInterface {
  sessionId: string;
  customer: string;
}
