import { BaseDateEntity } from '../../../main/entities/base-date.entity';
import { ImageSizeConfig } from '../image-size-config.type';
import { ImageSizeType } from '../type/image-size.type';
import { ImageType } from '../type/image.type';

export class BaseImageEntity extends BaseDateEntity {
  id: number;
  imageType: ImageType;
  sizeType: ImageSizeType;
  url: string;
  width: number;
  height: number;
  fileSize: number;
  fieldId: string;
  resourceId: string;

  constructor() {
    super();
  }

  static initCreateImageEntity(
    size: string,
    type: ImageType,
    urlImageAvatar: { url: string; fieldId: string },
    photo: Buffer,
    resourceId: string,
  ) {
    const instance = new BaseImageEntity();
    instance.imageType = type;
    instance.sizeType = size as ImageSizeType;
    instance.url = urlImageAvatar.url;
    instance.width = ImageSizeConfig[size].defaultWidth;
    instance.height = ImageSizeConfig[size].defaultHeight;
    instance.fileSize = photo.length;
    instance.fieldId = urlImageAvatar.fieldId;
    instance.resourceId = resourceId;
    return instance;
  }
}
