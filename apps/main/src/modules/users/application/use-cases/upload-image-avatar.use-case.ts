import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotificationException } from '@common/main/validators/result-notification';
import { IUsersRepository } from '../../infrastructure/users.repository';
import { BaseImageEntity } from '@common/main/entities/base-image.entity';
import { AvatarEntity } from '../../domain/avatar.entity';
import { NotificationCode } from '@common/configuration/notificationCode';
import { BaseNotificationUseCase } from '@common/main/use-cases/base-notification.use-case';
import { ImageType } from '@common/main/entities/type/image.type';
import { ClientImagesService } from '../../../Clients/client-images-service';

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
  constructor(
    private readonly usersRepository: IUsersRepository,
    private readonly clientsService: ClientImagesService,
  ) {
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

    //set type for images-ms
    const type = ImageType.AVATAR;

    //generate keys for images-ms and save images-ms on s3 storage and create instances images-ms
    const result: BaseImageEntity[] = await this.clientsService.generateAndSaveImages(user.id, [file], type);
    const avatars = result.map(i => AvatarEntity.initCreate(userId, i));
    //result is array of instances modules need to save
    if (user.hasProfileAvatar()) {
      await this.usersRepository.addAvatars(userId, avatars);
    } else {
      //urls for delete
      const urlsForDelete = user.getAvatarURLsForDeletion();
      //delete image from cloud
      await this.clientsService.deleteImages(...urlsForDelete);
      //add id for each avatar
      const existingIds = user.getAvatarIds();
      avatars.forEach(avatar => avatar.setId(existingIds.reverse().pop()));
      //update image from db
      await this.usersRepository.updateAvatars(userId, avatars);
    }
  }
}
