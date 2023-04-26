import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BaseNotificationUseCase } from '../../../../main/use-cases/base-notification.use-case';
import { IUsersRepository } from '../../../users/infrastructure/users.repository';
import { IPostsRepository } from '../../infrastructure/posts.repository';
import { UpdatePostInputDto } from '../../api/input-dto/update-post.input.dto';
import { PostsService } from '../posts.service';

/**
 * Update post command
 */
export class UpdatePostCommand {
  constructor(public dto: { postId: number; userId: number; body: UpdatePostInputDto }) {}
}

@CommandHandler(UpdatePostCommand)
export class UpdatePostUseCase
  extends BaseNotificationUseCase<UpdatePostCommand, void>
  implements ICommandHandler<UpdatePostCommand>
{
  constructor(
    private readonly usersRepository: IUsersRepository,
    private readonly postsRepository: IPostsRepository,
    private readonly postsService: PostsService,
  ) {
    super();
  }

  /**
   * @description Checking the user's existence and updating the post
   * @param command
   */
  async executeUseCase(command: UpdatePostCommand): Promise<void> {
    const { userId, postId, body } = command.dto;

    //find post and check owner
    const post = await this.postsService.findPostAndCheckUserForOwner(userId, postId);

    post.updateDescription(body.description);
    await this.postsRepository.savePost(post);
  }
}
