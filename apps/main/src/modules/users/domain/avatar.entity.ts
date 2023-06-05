import { BaseImageEntity } from '@common/main/entities/base-image.entity';
import { AvatarImage } from '@prisma/client';

export class AvatarEntity extends BaseImageEntity implements AvatarImage {
  profileId: number;
  constructor() {
    super();
  }

  static initCreate(userId: number, baseImage: BaseImageEntity): AvatarEntity {
    const avatar = new AvatarEntity();
    avatar.profileId = userId;
    avatar.imageType = baseImage.imageType;
    avatar.sizeType = baseImage.sizeType;
    avatar.url = baseImage.url;
    avatar.width = baseImage.width;
    avatar.height = baseImage.height;
    avatar.fileSize = baseImage.fileSize;
    avatar.fieldId = baseImage.fieldId;
    return avatar;
  }

  setId(id: number) {
    this.id = id;
  }
}
