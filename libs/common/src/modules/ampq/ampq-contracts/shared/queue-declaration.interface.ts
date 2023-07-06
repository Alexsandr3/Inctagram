import { RabbitExchangeConfigInterface } from '@common/modules/ampq/ampq-contracts/shared/rabbit-exchange-config.interface';
import { QueueOptions } from '@golevelup/nestjs-rabbitmq';

export interface QueueDeclarationInterface {
  exchange: RabbitExchangeConfigInterface;
  routingKey: string;
  queue: string;
  queueOptions?: QueueOptions;
}
