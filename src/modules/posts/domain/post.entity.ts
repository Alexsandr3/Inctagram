import { BaseDateEntity } from '../../../main/entities/base-date.entity';
import { ImagePostEntity } from './image-post.entity';
import { Type } from 'class-transformer';
import { Post } from '@prisma/client';
import { BaseImageEntity } from '../../images/domain/base-image.entity';
import { PostStatus } from '../types/post-status.type';

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
  }

  updateDescription(description: string) {
    this.description = description;
  }

  isOwner(userId: number) {
    return this.ownerId === userId;
  }

  hasLastImage() {
    //filter images with status publisher and sizeType contains HUGE_HD1_1 or HUGE_HD16_9 or HUGE_HD4_5
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
}
