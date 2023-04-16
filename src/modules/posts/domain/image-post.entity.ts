import { BaseImageEntity } from '../../images/domain/baseImageEntity';

export class ImagePostEntity extends BaseImageEntity {
  postId: number;
  constructor() {
    super();
  }
}
