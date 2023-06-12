import { AmqpBaseRequestInterface } from '@common/modules/ampq/ampq-contracts/shared/amqp-base-request.interface';
import { AmqpBaseResponseInterface } from '@common/modules/ampq/ampq-contracts/shared/amqp-base-response.interface';

export namespace SubscriptionsContract {
  // export const queue: QueueDeclarationInterface = {
  //   exchange: EXCHANGE_SUBSCRIPTIONS,
  //   queue: `${EXCHANGE_SUBSCRIPTIONS.name}-queue`,
  //   routingKey: `${EXCHANGE_SUBSCRIPTIONS.name}-queue`,
  //   queueOptions: {
  //     durable: true,
  //   },
  // };
  export type request = AmqpBaseRequestInterface<DeactivateLastActiveSubscriptionRequestInterface>;
  export type response = AmqpBaseResponseInterface<any>;
  export const SubscriptionEventType = {
    deactivateLastActiveSubscription: `deactivateLastActiveSubscription`,
  };
}

export interface DeactivateLastActiveSubscriptionRequestInterface {
  customerId: string;
  subscriptionId: string;
}
