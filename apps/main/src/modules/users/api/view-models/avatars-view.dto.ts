import { AvatarViewDto } from './avatar-view.dto';

/**
 * @description Profile avatar view model
 */
export class AvatarsViewModel {
  /**
   * @param main -> Must contain medium photo size (192x192) and thumbnail photo size (45x45)
   */
  avatars: AvatarViewDto[];

  constructor(avatars: AvatarViewDto[]) {
    this.avatars = avatars;
  }
}
