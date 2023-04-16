import { Injectable } from '@nestjs/common';
import { ProfileAvatarViewModel } from '../users/api/view-models/user-images-view.dto';
import { BaseImageEntity } from './domain/base-image.entity';
import { BasePhotoSizeViewModel } from './api/view-models/base-photo-size-view.dto';

@Injectable()
export class ImagesMapperServiceForView {
  private async mapperEntity(
    width: number,
    height: number,
    fileSize: number,
    url: string,
  ): Promise<BasePhotoSizeViewModel> {
    return new BasePhotoSizeViewModel(url, width, height, fileSize);
  }

  async imageEntityToViewModel(instancesImages: BaseImageEntity[]): Promise<ProfileAvatarViewModel> {
    //results is array of url images need to return
    const images = [];
    for (let i = 0; i < instancesImages.length; i++) {
      const width = instancesImages[i].width;
      const height = instancesImages[i].height;
      const fileSize = instancesImages[i].fileSize;
      const url = instancesImages[i].url;
      const image = await this.mapperEntity(width, height, fileSize, url);
      images.push(image);
    }
    return new ProfileAvatarViewModel(...images);
  }
}
