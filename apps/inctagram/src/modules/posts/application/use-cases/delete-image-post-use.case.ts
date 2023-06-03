import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IPostsRepository } from '../../infrastructure/posts.repository';
import { NotificationException } from '@common/main/validators/result-notification';
import { PostsService } from '../posts.service';
import { NotificationCode } from '@common/configuration/notificationCode';
import { BaseNotificationUseCase } from '@common/main/use-cases/base-notification.use-case';

/**
 * Delete image command
 */
export class DeleteImageExistingPostCommand {
  constructor(public readonly userId: number, public readonly postId: number, public readonly uploadId: string) {}
}

@CommandHandler(DeleteImageExistingPostCommand)
export class DeleteImageExistingPostUseCase
  extends BaseNotificationUseCase<DeleteImageExistingPostCommand, void>
  implements ICommandHandler<DeleteImageExistingPostCommand>
{
  constructor(private readonly postsRepository: IPostsRepository, private readonly postsService: PostsService) {
    super();
  }

  /**
   * @description Checking the user's existence and deleting the image
   * @param command
   */
  async executeUseCase(command: DeleteImageExistingPostCommand): Promise<void> {
    const { userId, postId, uploadId } = command;
    //find post and check owner
    const post = await this.postsService.findPostAndCheckUserForOwner(userId, postId);
    //check owner and last image with huge size
    if (post.hasLastImage())
      throw new NotificationException(
        `Post with id: ${post.id} must have at least one image`,
        'post',
        NotificationCode.BAD_REQUEST,
      );
    //change status to deleted for image
    post.changeStatusToDeletedForImage(uploadId);
    //update post
    await this.postsRepository.savePost(post);
  }
}
