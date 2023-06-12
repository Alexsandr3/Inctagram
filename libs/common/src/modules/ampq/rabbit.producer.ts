import { Injectable } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { AMPQ_CONTRACT } from '@common/modules/ampq/ampq-contracts/ampq.contract';
import { OutboxEventEntity } from '@common/modules/outbox/outbox-event.entity';

export abstract class IRabbitProducer {
  abstract sendEvent(event: OutboxEventEntity): Promise<void>;
}

@Injectable()
export class RabbitProducer implements IRabbitProducer {
  constructor(private readonly amqpConnection: AmqpConnection) {}

  async sendEvent(event: OutboxEventEntity): Promise<void> {
    //send to rabbitmq
    await this.amqpConnection.publish(AMPQ_CONTRACT.queue.exchange.name, AMPQ_CONTRACT.queue.routingKey, event);
  }
}
