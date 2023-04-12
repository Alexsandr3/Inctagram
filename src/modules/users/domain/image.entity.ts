import { BaseDateEntity } from './base-date.entity';

export const sizeImageAvatar = {
  HUGE_HD: {
    defaultWidth: 1280,
    defaultHeight: 720,
  },
  LARGE: {
    defaultWidth: 640,
    defaultHeight: 360,
  },
  MEDIUM: {
    defaultWidth: 192,
    defaultHeight: 192,
  },
  SMALL: {
    defaultWidth: 160,
    defaultHeight: 90,
  },
  THUMBNAIL: {
    defaultWidth: 45,
    defaultHeight: 45,
  },
};

export enum TypeSizeImage {
  THUMBNAIL = 'THUMBNAIL',
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE',
  HUGE_HD = 'HUGE_HD',
}

export enum TypeAffiliationImage {
  AVATAR = 'AVATAR',
  POST = 'POST',
}

export class ImageEntity extends BaseDateEntity {
  id: number;
  profileId: number;
  affiliation: TypeAffiliationImage | null;
  typeSize: TypeSizeImage | null;
  url: string;
  width: number;
  height: number;
  fileSize: number;

  constructor() {
    super();
  }

  static initCreateImageEntity(
    userId: number,
    urlImageAvatar: { key: string; fieldId: string },
    photo: Buffer,
    typeSize: TypeSizeImage,
    defaultWidth: number,
    defaultHeight: number,
  ) {
    const instance = new ImageEntity();
    instance.profileId = userId;
    instance.affiliation = TypeAffiliationImage.AVATAR;
    instance.typeSize = typeSize;
    instance.url = urlImageAvatar.key;
    instance.width = defaultWidth;
    instance.height = defaultHeight;
    instance.fileSize = photo.length;
    return instance;
  }

  static initCreateMediumSize(userId: number, urlImageAvatar: { key: string; fieldId: string }, photo: Buffer) {
    return this.initCreateImageEntity(
      userId,
      urlImageAvatar,
      photo,
      TypeSizeImage.MEDIUM,
      sizeImageAvatar.MEDIUM.defaultWidth,
      sizeImageAvatar.MEDIUM.defaultHeight,
    );
  }

  static initCreateThumbnailSize(userId: number, urlImageAvatar: { key: string; fieldId: string }, photo: Buffer) {
    return this.initCreateImageEntity(
      userId,
      urlImageAvatar,
      photo,
      TypeSizeImage.THUMBNAIL,
      sizeImageAvatar.THUMBNAIL.defaultWidth,
      sizeImageAvatar.THUMBNAIL.defaultHeight,
    );
  }
}
