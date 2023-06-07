import { QueueDeclarationInterface } from '@common/modules/ampq/ampq-contracts/shared/queue-declaration.interface';
import { EXCHANGE_IMAGES } from '@common/modules/ampq/ampq-contracts/exchanges/images.exchange';
import { AmqpBaseRequestInterface } from '@common/modules/ampq/ampq-contracts/shared/amqp-base-request.interface';
import { AmqpBaseResponseInterface } from '@common/modules/ampq/ampq-contracts/shared/amqp-base-response.interface';

export namespace ImagesContract {
  export const queue: QueueDeclarationInterface = {
    exchange: EXCHANGE_IMAGES,
    queue: `${EXCHANGE_IMAGES.name}-queue`,
    routingKey: `${EXCHANGE_IMAGES.name}-queue`,
    queueOptions: { durable: true },
  };
  export type request = AmqpBaseRequestInterface<string[]>;
  export type response = AmqpBaseResponseInterface<boolean>;

  export const ImageEventType = {
    deleteImages: 'deleteImages',
  };
}
