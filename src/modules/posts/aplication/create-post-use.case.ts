import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BaseNotificationUseCase } from '../../../main/use-cases/base-notification.use-case';
import { ChildMetadataDto } from '../api/input-dto/create-post.input.dto';
import { NotificationException } from '../../../main/validators/result-notification';
import { NotificationCode } from '../../../configuration/exception.filter';
import { IUsersRepository } from '../../users/infrastructure/users.repository';
import { IPostsRepository } from '../infrastructure/posts.repository';

export class CreatePostCommand {
  constructor(
    public readonly userId: number,
    public readonly description: string,
    public readonly childrenMetadata: ChildMetadataDto[],
  ) {}
}

@CommandHandler(CreatePostCommand)
export class CreatePostUseCase
  extends BaseNotificationUseCase<CreatePostCommand, void>
  implements ICommandHandler<CreatePostCommand>
{
  constructor(private readonly usersRepository: IUsersRepository, private readonly postsRepository: IPostsRepository) {
    super();
  }
  async executeUseCase(command: CreatePostCommand): Promise<void> {
    const { userId, description, childrenMetadata } = command;
    //find user
    const user = await this.usersRepository.findById(userId);
    if (!user) throw new NotificationException(`User with id: ${userId} not found`, 'user', NotificationCode.NOT_FOUND);
    //find post
    const post = await this.postsRepository.findPostByOwnerIdAndUploadIds(userId, childrenMetadata);
    if (!post)
      throw new NotificationException(`Post with id: ${post.id} already exists`, 'post', NotificationCode.NOT_FOUND);
    //change status of images and post
    const changePost = await post.changeStatusToPublished(description);
    //save post
    await this.postsRepository.savePost(changePost);
  }
}
