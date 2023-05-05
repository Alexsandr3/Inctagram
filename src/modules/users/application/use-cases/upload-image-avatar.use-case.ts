import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BaseNotificationUseCase } from '../../../../main/use-cases/base-notification.use-case';
import { NotificationException } from '../../../../main/validators/result-notification';
import { NotificationCode } from '../../../../configuration/exception.filter';
import { IUsersRepository } from '../../infrastructure/users.repository';
import { ImagesEditorService } from '../../../images/application/images-editor.service';
import { ImageType } from '../../../images/type/image.type';
import { BaseImageEntity } from '../../../images/domain/base-image.entity';
import { AvatarEntity } from '../../domain/avatar.entity';

/**
 * @description Upload image avatar profile command
 */
export class UploadImageAvatarCommand {
  constructor(public readonly userId: number, public readonly file: Express.Multer.File) {}
}

@CommandHandler(UploadImageAvatarCommand)
export class UploadImageAvatarUseCase
  extends BaseNotificationUseCase<UploadImageAvatarCommand, void>
  implements ICommandHandler<UploadImageAvatarCommand>
{
  constructor(private readonly usersRepository: IUsersRepository, private readonly imagesEditor: ImagesEditorService) {
    super();
  }

  /**
   * @description Upload image avatar profile for current user
   * @param command
   */
  async executeUseCase(command: UploadImageAvatarCommand): Promise<void> {
    const { userId, file } = command;
    //find profile
    const user = await this.usersRepository.findById(userId);
    if (!user) throw new NotificationException(`User with id: ${userId} not found`, 'user', NotificationCode.NOT_FOUND);
    if (!user.isOwner(userId))
      throw new NotificationException(`Account is not yours`, 'user', NotificationCode.FORBIDDEN);

    //set type for images
    const type = ImageType.AVATAR;

    //generate keys for images and save images on s3 storage and create instances images
    const result: BaseImageEntity[] = await this.imagesEditor.generateAndSaveImages(user.id, [file], type);
    const avatars = result.map(i => AvatarEntity.initCreate(userId, i));
    //result is array of instances images need to save
    if (!user.profile.avatars || user.profile.avatars.length === 0) {
      await this.usersRepository.addAvatars(userId, avatars);
    } else {
      await this.usersRepository.updateAvatars(userId, avatars);
    }
  }
}
