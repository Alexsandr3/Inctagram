import { BasePhotoSizeViewModel } from '../../../images/api/view-models/base-photo-size-view.dto';
import { AvatarEntity } from '../../domain/avatar.entity';

/**
 * Avatar view dto
 */
export class AvatarViewDto extends BasePhotoSizeViewModel {
  constructor(avatar: AvatarEntity) {
    super(avatar.url, avatar.width, avatar.height, avatar.fileSize);
  }
}
