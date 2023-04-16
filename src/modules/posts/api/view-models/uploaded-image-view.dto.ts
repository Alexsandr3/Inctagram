import { PostImageViewModel } from './post-image-view.dto';

/**
 * @description -> This class is used to return the post images
 */
export class UploadedImageViewModel {
  /**
   * @param main -> Must contain medium photo size (___________) and  photo size (___________)
   */
  image: PostImageViewModel;

  constructor(image: PostImageViewModel) {
    this.image = image;
  }
}
