import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PostsEventType } from '../../../main/posts-event.type';
import { ImagesEditorService } from './images-editor.service';

@Injectable()
export class ImagesEventHandlerService {
  constructor(private readonly imagesEditorService: ImagesEditorService) {}

  /**
   * Handle delete images event
   * @param urls
   */
  @OnEvent(PostsEventType.deleteImages)
  async handleDeleteImages(urls: string[]) {
    await this.imagesEditorService.deleteImageByUrl(urls);
  }
}
