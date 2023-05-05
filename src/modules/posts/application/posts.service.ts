import { PostEntity } from '../domain/post.entity';
import { NotificationException } from '../../../main/validators/result-notification';
import { NotificationCode } from '../../../configuration/exception.filter';
import { IUsersRepository } from '../../users/infrastructure/users.repository';
import { IPostsRepository } from '../infrastructure/posts.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PostsService {
  constructor(private readonly usersRepository: IUsersRepository, private readonly postsRepository: IPostsRepository) {}

  /**
   * Find post and check user for owner
   * @param userId
   * @param postId
   */
  async findPostAndCheckUserForOwner(userId: number, postId: number): Promise<PostEntity> {
    //find post with owner
    const { post, owner } = await this.postsRepository.findPostWithOwnerById(postId);
    if (!post) throw new NotificationException(`Post with id: ${postId} not found`, 'post', NotificationCode.NOT_FOUND);
    if (!owner) {
      throw new NotificationException(`User with id: ${userId} not found`, 'user', NotificationCode.NOT_FOUND);
    }

    //check user for post owner
    if (!post.isOwner(userId))
      throw new NotificationException(
        `User with id: ${userId} is not the owner of: ${post.id}`,
        'post',
        NotificationCode.FORBIDDEN,
      );
    return post;
  }
}
