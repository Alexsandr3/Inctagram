import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BaseNotificationUseCase } from '@common/main/use-cases/base-notification.use-case';
import { CreateImagesInputDto } from '@images-ms/modules/images/api/input-dto/create-images.input.dto';
import { BaseImageEntity } from '@common/main/entities/base-image.entity';
import { ImagesEditorService } from '@images-ms/modules/images/application/images-editor.service';
import { ImageMain } from '@images-ms/modules/images/domain/image.entity';
import { IImagesRepository } from '@images-ms/modules/images/infrastructure/images.repository';

export class HandleImagesCommand {
  constructor(
    public readonly createSubscriptionDto: CreateImagesInputDto,
    public readonly files: Express.Multer.File[],
  ) {}
}

@CommandHandler(HandleImagesCommand)
export class HandleImagesUseCase
  extends BaseNotificationUseCase<HandleImagesCommand, BaseImageEntity[]>
  implements ICommandHandler<HandleImagesCommand>
{
  constructor(
    private readonly imagesEditorService: ImagesEditorService,
    private readonly imagesRepository: IImagesRepository,
  ) {
    super();
  }

  async executeUseCase(command: HandleImagesCommand): Promise<BaseImageEntity[]> {
    const { files } = command;
    const { userId, type } = command.createSubscriptionDto;
    const handledImages: BaseImageEntity[] = await this.imagesEditorService.generateAndSaveImages(userId, files, type);
    //create instance of image entity
    const imageEntity = ImageMain.create(handledImages);
    //save image entity
    await this.imagesRepository.save(imageEntity);

    return handledImages;
  }
}
