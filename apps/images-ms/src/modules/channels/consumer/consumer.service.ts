import { Injectable } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { ImagesContract } from '@common/modules/ampq/ampq-contracts/queues/images/images.contract';
import { ImagesEditorService } from '../../images/application/images-editor.service';

@Injectable()
export class ConsumerService {
  constructor(private readonly imagesEditorService: ImagesEditorService) {}
  @RabbitSubscribe({
    exchange: ImagesContract.queue.exchange.name,
    routingKey: ImagesContract.queue.routingKey,
  })
  async deleteImagesByUrls(request: ImagesContract.request): Promise<void> {
    const { requestId, payload, type, timestamp } = request;
    return this.imagesEditorService.deleteImageByUrl(payload);
  }
}
