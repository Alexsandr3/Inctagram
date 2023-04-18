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

  addImages(...images: ImagePostEntity[]) {
    this.images = [...this.images, ...images];
  }

  async changeStatusToPublished(description: string): Promise<PostEntity> {
    this.description = description;
    this.status = PostStatus.PUBLISHED;
    this.images.forEach(image => image.changeStatusToPublished());
    return this;
  }

  async deleteImage(uploadId: number) {
    this.images = this.images.filter(image => image.id !== uploadId);
    return this;
  }
}