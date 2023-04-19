import { BaseImageEntity } from '../../images/domain/base-image.entity';
import { PostStatus } from './post.entity';

export class ImagePostEntity extends BaseImageEntity {
  postId: number;
  status: PostStatus;
  constructor() {
    super();
  }

  static initCreate(userId: number, baseImage: BaseImageEntity): ImagePostEntity {
    const imagePost = new ImagePostEntity();
    imagePost.postId = null;
    imagePost.status = PostStatus.PENDING;
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

  changeStatusToDeleted(resourceId: string) {
    if (this.resourceId !== resourceId) return;
    this.status = PostStatus.DELETED;
    return this;
  }
}
