import { PhotoSizeViewModel } from '../../../images/api/view-models/photo-size-view.dto';

/**
 * @description -> This class is used to return the post images
 */
export class PostImagesViewDto {
  /**
   * @param main -> Must contain medium photo size (___________) and  photo size (___________)
   */
  image: PhotoSizeViewModel;

  constructor(image: PhotoSizeViewModel) {
    this.image = image;
  }
}
