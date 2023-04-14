import { BaseDateEntity } from './base-date.entity';
import { ImageSizeConfig } from '../../images-editor/image-size-config.type';

export enum ImageType {
  AVATAR = 'AVATAR',
  POST = 'POST',
}

export enum ImageSizeType {
  THUMBNAIL = 'THUMBNAIL',
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE',
  HUGE_HD = 'HUGE_HD',
}

export class ImageEntity extends BaseDateEntity {
  id: number;
  profileId: number;
  imageType: ImageType;
  sizeType: ImageSizeType;
  url: string;
  width: number;
  height: number;
  fileSize: number;

  constructor() {
    super();
  }

  static initCreateImageEntity(
    userId: number,
    size: string,
    type: ImageType,
    urlImageAvatar: { key: string; fieldId: string },
    photo: Buffer,
  ) {
    const instance = new ImageEntity();
    instance.profileId = userId;
    instance.imageType = type;
    instance.sizeType = size as ImageSizeType;
    instance.url = urlImageAvatar.key;
    instance.width = ImageSizeConfig[size].defaultWidth;
    instance.height = ImageSizeConfig[size].defaultHeight;
    instance.fileSize = photo.length;
    return instance;
  }
}
