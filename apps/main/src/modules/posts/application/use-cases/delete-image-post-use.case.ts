import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IPostsRepository } from '../../infrastructure/posts.repository';
import { NotificationException } from '@common/main/validators/result-notification';
import { PostsService } from '../posts.service';
import { NotificationCode } from '@common/configuration/notificationCode';
import { BaseNotificationUseCase } from '@common/main/use-cases/base-notification.use-case';
import { Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { OUTBOX_EVENT } from '@common/modules/outbox/outbox.processor';
import { MICROSERVICES } from '@common/modules/ampq/ampq-contracts/shared/microservices';

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
  private readonly logg = new Logger(DeleteImageExistingPostUseCase.name);
  constructor(
    private readonly postsRepository: IPostsRepository,
    private readonly postsService: PostsService,
    private readonly eventEmitter: EventEmitter2,
  ) {
    super();
  }

  /**
   * @description Checking the user's existence and deleting the image
   * @param command
   */
  async executeUseCase(command: DeleteImageExistingPostCommand): Promise<void> {
    const { userId, postId, uploadId } = command;
    //find post and check owner
    const foundPost = await this.postsService.findPostAndCheckUserForOwner(userId, postId);
    //check owner and last image with huge size
    if (foundPost.hasLastImage())
      throw new NotificationException(
        `Post with id: ${foundPost.id} must have at least one image`,
        'post',
        NotificationCode.BAD_REQUEST,
      );
    //change status to deleted for image
    const { post, event } = foundPost.changeStatusToDeletedForImage(
      uploadId,
      `${MICROSERVICES.MAIN}_${DeleteImageExistingPostUseCase.name}`,
    );
    //update post
    await this.postsRepository.savePost(post, event);
    //send message to queue
    this.eventEmitter.emit(OUTBOX_EVENT, event);
  }
}
