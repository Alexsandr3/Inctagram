import { Inject, Injectable } from '@nestjs/common';
import { ApiConfigService } from '@common/modules/api-config/api.config.service';
import { RabbitMQConfig } from '@golevelup/nestjs-rabbitmq';
import { QueueDeclarationInterface } from '@common/modules/ampq/ampq-contracts/shared/queue-declaration.interface';

export const RABBIT_CONFIG_OPTIONS = 'RABBIT_CONFIG_OPTIONS';
@Injectable()
export class RabbitConfig {
  url: string;
  name: string;
  type: string;
  constructor(@Inject(RABBIT_CONFIG_OPTIONS) private readonly options: ApiConfigService) {
    this.url = options.RABBITMQ_URL;
    // this.name = options.RABBITMQ_NAME;
    // this.type = options.RABBITMQ_TYPE;
  }

  public getModuleOptions(): RabbitMQConfig {
    return {
      exchanges: [
        {
          name: 'inctagram',
          type: 'direct',
        },
      ],
      uri: this.url,
      prefetchCount: 1,
    };
  }
  static getConsumerOptions({ queueName, exchangeName, routingKey }): QueueDeclarationInterface {
    return {
      exchange: exchangeName,
      routingKey: routingKey,
      queue: queueName,
      queueOptions: {
        durable: true,
        autoDelete: false,
      },
    };
  }
}
