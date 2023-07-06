// import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
// import { BaseNotificationUseCase } from '../../../../main/use-cases/base-notification.use-case';
// import { ImageType } from '../../../modules/type/image.type';
// import { IUsersRepository } from '../../../users/infrastructure/users.repository';
// import { ImagesEditorService } from '../../../modules/application/modules-editor.service';
// import { NotificationException } from '../../../../main/validators/result-notification';
// import { NotificationCode } from '../../../../configuration/exception.filter';
// import { BaseImageEntity } from '../../../modules/domain/base-image.entity';
// import { IPostsRepository } from '../../infrastructure/posts.repository';
// import { ImagePostEntity } from '../../domain/image-post.entity';
//
// /**
//  * Upload image post command
//  */
// export class UploadImagePostCommand {
//   constructor(public readonly userId: number, public readonly file: Express.Multer.File) {}
// }
//
// @CommandHandler(UploadImagePostCommand)
// export class UploadImagePostUseCase
//   extends BaseNotificationUseCase<UploadImagePostCommand, string>
//   implements ICommandHandler<UploadImagePostCommand>
// {
//   constructor(
//     private readonly usersRepository: IUsersRepository,
//     private readonly imagesEditor: ImagesEditorService,
//     private readonly postsRepository: IPostsRepository,
//   ) {
//     super();
//   }
//
//   /**
//    * @description Checking the user's existence and upload image
//    * @param command
//    */
//   async executeUseCase(command: UploadImagePostCommand): Promise<string> {
//     const { userId, file } = command;
//     //find user
//     const user = await this.usersRepository.findById(userId);
//     if (!user) throw new NotificationException(`User with id: ${userId} not found`, 'user', NotificationCode.NOT_FOUND);
//     //set type  for modules
//     const type = ImageType.POST;
//     //generate keys for modules and save modules on s3 storage and create instances modules
//     const result: BaseImageEntity[] = await this.imagesEditor.generateAndSaveImages(user.id, [file], type);
//     const postImage = result.map(i => ImagePostEntity.initCreate(userId, i));
//     //save modules
//     await this.postsRepository.saveImages(postImage);
//     //return resourceId for save in db instance modules
//     return result[0].resourceId;
//   }
// }
