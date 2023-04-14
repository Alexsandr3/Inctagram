import { BaseDateEntity } from './base-date.entity';
import { optionsImageAvatar } from '../default-options-images';

enum ImageType {
  AVATAR = 'AVATAR',
  POST = 'POST',
}

enum ImageSizeType {
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

  static initCreate(userId: number, urlImageAvatar: { key: string; fieldId: string }, photo: Buffer) {
    const instance = new ImageEntity();
    instance.profileId = userId;
    instance.imageType = ImageType.AVATAR;
    instance.sizeType = ImageSizeType.LARGE;
    instance.url = urlImageAvatar.key;
    instance.width = optionsImageAvatar.defaultWidth;
    instance.height = optionsImageAvatar.defaultHeight;
    instance.fileSize = photo.length;
    return instance;
  }
}
