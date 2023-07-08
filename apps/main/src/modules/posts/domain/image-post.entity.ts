import { BaseImageEntity } from '@common/main/entities/base-image.entity';
import { PostImage } from '@prisma/client';
import { PostStatus } from '@common/main/types/post-status.type';

export class ImagePostEntity extends BaseImageEntity implements PostImage {
  postId: number;
  ownerId: number;
  status: PostStatus;
  constructor() {
    super();
  }

  static initCreate(userId: number, baseImage: BaseImageEntity): ImagePostEntity {
    const imagePost = new ImagePostEntity();
    imagePost.postId = null;
    imagePost.ownerId = userId;
    imagePost.status = PostStatus.PUBLISHED;
    imagePost.imageType = baseImage.imageType;
    imagePost.sizeType = baseImage.sizeType;
    imagePost.url = baseImage.url;
    imagePost.width = baseImage.width;
    imagePost.height = baseImage.height;
    imagePost.fileSize = baseImage.fileSize;
    imagePost.fieldId = baseImage.fieldId;
    imagePost.resourceId = baseImage.resourceId;
    return imagePost;
  }

  changeStatusToPublished(): ImagePostEntity {
    this.status = PostStatus.PUBLISHED;
    return this;
  }

  changeStatusToDeleted(uploadId: string) {
    if (this.resourceId === uploadId) {
      this.status = PostStatus.DELETED;
    }
    return this;
  }

  isPublished() {
    return this.status === PostStatus.PUBLISHED;
  }

  isHugeSize() {
    return this.sizeType === 'HUGE_HD1_1' || this.sizeType === 'HUGE_HD16_9' || this.sizeType === 'HUGE_HD4_5';
  }

  changeStatusToDeletedForEachInstance() {
    this.status = PostStatus.DELETED;
    return this;
  }

  getImagesUrls(): string {
    return this.url;
  }
}
