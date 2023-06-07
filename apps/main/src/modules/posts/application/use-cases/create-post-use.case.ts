import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IUsersRepository } from '../../../users/infrastructure/users.repository';
import { IPostsRepository } from '../../infrastructure/posts.repository';
import { PostEntity } from '../../domain/post.entity';
import { NotificationException } from '@common/main/validators/result-notification';
import { NotificationCode } from '@common/configuration/notificationCode';
import { BaseNotificationUseCase } from '@common/main/use-cases/base-notification.use-case';
import { ImageType } from '@common/main/entities/type/image.type';
import { ClientImagesService } from '../../../Clients/client-images-service';

/**
 * Upload image post command
 */
export class CreatePostWithUploadImagesCommand {
  constructor(
    public readonly userId: number,
    public readonly files: Express.Multer.File[],
    public readonly description: string,
  ) {}
}

@CommandHandler(CreatePostWithUploadImagesCommand)
export class CreatePostWithUploadImagesUseCase
  extends BaseNotificationUseCase<CreatePostWithUploadImagesCommand, number>
  implements ICommandHandler<CreatePostWithUploadImagesCommand>
{
  constructor(
    private readonly usersRepository: IUsersRepository,
    private readonly clientService: ClientImagesService,
    private readonly postsRepository: IPostsRepository,
  ) {
    super();
  }

  /**
   * @description Checking the user's existence and upload image
   * @param command
   */
  async executeUseCase(command: CreatePostWithUploadImagesCommand): Promise<number> {
    const { userId, files, description } = command;
    //find user
    const user = await this.usersRepository.findById(userId);
    if (!user) throw new NotificationException(`User with id: ${userId} not found`, 'user', NotificationCode.NOT_FOUND);
    //set type  for modules
    const type = ImageType.POST;
    //generate keys for modules and save modules on s3 storage and create instances modules
    const post = PostEntity.create(userId, description);
    try {
      const images = await this.clientService.generateAndSaveImages(userId, files, type);
      //create instance post
      post.addImages(userId, images);
      //save post in db
      return await this.postsRepository.createPostWithImages(post);
    } catch (e) {
      console.log(e);
      //delete modules from s3 storage
      const keys = post.images.map(image => image.url);
      await this.clientService.deleteImages(...keys);
    }
  }
}
