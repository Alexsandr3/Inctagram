import { PostImageVersionViewModel, PostImageViewModel } from './post-image-view.dto';
import { PostEntity } from '../../domain/post.entity';
import { BasePhotoSizeViewModel } from '../../../images/api/view-models/base-photo-size-view.dto';
import { ImagePostEntity } from '../../domain/image-post.entity';

export class PostViewModel {
  id: number;
  ownerId: number;
  description: string;
  location: string;
  images: PostImageViewModel[];
  createdAt: Date;
  updatedAt: Date;

  constructor(post: PostEntity) {
    this.id = post.id;
    this.ownerId = post.ownerId;
    this.description = post.description;
    this.location = post.location;
    this.images = this.prepareImagesToView(post.images);
    this.createdAt = post.createdAt;
    this.updatedAt = post.updatedAt;
  }

  prepareImagesToView(images: ImagePostEntity[]) {
    const newImages = [];
    const imageMap = new Map();
    images.forEach(image => {
      if (!imageMap.has(image.resourceId)) {
        imageMap.set(image.resourceId, []);
      }
      imageMap.get(image.resourceId).push(image);
    });
    for (const [resourceId, imageGroup] of imageMap.entries()) {
      let versions = new PostImageVersionViewModel();

      imageGroup.forEach(image => {
        const sizeType = image.sizeType.toLowerCase();
        const basePhotoSizeViewModel = new BasePhotoSizeViewModel(image.url, image.width, image.height, image.fileSize);

        if (sizeType.startsWith('huge')) {
          versions.huge = basePhotoSizeViewModel;
        } else if (sizeType.startsWith('large')) {
          versions.large = basePhotoSizeViewModel;
        }
      });

      const postImageViewModel = new PostImageViewModel(resourceId, versions);
      newImages.push(postImageViewModel);
    }
    return newImages;
  }
}
