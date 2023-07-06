import { QueueDeclarationInterface } from '@common/modules/ampq/ampq-contracts/shared/queue-declaration.interface';
import { EXCHANGE_INCTAGRAM } from '@common/modules/ampq/ampq-contracts/consts/inctagram.exchange';
import { IAmqpBaseRequestInterface } from '@common/modules/ampq/ampq-contracts/shared/amqp-base-request.interface';
import { IAmqpBaseResponseInterface } from '@common/modules/ampq/ampq-contracts/shared/amqp-base-response.interface';

/**
 * @description Images contract
 */
export namespace IMAGES_CONTRACT {
  /**
   * @description Queue for images [QUEUE -> queue_images]
   */
  export const queue: QueueDeclarationInterface = {
    exchange: EXCHANGE_INCTAGRAM,
    queue: `${EXCHANGE_INCTAGRAM.name}-queue_images`,
    routingKey: `${EXCHANGE_INCTAGRAM.name}-queue`,
    queueOptions: { durable: true, autoDelete: false },
  };
  export type request = IAmqpBaseRequestInterface<IDeleteImagesRequestInterface>;
  export type response = IAmqpBaseResponseInterface<boolean>;

  /**
   * @description Events for images EVENTS -> IMAGES - [deleteImages]
   */
  export const EVENTS = {
    deleteImages: 'deleteImages',
  };
}

export interface IDeleteImagesRequestInterface {
  urls: string[];
}
