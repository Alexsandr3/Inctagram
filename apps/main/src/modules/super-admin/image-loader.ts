import { Injectable } from '@nestjs/common';
import { NestDataLoader } from 'nestjs-dataloader';
import DataLoader from 'dataloader';
import { ImageForSuperAdminViewModel } from './api/models/image-for-super-admin-view.model';
import { IPostsRepository } from '../posts/infrastructure/posts.repository';

@Injectable()
export class ImageLoader implements NestDataLoader<number, ImageForSuperAdminViewModel[]> {
  constructor(private readonly postsRepository: IPostsRepository) {}
  generateDataLoader(): DataLoader<number, ImageForSuperAdminViewModel[]> {
    return new DataLoader<number, ImageForSuperAdminViewModel[]>(async (userIds: number[]) => {
      const images = await this.postsRepository.getImages(userIds);
      return userIds.map(userId => images.filter(sub => sub.ownerId === userId));
    });
  }
}
