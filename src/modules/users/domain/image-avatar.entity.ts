import { BaseImageEntity } from '../../images/domain/base-image.entity';

export class ImageAvatarEntity extends BaseImageEntity {
  userId: number;
  constructor() {
    super();
  }
}
