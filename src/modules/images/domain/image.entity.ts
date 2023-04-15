import { BaseDateEntity } from '../../users/domain/base-date.entity';
import { ImageSizeConfig } from '../image-size-config.type';
import { ImageSizeType } from '../type/image-size.type';
import { ImageType } from '../type/image.type';

export class ImageEntity extends BaseDateEntity {
  id: number;
  userId: number;
  ownerId: number; //postId - profileId
  imageType: ImageType;
  sizeType: ImageSizeType;
  url: string;
  width: number;
  height: number;
  fileSize: number;
  fieldId: string;

  constructor() {
    super();
  }

  static initCreateImageEntity(
    userId: number,
    ownerId: number,
    size: string,
    type: ImageType,
    urlImageAvatar: { key: string; fieldId: string },
    photo: Buffer,
  ) {
    const instance = new ImageEntity();
    instance.userId = userId;
    if (type === ImageType.AVATAR) instance.ownerId = ownerId;
    if (type === ImageType.POST) instance.ownerId = ownerId;
    instance.imageType = type;
    instance.sizeType = size as ImageSizeType;
    instance.url = urlImageAvatar.key;
    instance.width = ImageSizeConfig[size].defaultWidth;
    instance.height = ImageSizeConfig[size].defaultHeight;
    instance.fileSize = photo.length;
    instance.fieldId = urlImageAvatar.fieldId;
    return instance;
  }
}
