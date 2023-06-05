import { PostImageViewModel } from './post-image-view.dto';

/**
 * @description -> This class is used to return the post modules
 */
export class UploadedImageViewModel {
  /**
   * @param main -> Must contain medium photo size (___________) and  photo size (___________)
   */
  images: PostImageViewModel[];

  constructor(images: PostImageViewModel[]) {
    this.images = images;
  }
}
