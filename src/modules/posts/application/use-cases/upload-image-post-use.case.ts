import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BaseNotificationUseCase } from '../../../../main/use-cases/base-notification.use-case';
import { ImageType } from '../../../images/type/image.type';
import { IUsersRepository } from '../../../users/infrastructure/users.repository';
import { ImagesEditorService } from '../../../images/application/images-editor.service';
import { NotificationException } from '../../../../main/validators/result-notification';
import { NotificationCode } from '../../../../configuration/exception.filter';
import { ImageSizeType } from '../../../images/type/image-size.type';
import { BaseImageEntity } from '../../../images/domain/base-image.entity';
import { IPostsRepository } from '../../infrastructure/posts.repository';
import { ImagePostEntity } from '../../domain/image-post.entity';

export class UploadImagePostCommand {
  constructor(public readonly userId: number, public readonly mimetype: string, public readonly photo: Buffer) {}
}

@CommandHandler(UploadImagePostCommand)
export class UploadImagePostUseCase
  extends BaseNotificationUseCase<UploadImagePostCommand, { fieldId: string }[]>
  implements ICommandHandler<UploadImagePostCommand>
{
  constructor(
    private readonly usersRepository: IUsersRepository,
    private readonly imagesEditor: ImagesEditorService,
    private readonly postsRepository: IPostsRepository,
  ) {
    super();
  }
  async executeUseCase(command: UploadImagePostCommand): Promise<{ fieldId: string }[]> {
    const { userId, photo, mimetype } = command;
    //find user
    const user = await this.usersRepository.findById(userId);
    if (!user) throw new NotificationException(`User with id: ${userId} not found`, 'user', NotificationCode.NOT_FOUND);
    //set type and sizes for images
    const type = ImageType.POST;
    const sizes = [ImageSizeType.HUGE_HD, ImageSizeType.SMALL];
    //generate keys for images and save images on s3 storage and create instances images
    const result: BaseImageEntity[] = await this.imagesEditor.generatorKeysWithSaveImagesAndCreateImages(
      user.id,
      photo,
      type,
      mimetype,
      sizes,
    );
    const postImage = result.map(i => ImagePostEntity.initCreate(userId, i));
    //save images
    await this.postsRepository.saveImages(postImage);
    return postImage.map(i => ({ fieldId: i.fieldId }));
  }
}
