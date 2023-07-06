import { IAmqpBaseRequestInterface } from '@common/modules/ampq/ampq-contracts/shared/amqp-base-request.interface';
import { QueueDeclarationInterface } from '@common/modules/ampq/ampq-contracts/shared/queue-declaration.interface';
import { EXCHANGE_INCTAGRAM } from '@common/modules/ampq/ampq-contracts/consts/inctagram.exchange';

/**
 * @description Payments contract
 */
export namespace PAYMENTS_CONTRACT {
  /**
   * Queue for deactivate last active subscription [QUEUE -> queue_subscriptions]
   */
  export const queue_subscriptions: QueueDeclarationInterface = {
    exchange: EXCHANGE_INCTAGRAM,
    queue: `${EXCHANGE_INCTAGRAM.name}-queue_subscriptions`,
    routingKey: `${EXCHANGE_INCTAGRAM.name}-queue`,
    queueOptions: { durable: true, autoDelete: false },
  };
  /**
   * Queue for successful payments [QUEUE -> queue_payments]
   */
  export const queue_payments: QueueDeclarationInterface = {
    exchange: EXCHANGE_INCTAGRAM,
    queue: `${EXCHANGE_INCTAGRAM.name}-queue_payments`,
    routingKey: `${EXCHANGE_INCTAGRAM.name}-queue`,
    queueOptions: { durable: true, autoDelete: false },
  };
  export type request = IAmqpBaseRequestInterface<IDeactivateLastActiveSubscriptionRequestInterface>;
  export type requestSuccess = IAmqpBaseRequestInterface<ISuccessfulPaymentRequestInterface>;
  export type requestFailed = IAmqpBaseRequestInterface<IFailedPaymentRequestInterface>;

  /**
   * @description Events for payments EVENTS -> PAYMENTS - [successfulPayment, failedPayment], SUBSCRIPTIONS - [deactivateLastActiveSubscription]
   */
  export const EVENTS = {
    PAYMENTS: {
      successfulPayment: `successfulPayment`,
      failedPayment: `failedPayment`,
    },
    SUBSCRIPTIONS: {
      deactivateLastActiveSubscription: `deactivateLastActiveSubscription`,
    },
  };
}

export interface ISuccessfulPaymentRequestInterface {
  sessionId: string;
  customer: string;
  subscription: string;
}
export interface IFailedPaymentRequestInterface {
  sessionId: string;
  customer: string;
}

export interface IDeactivateLastActiveSubscriptionRequestInterface {
  customerId: string;
  subscriptionId: string;
}
