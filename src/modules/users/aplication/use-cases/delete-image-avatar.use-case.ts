import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BaseNotificationUseCase } from '../../../../main/use-cases/base-notification.use-case';
import { NotificationException } from '../../../../main/validators/result-notification';
import { NotificationCode } from '../../../../configuration/exception.filter';
import { IUsersRepository } from '../../infrastructure/users.repository';
import { ImagesEditorService } from '../../../images/application/images-editor.service';

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
   * @description Delete photo avatar for user
   * @param command
   */
  async executeUseCase(command: DeleteImageAvatarCommand): Promise<void> {
    const { userId } = command;
    //find profile
    const user = await this.usersRepository.findById(userId);
    if (!user) throw new NotificationException(`User with id: ${userId} not found`, 'user', NotificationCode.NOT_FOUND);
    if (!user.isOwner(userId))
      throw new NotificationException(`Account is not yours`, 'user', NotificationCode.FORBIDDEN);

    //delete image from cloud
    await this.imagesEditor.deleteImages(...user.profile.avatars);
    //delete image from db
    await this.usersRepository.deleteImagesAvatar(userId);
  }
}