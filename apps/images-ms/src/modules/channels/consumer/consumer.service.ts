import { Injectable } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { CommandBus } from '@nestjs/cqrs';
import { DeleteImagesCommand } from '@images-ms/modules/images/application/use-cases/delete-images-use.case';
import { ResultNotification } from '@common/main/validators/result-notification';
import { AMPQ_CONTRACT } from '@common/modules/ampq/ampq-contracts/ampq.contract';
import { OutboxEventEntity } from '@common/modules/outbox/outbox-event.entity';

@Injectable()
export class ConsumerService {
  constructor(private readonly commandBus: CommandBus) {}
  @RabbitSubscribe({
    exchange: AMPQ_CONTRACT.queue.exchange.name,
    queue: AMPQ_CONTRACT.queue_images.queue,
    routingKey: AMPQ_CONTRACT.queue.routingKey,
  })
  async deleteImagesByUrls(request: OutboxEventEntity): Promise<void> {
    const { eventName, payload } = request;
    switch (eventName) {
      case AMPQ_CONTRACT.EVENTS.IMAGES.deleteImages:
        // @ts-ignore
        //todo: fix this
        await this.commandBus.execute<DeleteImagesCommand, ResultNotification<void>>(new DeleteImagesCommand(payload));
        break;
      default:
        break;
    }
    return;
  }
}
