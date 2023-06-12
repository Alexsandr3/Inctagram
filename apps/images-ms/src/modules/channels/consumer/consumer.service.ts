import { Injectable } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { CommandBus } from '@nestjs/cqrs';
import { DeleteImagesCommand } from '@images-ms/modules/images/application/use-cases/delete-images-use.case';
import { ResultNotification } from '@common/main/validators/result-notification';
import { IMAGES_CONTRACT } from '@common/modules/ampq/ampq-contracts/images.contract';

@Injectable()
export class ConsumerService {
  constructor(private readonly commandBus: CommandBus) {}
  @RabbitSubscribe({
    exchange: IMAGES_CONTRACT.queue.exchange.name,
    queue: IMAGES_CONTRACT.queue.queue,
    routingKey: IMAGES_CONTRACT.queue.routingKey,
  })
  async deleteImagesByUrls(request: IMAGES_CONTRACT.request): Promise<void> {
    const { eventName, payload } = request;
    switch (eventName) {
      case IMAGES_CONTRACT.EVENTS.deleteImages:
        await this.commandBus.execute<DeleteImagesCommand, ResultNotification<void>>(
          new DeleteImagesCommand(payload.urls),
        );
        break;
      default:
        break;
    }
    return;
  }
}
