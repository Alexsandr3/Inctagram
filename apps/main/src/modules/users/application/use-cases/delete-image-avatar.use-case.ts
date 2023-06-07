import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotificationException } from '@common/main/validators/result-notification';
import { IUsersRepository } from '../../infrastructure/users.repository';
import { NotificationCode } from '@common/configuration/notificationCode';
import { ClientImagesService } from '../../../Clients/client-images-service';
import { BaseNotificationUseCase } from '@common/main/use-cases/base-notification.use-case';

/**
 * Delete photo avatar for user command
 */
export class DeleteImageAvatarCommand {
  constructor(public readonly userId: number) {}
}

@CommandHandler(DeleteImageAvatarCommand)
export class DeleteImageAvatarUseCase
  extends BaseNotificationUseCase<DeleteImageAvatarCommand, void>
  implements ICommandHandler<DeleteImageAvatarCommand>
{
  constructor(
    private readonly usersRepository: IUsersRepository,
    private readonly clientsService: ClientImagesService,
  ) {
    super();
  }

  /**
   * @description Checking the user's existence and deleting the avatar
   * @param command
   */
  async executeUseCase(command: DeleteImageAvatarCommand): Promise<void> {
    const { userId } = command;
    //find profile
    const user = await this.usersRepository.findById(userId);
    if (!user) throw new NotificationException(`User with id: ${userId} not found`, 'user', NotificationCode.NOT_FOUND);
    //urls for delete
    const urlsForDelete = user.getAvatarURLsForDeletion();
    //delete image from cloud
    await this.clientsService.deleteImages(...urlsForDelete);
    //delete image from db
    await this.usersRepository.deleteImagesAvatar(userId);
  }
}
