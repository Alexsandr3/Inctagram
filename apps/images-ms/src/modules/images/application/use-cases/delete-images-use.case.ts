import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BaseNotificationUseCase } from '@common/main/use-cases/base-notification.use-case';
import { ImagesEditorService } from '@images-ms/modules/images/application/images-editor.service';
import { IImagesRepository } from '@images-ms/modules/images/infrastructure/images.repository';
import { Logger } from '@nestjs/common';

export class DeleteImagesCommand {
  constructor(public readonly keys: string[]) {}
}

@CommandHandler(DeleteImagesCommand)
export class DeleteImagesUseCase
  extends BaseNotificationUseCase<DeleteImagesCommand, void>
  implements ICommandHandler<DeleteImagesCommand>
{
  private logg = new Logger(DeleteImagesUseCase.name);
  constructor(
    private readonly imagesEditorService: ImagesEditorService,
    private readonly imagesRepository: IImagesRepository,
  ) {
    super();
  }

  async executeUseCase(command: DeleteImagesCommand): Promise<void> {
    const { keys } = command;
    //find images by keys
    const images = await this.imagesRepository.findImagesByKeys(keys);
    //update status images
    const imagesUpdated = images.map(image => {
      image.changeStatusDeleted();
      return image;
    });
    //save images
    await this.imagesRepository.save(imagesUpdated);
    //delete images from aws
    await this.imagesEditorService.deleteImageByUrl(keys);
    this.logg.log(`Images deleted: ${keys}`, DeleteImagesUseCase.name);
  }
}
