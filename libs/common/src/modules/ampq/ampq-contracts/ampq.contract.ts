import { EXCHANGE_INCTAGRAM } from '@common/modules/ampq/ampq-contracts/consts/inctagram.exchange';
import { QueueDeclarationInterface } from '@common/modules/ampq/ampq-contracts/shared/queue-declaration.interface';

export namespace AMPQ_CONTRACT {
  export const queue: QueueDeclarationInterface = {
    exchange: EXCHANGE_INCTAGRAM,
    queue: `${EXCHANGE_INCTAGRAM.name}-queue`,
    routingKey: `${EXCHANGE_INCTAGRAM.name}-queue`,
    queueOptions: { durable: true, autoDelete: false },
  };
}
