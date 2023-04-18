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

  static initCreate(userId: number) {
    const post = new PostEntity();
    post.ownerId = userId;
    post.status = PostStatus.PENDING;
    post.images = [];
    return post;
  }

  addImagesAndFilterNew(...images: ImagePostEntity[]): PostEntity {
    const res = this.images.filter(image => !image.id);
    this.images = [...res, ...images];
    return this;
  }

  async changeStatusToPublished(description: string): Promise<PostEntity> {
    this.description = description;
    this.status = PostStatus.PUBLISHED;
    this.images.forEach(image => image.changeStatusToPublished());
    return this;
  }

  setImageStatusToDeleted(uploadId: number) {
    this.images.map(image => {
      image.id === uploadId ? image.changeStatusToDeleted() : image;
    });
    return this;
  }

  setPostStatusToDeleted() {
    this.status = PostStatus.DELETED;
  }
}
