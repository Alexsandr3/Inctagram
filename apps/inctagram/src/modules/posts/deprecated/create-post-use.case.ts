// import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
// import { BaseNotificationUseCase } from '../../../main/use-cases/base-notification.use-case';
// import { ChildMetadataDto } from '../api/input-dto/create-post.input.dto';
// import { NotificationException } from '../../../main/validators/result-notification';
// import { NotificationCode } from '../../../configuration/exception.filter';
// import { IUsersRepository } from '../../users/infrastructure/users.repository';
// import { IPostsRepository } from '../infrastructure/posts.repository';
// import { PostEntity } from '../domain/post.entity';
//
// /**
//  * Create post command
//  */
// export class CreatePostCommand {
//   constructor(
//     public readonly userId: number,
//     public readonly description: string,
//     public readonly childrenMetadata: ChildMetadataDto[],
//   ) {}
// }
//
// @CommandHandler(CreatePostCommand)
// export class CreatePostUseCase
//   extends BaseNotificationUseCase<CreatePostCommand, number>
//   implements ICommandHandler<CreatePostCommand>
// {
//   constructor(private readonly usersRepository: IUsersRepository, private readonly postsRepository: IPostsRepository) {
//     super();
//   }
//
//   /**
//    * @description Checking the user's existence and creating a post
//    * @param command
//    */
//   async executeUseCase(command: CreatePostCommand): Promise<number> {
//     const { userId, description, childrenMetadata } = command;
//     //find user
//     const user = await this.usersRepository.findById(userId);
//     if (!user) throw new NotificationException(`User with id: ${userId} not found`, 'user', NotificationCode.NOT_FOUND);
//     //find all images
//     const images = await this.postsRepository.findImagesByUploadIds(childrenMetadata);
//     //create post
//     const instancePost = PostEntity.initCreate(userId, images, description);
//     //save post
//     return this.postsRepository.createPost(instancePost);
//   }
// }
