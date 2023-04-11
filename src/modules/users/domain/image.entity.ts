import { BaseDateEntity } from './base-date.entity';
import { optionsImageAvatar } from '../default-options-images';

enum TypeSizeImage {
  THUMBNAIL = 'THUMBNAIL',
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE',
  HUGE_HD = 'HUGE_HD',
}

enum TypeAffiliationImage {
  AVATAR = 'AVATAR',
  POST = 'POST',
}

export class ImageEntity extends BaseDateEntity {
  id: number;
  profileId: number;
  affiliation: TypeAffiliationImage.AVATAR | null;
  typeSize: TypeSizeImage.LARGE | null;
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
    instance.affiliation = TypeAffiliationImage.AVATAR;
    instance.typeSize = TypeSizeImage.LARGE;
    instance.url = urlImageAvatar.key;
    instance.width = optionsImageAvatar.defaultWidth;
    instance.height = optionsImageAvatar.defaultHeight;
    instance.fileSize = photo.length;
    return instance;
  }
}
