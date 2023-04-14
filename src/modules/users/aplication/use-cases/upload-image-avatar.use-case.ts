import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BaseNotificationUseCase } from '../../../../main/use-cases/base-notification.use-case';
import { S3StorageAdapter } from '../../../../providers/aws/s3-storage.adapter';
import { NotificationException } from '../../../../main/validators/result-notification';
import { NotificationCode } from '../../../../configuration/exception.filter';
import { ImageEntity } from '../../domain/image.entity';
import { PhotoSizeModel, UserImagesViewModel } from '../../api/view-models/user-images-view.dto';
import { IUsersRepository } from '../../infrastructure/users.repository';

export class UploadImageAvatarCommand {
  constructor(public readonly userId: number, public readonly mimetype: string, public readonly photo: Buffer) {}
}

@CommandHandler(UploadImageAvatarCommand)
export class UploadImageAvatarUseCase
  extends BaseNotificationUseCase<UploadImageAvatarCommand, UserImagesViewModel>
  implements ICommandHandler<UploadImageAvatarCommand>
{
  constructor(private readonly storageS3: S3StorageAdapter, private readonly usersRepository: IUsersRepository) {
    super();
  }

  /**
   * @description Upload image avatar profile for current user
   * @param command
   */
  async executeUseCase(command: UploadImageAvatarCommand): Promise<UserImagesViewModel> {
    const { userId, photo, mimetype } = command;
    //find profile
    const user = await this.usersRepository.findById(userId);

    if (!user) throw new NotificationException(`User with id: ${userId} not found`, 'user', NotificationCode.NOT_FOUND);
    if (!user.isOwner(userId))
      throw new NotificationException(`Account is not yours`, 'user', NotificationCode.FORBIDDEN);
    if (!user.profile)
      throw new NotificationException(`User with id: ${userId} not has profile`, 'profile', NotificationCode.NOT_FOUND);

    const key = `users/${userId}/avatar/${mimetype}`;
    if (user.profile.images) {
      await this.storageS3.deleteFile(key);
    }

    //save on s3 storage
    const urlImageAvatar = await this.storageS3.saveFile(userId, photo, key, mimetype);
    //creating instance providers image
    const instanceImage = ImageEntity.initCreate(userId, urlImageAvatar, photo);
    //save image profile
    await this.usersRepository.saveImageProfile(instanceImage);
    const photoSize = new PhotoSizeModel(
      urlImageAvatar.key,
      instanceImage.width,
      instanceImage.height,
      instanceImage.fileSize,
    );

    return new UserImagesViewModel([photoSize]);
  }
}
