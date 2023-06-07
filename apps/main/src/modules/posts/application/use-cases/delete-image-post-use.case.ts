import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IPostsRepository } from '../../infrastructure/posts.repository';
import { NotificationException } from '@common/main/validators/result-notification';
import { PostsService } from '../posts.service';
import { NotificationCode } from '@common/configuration/notificationCode';
import { BaseNotificationUseCase } from '@common/main/use-cases/base-notification.use-case';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { ImagesContract } from '@common/modules/ampq/ampq-contracts/images.contract';
import { randomUUID } from 'crypto';
import { MICROSERVICES } from '@common/modules/ampq/ampq-contracts/shared/microservices';
import { Logger } from '@nestjs/common';

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
    private readonly amqpConnection: AmqpConnection,
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
    //send message to queue
    // this.eventEmitter.emit(PostsEventType.deleteImages, keys);
    const message: ImagesContract.request = {
      requestId: randomUUID(),
      payload: post.getImagesUrlsForDelete(uploadId),
      timestamp: Date.now(),
      type: {
        microservice: MICROSERVICES.MAIN,
        event: ImagesContract.ImageEventType.deleteImages,
      },
    };
    //send to rabbitmq
    await this.amqpConnection.publish<ImagesContract.request>(
      ImagesContract.queue.exchange.name,
      ImagesContract.queue.routingKey,
      message,
    );
    this.logg.log(
      `Message sent to queue ${ImagesContract.queue.exchange.name} with message ${JSON.stringify(message)} from ${
        DeleteImageExistingPostUseCase.name
      }`,
    );
  }
}
