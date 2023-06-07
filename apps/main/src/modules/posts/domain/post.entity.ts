import { ImagePostEntity } from './image-post.entity';
import { Type } from 'class-transformer';
import { Post } from '@prisma/client';
import { BaseImageEntity } from '@common/main/entities/base-image.entity';
import { PostStatus } from '@common/main/types/post-status.type';
import { BaseDateEntity } from '@common/main/entities/base-date.entity';

export class PostEntity extends BaseDateEntity implements Post {
  id: number;
  ownerId: number;
  description: string;
  location: string;
  status: PostStatus;
  @Type(() => ImagePostEntity)
  images: ImagePostEntity[];
  constructor() {
    super();
  }

  static initCreate(userId: number, images: ImagePostEntity[], description: string) {
    const post = new PostEntity();
    post.ownerId = userId;
    post.status = PostStatus.PUBLISHED;
    post.description = description;
    post.images = images.map(image => image.changeStatusToPublished());
    return post;
  }

  static create(userId: number, description: string) {
    const post = new PostEntity();
    post.ownerId = userId;
    post.status = PostStatus.PUBLISHED;
    post.description = description;
    post.images = [];
    return post;
  }

  setPostStatusToDeleted() {
    this.status = PostStatus.DELETED;
    this.images = this.images.map(image => image.changeStatusToDeletedForEachInstance());
  }

  updateDescription(description: string) {
    this.description = description;
  }

  isOwner(userId: number) {
    return this.ownerId === userId;
  }

  hasLastImage() {
    //filter modules with status publisher and sizeType contains HUGE_HD1_1 or HUGE_HD16_9 or HUGE_HD4_5
    const images = this.images.filter(image => image.isPublished() && image.isHugeSize());
    return images.length === 1;
  }

  changeStatusToDeletedForImage(uploadId: string) {
    this.images = this.images.filter(image => image.changeStatusToDeleted(uploadId));
    return this;
  }

  addImages(userId: number, images: BaseImageEntity[]) {
    this.images = images.map(image => ImagePostEntity.initCreate(userId, image));
    return this;
  }

  getImagesUrlsForDelete(uploadId: string): string[] {
    return this.images.filter(image => image.resourceId === uploadId).map(image => image.url);
  }
}
