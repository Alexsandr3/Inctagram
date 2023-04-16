import { PhotoSizeViewModel } from '../../../images/api/view-models/photo-size-view.dto';

/**
 * @description Profile avatar view model
 */
export class ProfileAvatarViewModel {
  /**
   * @param main -> Must contain medium photo size (192x192) and thumbnail photo size (45x45)
   */
  avatar: PhotoSizeViewModel[];

  constructor(...avatar: PhotoSizeViewModel[]) {
    this.avatar = avatar;
  }
}
