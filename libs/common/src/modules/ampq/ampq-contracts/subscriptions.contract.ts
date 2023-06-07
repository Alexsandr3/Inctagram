import { QueueDeclarationInterface } from '@common/modules/ampq/ampq-contracts/shared/queue-declaration.interface';
import { AmqpBaseRequestInterface } from '@common/modules/ampq/ampq-contracts/shared/amqp-base-request.interface';
import { AmqpBaseResponseInterface } from '@common/modules/ampq/ampq-contracts/shared/amqp-base-response.interface';
import { EXCHANGE_SUBSCRIPTIONS } from '@common/modules/ampq/ampq-contracts/exchanges/subscriptions.exchange';

export namespace SubscriptionsContract {
  export const queue: QueueDeclarationInterface = {
    exchange: EXCHANGE_SUBSCRIPTIONS,
    queue: `${EXCHANGE_SUBSCRIPTIONS.name}-queue`,
    routingKey: `${EXCHANGE_SUBSCRIPTIONS.name}-queue`,
    queueOptions: {
      durable: true,
    },
  };
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
