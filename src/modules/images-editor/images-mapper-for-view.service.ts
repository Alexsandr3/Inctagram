import { Injectable } from '@nestjs/common';
import { PhotoSizeViewModel, ProfileAvatarViewModel } from '../users/api/view-models/user-images-view.dto';
import { ImageEntity } from '../users/domain/image.entity';

@Injectable()
export class ImagesMapperServiceForView {
  private async mapperEntity(url: string, imageEntity: ImageEntity): Promise<PhotoSizeViewModel> {
    return new PhotoSizeViewModel(url, imageEntity.width, imageEntity.height, imageEntity.fileSize);
  }

  async imageEntityToViewModel(urlImages: string[], instancesImages: ImageEntity[]): Promise<ProfileAvatarViewModel> {
    //results is array of url images need to return
    const images = [];
    for (let i = 0; i < instancesImages.length; i++) {
      const url = urlImages[i]['key'];
      const image = instancesImages[i];
      const res = await this.mapperEntity(url, image);
      images.push(res);
    }
    return new ProfileAvatarViewModel(...images);
  }
}
