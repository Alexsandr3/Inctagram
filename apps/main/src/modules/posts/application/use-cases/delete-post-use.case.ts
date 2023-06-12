import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IUsersRepository } from '../../../users/infrastructure/users.repository';
import { IPostsRepository } from '../../infrastructure/posts.repository';
import { PostsService } from '../posts.service';
import { BaseNotificationUseCase } from '@common/main/use-cases/base-notification.use-case';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { OUTBOX_EVENT } from '@common/modules/outbox/outbox.processor';
import { MICROSERVICES } from '@common/modules/ampq/ampq-contracts/shared/microservices';

/**
 * Delete post command
 */
export class DeletePostCommand {
  constructor(public dto: { postId: number; userId: number }) {}
}

@CommandHandler(DeletePostCommand)
export class DeletePostUseCase
  extends BaseNotificationUseCase<DeletePostCommand, void>
  implements ICommandHandler<DeletePostCommand>
{
  constructor(
    private readonly usersRepository: IUsersRepository,
    private readonly postsRepository: IPostsRepository,
    private readonly postsService: PostsService,
    private readonly eventEmitter: EventEmitter2,
  ) {
    super();
  }

  /**
   * @description Checking the user's existence and deleting the post
   * @param command
   */
  async executeUseCase(command: DeletePostCommand): Promise<void> {
    const { userId, postId } = command.dto;

    //find post and check owner
    const foundPost = await this.postsService.findPostAndCheckUserForOwner(userId, postId);

    const { post, event } = foundPost.setPostStatusToDeleted(`${MICROSERVICES.MAIN}_${DeletePostUseCase.name}`);

    await this.postsRepository.savePost(post, event);

    this.eventEmitter.emit(OUTBOX_EVENT, event);
  }
}
