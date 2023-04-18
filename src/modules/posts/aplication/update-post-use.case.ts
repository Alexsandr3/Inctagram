import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BaseNotificationUseCase } from '../../../main/use-cases/base-notification.use-case';
import { IUsersRepository } from '../../users/infrastructure/users.repository';
import { IPostsRepository } from '../infrastructure/posts.repository';
import { NotificationException } from '../../../main/validators/result-notification';
import { NotificationCode } from '../../../configuration/exception.filter';
import { UpdatePostInputDto } from '../api/input-dto/update-post.input.dto';

export class UpdatePostCommand {
  constructor(public dto: { postId: number; userId: number; body: UpdatePostInputDto }) {}
}

@CommandHandler(UpdatePostCommand)
export class UpdatePostUseCase
  extends BaseNotificationUseCase<UpdatePostCommand, void>
  implements ICommandHandler<UpdatePostCommand>
{
  constructor(private readonly usersRepository: IUsersRepository, private readonly postsRepository: IPostsRepository) {
    super();
  }

  async executeUseCase(command: UpdatePostCommand): Promise<void> {
    const { userId, postId, body } = command.dto;
    //find user
    const user = await this.usersRepository.findById(userId);
    if (!user) throw new NotificationException(`User with id: ${userId} not found`, 'user', NotificationCode.NOT_FOUND);
    //find post
    const post = await this.postsRepository.findPostById(postId);
    if (!post) throw new NotificationException(`Post with id: ${postId} not found`, 'post', NotificationCode.NOT_FOUND);

    //check user for post owner
    if (!user.isOwner(post.ownerId))
      throw new NotificationException(
        `User with id: ${userId} is not owner of: ${post.id}`,
        'post',
        NotificationCode.FORBIDDEN,
      );

    post.updateDescription(body.description);
    await this.postsRepository.savePost(post);
  }
}
