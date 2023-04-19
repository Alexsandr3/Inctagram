import { BaseDateEntity } from '../../users/domain/base-date.entity';
import { ImagePostEntity } from './image-post.entity';
import { Type } from 'class-transformer';

export enum PostStatus {
  PUBLISHED = 'PUBLISHED',
  DELETED = 'DELETED',
  PENDING = 'PENDING',
}

export class PostEntity extends BaseDateEntity {
  id: number;
  ownerId: number;
  description: string;
  location: string;
  status: PostStatus;
  @Type(() => ImagePostEntity)
  images: ImagePostEntity[];

  static initCreate(userId: number, images: ImagePostEntity[], description: string) {
    const post = new PostEntity();
    post.ownerId = userId;
    post.status = PostStatus.PUBLISHED;
    post.description = description;
    post.images = images.map(image => image.changeStatusToPublished());
    return post;
  }

  setPostStatusToDeleted() {
    this.status = PostStatus.DELETED;
  }

  updateDescription(description: string) {
    this.description = description;
  }

  isOwner(userId: number) {
    return this.ownerId === userId;
  }
}
