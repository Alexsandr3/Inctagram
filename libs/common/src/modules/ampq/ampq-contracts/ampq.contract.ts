import { AmqpBaseRequestInterface } from '@common/modules/ampq/ampq-contracts/shared/amqp-base-request.interface';
import { AmqpBaseResponseInterface } from '@common/modules/ampq/ampq-contracts/shared/amqp-base-response.interface';
import { EXCHANGE_INCTAGRAM } from '@common/modules/ampq/ampq-contracts/inctagram.exchange';
import { QueueDeclarationInterface } from '@common/modules/ampq/ampq-contracts/shared/queue-declaration.interface';

export namespace AMPQ_CONTRACT {
  export const queue: QueueDeclarationInterface = {
    exchange: EXCHANGE_INCTAGRAM,
    queue: `${EXCHANGE_INCTAGRAM.name}-queue`,
    routingKey: `${EXCHANGE_INCTAGRAM.name}-queue`,
    queueOptions: { durable: true, autoDelete: false },
  };
  export const queue_images: QueueDeclarationInterface = {
    exchange: EXCHANGE_INCTAGRAM,
    queue: `${EXCHANGE_INCTAGRAM.name}-queue_images`,
    routingKey: `${EXCHANGE_INCTAGRAM.name}-queue`,
    queueOptions: { durable: true, autoDelete: false },
  };

  export const queue_payments: QueueDeclarationInterface = {
    exchange: EXCHANGE_INCTAGRAM,
    queue: `${EXCHANGE_INCTAGRAM.name}-queue_payments`,
    routingKey: `${EXCHANGE_INCTAGRAM.name}-queue`,
    queueOptions: { durable: true, autoDelete: false },
  };

  export type request = AmqpBaseRequestInterface<{}>;
  export type response = AmqpBaseResponseInterface<{}>;

  export const EVENTS = {
    IMAGES: {
      deleteImages: 'deleteImages',
    },
    PAYMENTS: {
      successfulPayment: `successfulPayment`,
      failedPayment: `failedPayment`,
    },
    SUBSCRIPTIONS: {
      deactivateLastActiveSubscription: `deactivateLastActiveSubscription`,
    },
  };
}
