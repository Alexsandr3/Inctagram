import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BaseNotificationUseCase } from '../../../../main/use-cases/base-notification.use-case';
import { S3StorageAdapter } from '../../../../providers/aws/s3-storage.adapter';
import { NotificationException } from '../../../../main/validators/result-notification';
import { NotificationCode } from '../../../../configuration/exception.filter';
import { ImageEntity, sizeImageAvatar } from '../../domain/image.entity';
import { PhotoSizeModel, UserImagesViewModel } from '../../api/view-models/user-images-view.dto';
import { reSizeImage } from '../../../../main/helpers/re-size.image';
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
    const format = mimetype.replace('image/', '.');
    //find profile
    const user = await this.usersRepository.findById(userId);

    if (!user) throw new NotificationException(`User with id: ${userId} not found`, 'user', NotificationCode.NOT_FOUND);
    if (!user.isOwner(userId))
      throw new NotificationException(`Account is not yours`, 'user', NotificationCode.FORBIDDEN);
    if (!user.profile)
      throw new NotificationException(`User with id: ${userId} not has profile`, 'profile', NotificationCode.NOT_FOUND);

    const mediumKey = `users/${userId}/avatar-${sizeImageAvatar.MEDIUM.defaultWidth}x${sizeImageAvatar.MEDIUM.defaultHeight}${format}`;
    const thumbnailKey = `users/${userId}/avatar-${sizeImageAvatar.THUMBNAIL.defaultWidth}x${sizeImageAvatar.THUMBNAIL.defaultHeight}${format}`;
    const keys = [mediumKey, thumbnailKey];

    //changing size image
    const [mediumPhoto, thumbnailPhoto] = await Promise.all([
      reSizeImage(photo, sizeImageAvatar.MEDIUM.defaultWidth, sizeImageAvatar.MEDIUM.defaultHeight),
      reSizeImage(photo, sizeImageAvatar.THUMBNAIL.defaultWidth, sizeImageAvatar.THUMBNAIL.defaultHeight),
    ]);

    //delete old image
    if (user.profile.images) {
      for (const keyImage of keys) {
        await this.storageS3.deleteFile(keyImage);
      }
    }

    //save on s3 storage
    const [urlImageMediumAvatar, urlImageThumbnailAvatar] = await Promise.all([
      this.storageS3.saveFile(userId, mediumPhoto, mediumKey, mimetype),
      this.storageS3.saveFile(userId, thumbnailPhoto, thumbnailKey, mimetype),
    ]);

    //creating instance providers image
    const [imageAvatarMediumSize, imageAvatarThumbnailSize] = await Promise.all([
      ImageEntity.initCreateMediumSize(userId, urlImageMediumAvatar, mediumPhoto),
      ImageEntity.initCreateThumbnailSize(userId, urlImageThumbnailAvatar, thumbnailPhoto),
    ]);

    //save image profile
    await Promise.all([
      this.usersRepository.saveImageProfile(imageAvatarMediumSize),
      this.usersRepository.saveImageProfile(imageAvatarThumbnailSize),
    ]);

    const photoMediumSize = new PhotoSizeModel(
      urlImageMediumAvatar.key,
      imageAvatarMediumSize.width,
      imageAvatarMediumSize.height,
      imageAvatarMediumSize.fileSize,
    );

    const photoThumbnailSize = new PhotoSizeModel(
      urlImageThumbnailAvatar.key,
      imageAvatarThumbnailSize.width,
      imageAvatarThumbnailSize.height,
      imageAvatarThumbnailSize.fileSize,
    );

    return new UserImagesViewModel([photoMediumSize, photoThumbnailSize]);
  }
}
