import { BasePhotoSizeViewModel } from '../../../images/api/view-models/base-photo-size-view.dto';

/**
 * @description Profile avatar view model
 */
export class ProfileAvatarViewModel {
  /**
   * @param main -> Must contain medium photo size (192x192) and thumbnail photo size (45x45)
   */
  avatars: BasePhotoSizeViewModel[];

  constructor(...avatars: BasePhotoSizeViewModel[]) {
    this.avatars = avatars;
  }
}
