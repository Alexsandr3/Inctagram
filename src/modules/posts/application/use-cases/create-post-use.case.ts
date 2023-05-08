import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BaseNotificationUseCase } from '../../../../main/use-cases/base-notification.use-case';
import { IUsersRepository } from '../../../users/infrastructure/users.repository';
import { ImagesEditorService } from '../../../images/application/images-editor.service';
import { IPostsRepository } from '../../infrastructure/posts.repository';
import { ImageType } from '../../../images/type/image.type';
import { PostEntity } from '../../domain/post.entity';
import { NotificationException } from '../../../../main/validators/result-notification';
import { NotificationCode } from '../../../../configuration/exception.filter';

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
    private readonly imagesEditor: ImagesEditorService,
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
    //set type  for images
    const type = ImageType.POST;
    //generate keys for images and save images on s3 storage and create instances images
    const post = PostEntity.create(userId, description);
    try {
      const images = await this.imagesEditor.generateAndSaveImages(userId, files, type);
      //create instance post
      post.addImages(userId, images);
      //save post in db
      return await this.postsRepository.createPostWithImages(post);
    } catch (e) {
      console.log(e);
      //delete images from s3 storage
      await this.imagesEditor.deleteImages(...post.images);
    }
  }
}
