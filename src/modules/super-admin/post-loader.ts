import { Injectable } from '@nestjs/common';
import { NestDataLoader } from 'nestjs-dataloader';
import { PostForSuperAdminViewModel } from './api/models/post-for-super-admin-view.model';
import { IPostsRepository } from '../posts/infrastructure/posts.repository';
import DataLoader from 'dataloader';

@Injectable()
export class PostLoader implements NestDataLoader<number, PostForSuperAdminViewModel[]> {
  constructor(private readonly postsRepository: IPostsRepository) {}
  generateDataLoader(): DataLoader<number, PostForSuperAdminViewModel[]> {
    return new DataLoader<number, PostForSuperAdminViewModel[]>(async (userIds: number[]) => {
      const posts = await this.postsRepository.getPostsByIds(userIds);
      // const postsByUserIds = userIds.map(userId => posts.filter(post => post.ownerId === userId));
      return userIds.map(userId => posts.filter(post => post.ownerId === userId));
    });
  }
}
