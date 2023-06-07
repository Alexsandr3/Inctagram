import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PostsEventType } from '@common/main/posts-event.type';
import { DeleteImagesCommand } from '@images-ms/modules/images/application/use-cases/delete-images-use.case';
import { ResultNotification } from '@common/main/validators/result-notification';
import { CommandBus } from '@nestjs/cqrs';

@Injectable()
export class ImagesEventHandlerService {
  constructor(private readonly commandBus: CommandBus) {}

  /**
   * Handle delete modules event
   * @param urls
   */
  @OnEvent(PostsEventType.deleteImages)
  async handleDeleteImages(urls: string[]): Promise<void> {
    await this.commandBus.execute<DeleteImagesCommand, ResultNotification<void>>(new DeleteImagesCommand(urls));
  }
}
