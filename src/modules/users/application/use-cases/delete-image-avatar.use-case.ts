import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BaseNotificationUseCase } from '../../../../main/use-cases/base-notification.use-case';
import { NotificationException } from '../../../../main/validators/result-notification';
import { NotificationCode } from '../../../../configuration/exception.filter';
import { IUsersRepository } from '../../infrastructure/users.repository';
import { ImagesEditorService } from '../../../images/application/images-editor.service';

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
  constructor(private readonly usersRepository: IUsersRepository, private readonly imagesEditor: ImagesEditorService) {
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
    await this.imagesEditor.deleteImageByUrl(urlsForDelete);
    //delete image from db
    await this.usersRepository.deleteImagesAvatar(userId);
  }
}
