import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BaseNotificationUseCase } from '../../../../main/use-cases/base-notification.use-case';
import { S3StorageAdapter } from '../../../../providers/aws/s3-storage.adapter';
import { IProfilesRepository } from '../../infrastructure/profiles.repository';
import { NotificationException } from '../../../../main/validators/result-notification';
import { NotificationCode } from '../../../../configuration/exception.filter';
import { ImageEntity } from '../../domain/image.entity';
import { PhotoSizeModel, UserImagesViewModel } from '../../api/view-models/user-images-view.dto';

export class UploadImageAvatarCommand {
  constructor(public readonly userId: number, public readonly mimetype: string, public readonly photo: Buffer) {}
}

@CommandHandler(UploadImageAvatarCommand)
export class UploadImageAvatarUseCase
  extends BaseNotificationUseCase<UploadImageAvatarCommand, UserImagesViewModel>
  implements ICommandHandler<UploadImageAvatarCommand>
{
  constructor(private readonly storageS3: S3StorageAdapter, private readonly profilesRepo: IProfilesRepository) {
    super();
  }

  /**
   * @description Upload image avatar profile for current user
   * @param command
   */
  async executeUseCase(command: UploadImageAvatarCommand): Promise<UserImagesViewModel> {
    const { userId, photo, mimetype } = command;
    //find profile
    const profile = await this.profilesRepo.findById(userId);
    if (!profile)
      throw new NotificationException(`User with id: ${userId} not has profile`, 'profile', NotificationCode.NOT_FOUND);
    if (!profile.checkOwner(userId))
      throw new NotificationException(`You are not the owner of the profile`, 'profile', NotificationCode.FORBIDDEN);
    const key = `users/${userId}/avatar/${mimetype}`;
    if (profile.images) {
      await this.storageS3.deleteFile(key);
    }
    //save on s3 storage
    const urlImageAvatar = await this.storageS3.saveFile(userId, photo, key, mimetype);
    //creating instance providers image
    const instanceImage = ImageEntity.initCreate(userId, urlImageAvatar, photo);
    //save image profile
    await this.profilesRepo.saveImageProfile(instanceImage);
    const photoSize = new PhotoSizeModel(
      urlImageAvatar.key,
      instanceImage.width,
      instanceImage.height,
      instanceImage.fileSize,
    );

    return new UserImagesViewModel([photoSize]);
  }
}
