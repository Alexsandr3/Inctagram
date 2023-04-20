import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BaseNotificationUseCase } from '../../../../main/use-cases/base-notification.use-case';
import { IUsersRepository } from '../../../users/infrastructure/users.repository';
import { ImagesEditorService } from '../../../images/application/images-editor.service';
import { NotificationException } from '../../../../main/validators/result-notification';
import { NotificationCode } from '../../../../configuration/exception.filter';
import { IPostsRepository } from '../../infrastructure/posts.repository';
import { PostStatus } from '../../domain/post.entity';

export class DeleteImagePostCommand {
  constructor(public readonly userId: number, public readonly uploadId: string) {}
}

@CommandHandler(DeleteImagePostCommand)
export class DeleteImagePostUseCase
  extends BaseNotificationUseCase<DeleteImagePostCommand, void>
  implements ICommandHandler<DeleteImagePostCommand>
{
  constructor(
    private readonly usersRepository: IUsersRepository,
    private readonly imagesEditor: ImagesEditorService,
    private readonly postsRepository: IPostsRepository,
  ) {
    super();
  }
  async executeUseCase(command: DeleteImagePostCommand): Promise<void> {
    const { userId, uploadId } = command;
    //find user
    const user = await this.usersRepository.findById(userId);
    if (!user) throw new NotificationException(`User with id: ${userId} not found`, 'user', NotificationCode.NOT_FOUND);
    const metadata = [{ uploadId: uploadId }];
    //find images by uploadId and userId
    const imagesForDelete = await this.postsRepository.findImageByOwnerIdAndResourceIds(
      userId,
      metadata,
      PostStatus.PENDING,
    );
    //urls for delete
    const urlsForDelete = imagesForDelete.map(image => image.url);
    //delete image from aws
    await this.imagesEditor.deleteImageByUrl(urlsForDelete);
    //delete images from db
    await this.postsRepository.deleteImages(imagesForDelete);
  }
}
