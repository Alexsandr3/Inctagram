import { Injectable } from '@nestjs/common';
import { ProfileAvatarViewModel } from '../users/api/view-models/user-images-view.dto';
import { BaseImageEntity } from './domain/baseImageEntity';
import { PhotoSizeViewModel } from './api/view-models/photo-size-view.dto';

@Injectable()
export class ImagesMapperServiceForView {
  private async mapperEntity(
    width: number,
    height: number,
    fileSize: number,
    uploadId: number,
    url: string,
  ): Promise<PhotoSizeViewModel> {
    return new PhotoSizeViewModel(width, height, fileSize, uploadId, url);
  }

  async imageEntityToViewModel(instancesImages: BaseImageEntity[]): Promise<ProfileAvatarViewModel> {
    //results is array of url images need to return
    const images = [];
    for (let i = 0; i < instancesImages.length; i++) {
      const width = instancesImages[i].width;
      const height = instancesImages[i].height;
      const fileSize = instancesImages[i].fileSize;
      const uploadId = instancesImages[i].id;
      const url = instancesImages[i].url;
      const image = await this.mapperEntity(width, height, fileSize, uploadId, url);
      images.push(image);
    }
    return new ProfileAvatarViewModel(...images);
  }
}
