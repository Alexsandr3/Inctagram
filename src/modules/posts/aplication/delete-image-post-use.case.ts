import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BaseNotificationUseCase } from '../../../main/use-cases/base-notification.use-case';
import { IUsersRepository } from '../../users/infrastructure/users.repository';
import { ImagesEditorService } from '../../images/application/images-editor.service';
import { NotificationException } from '../../../main/validators/result-notification';
import { NotificationCode } from '../../../configuration/exception.filter';
import { IPostsRepository } from '../infrastructure/posts.repository';
import { PostStatus } from '../domain/post.entity';

export class DeleteImagePostCommand {
  constructor(public readonly userId: number, public readonly uploadId: number) {}
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
    //find post by uploadId and userId
    const post = await this.postsRepository.findPostByOwnerIdAndUploadIds(userId, metadata, PostStatus.PUBLISHED);
    if (!post)
      throw new NotificationException(`Post with id: ${post.id} already exists`, 'post', NotificationCode.NOT_FOUND);
    //check length of images
    if (post.images.length === 1)
      throw new NotificationException(
        `Post with id: ${post.id} must have at least one image`,
        'post',
        NotificationCode.NOT_FOUND,
      );
    //delete image from aws
    // await this.imagesEditor.deleteImagesByKeys
    //delete image from post
    post.deleteImage(uploadId);
    //save post
    await this.postsRepository.savePost(post);
  }
}
