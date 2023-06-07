import { Injectable } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { ImagesContract } from '@common/modules/ampq/ampq-contracts/images.contract';
import { CommandBus } from '@nestjs/cqrs';
import { DeleteImagesCommand } from '@images-ms/modules/images/application/use-cases/delete-images-use.case';
import { ResultNotification } from '@common/main/validators/result-notification';

@Injectable()
export class ConsumerService {
  constructor(private readonly commandBus: CommandBus) {}
  @RabbitSubscribe({
    exchange: ImagesContract.queue.exchange.name,
    routingKey: ImagesContract.queue.routingKey,
  })
  async deleteImagesByUrls(request: ImagesContract.request): Promise<void> {
    const { event } = request.type;
    switch (event) {
      case ImagesContract.ImageEventType.deleteImages:
        await this.commandBus.execute<DeleteImagesCommand, ResultNotification<void>>(
          new DeleteImagesCommand(request.payload),
        );
        break;
      default:
        break;
    }
    return;
  }
}
